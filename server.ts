import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load mock dataset safely
let mockData: any = null;
try {
  const mockFilePath = path.resolve(__dirname, 'src/data/mock-data.json');
  if (fs.existsSync(mockFilePath)) {
    mockData = JSON.parse(fs.readFileSync(mockFilePath, 'utf-8'));
  }
} catch (err) {
  console.error('Failed to read mock-data.json:', err);
}

// Initializing server-side Gemini client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Route 1: /api/search (SerpApi Proxy & Sanitizer with Mock Mode fallback)
app.post('/api/search', async (req, res) => {
  try {
    const { type, query, origin, destination, adults } = req.body;
    const useMock = process.env.USE_MOCK_DATA === 'true' || !process.env.SERPAPI_API_KEY;

    // Allowed engines whitelist
    const engineMap: Record<string, string> = {
      flights: 'google_flights',
      hotels: 'google_hotels',
      local: 'google_local',
      activities: 'google_local',
      events: 'google_events',
    };

    const engine = engineMap[type] || 'google_local';

    if (useMock) {
      if (!mockData) {
        return res.status(500).json({ error: 'Mock dataset unavailable' });
      }

      // Return sanitized mock subsets based on category
      if (type === 'flights') {
        const flights = mockData.flights || [];
        return res.json({
          status: 'success',
          category: 'flights',
          results: flights,
        });
      }

      if (type === 'hotels') {
        const hotels = mockData.hotels || [];
        return res.json({
          status: 'success',
          category: 'hotels',
          results: hotels,
        });
      }

      if (type === 'local' || type === 'activities' || type === 'events') {
        const activities = mockData.activities || [];
        return res.json({
          status: 'success',
          category: 'activities',
          results: activities,
        });
      }

      return res.json({
        status: 'success',
        results: mockData,
      });
    }

    // Live SerpApi call
    const params = new URLSearchParams({
      engine,
      api_key: process.env.SERPAPI_API_KEY || '',
      hl: 'en',
      gl: 'in',
    });

    if (type === 'flights') {
      if (origin) params.append('departure_id', origin);
      if (destination) params.append('arrival_id', destination);
      params.append('currency', 'INR');
    } else if (type === 'hotels') {
      params.append('q', destination || query || 'Munnar');
      params.append('currency', 'INR');
    } else {
      params.append('q', query || destination || 'Munnar tourist attractions');
    }

    const serpUrl = `https://serpapi.com/search.json?${params.toString()}`;
    const response = await fetch(serpUrl);

    if (!response.ok) {
      // Fallback gracefully to mock data if live rate limited
      return res.json({
        status: 'fallback_mock',
        category: type,
        results: mockData ? (mockData[type] || mockData.activities) : [],
      });
    }

    const rawData = await response.json();

    // Payload Sanitization: Strip sensitive keys & pagination tokens
    const sanitized: any = {
      status: 'success',
      category: type,
    };

    if (type === 'flights') {
      sanitized.results = (rawData.best_flights || rawData.other_flights || []).slice(0, 8).map((f: any, idx: number) => ({
        id: `live-flt-${idx}`,
        airline: f.flights?.[0]?.airline || 'Air India',
        flight_number: f.flights?.[0]?.flight_number || 'AI-101',
        departure: f.flights?.[0]?.departure_airport?.time || '08:00',
        arrival: f.flights?.[0]?.arrival_airport?.time || '09:30',
        duration: f.total_duration ? `${Math.floor(f.total_duration / 60)}h ${f.total_duration % 60}m` : '1h 30m',
        price: f.price ? `₹${f.price.toLocaleString('en-IN')}` : '₹4,200',
        badge: idx === 0 ? 'Best' : idx === 1 ? 'Cheapest' : 'Fastest',
      }));
    } else if (type === 'hotels') {
      sanitized.results = (rawData.properties || []).slice(0, 6).map((h: any, idx: number) => ({
        id: `live-hot-${idx}`,
        name: h.name,
        location: h.neighborhood || destination || 'Central Area',
        rating: h.overall_rating || 4.7,
        reviews_count: h.reviews || 120,
        price_per_night: h.rate_per_night?.lowest ? `₹${h.rate_per_night.lowest}` : '₹6,500',
        amenities: (h.amenities || []).slice(0, 4),
        badge: idx === 0 ? 'Handpicked Stay' : 'Popular',
      }));
    } else {
      sanitized.results = (rawData.local_results || rawData.events_results || []).slice(0, 8).map((a: any, idx: number) => ({
        id: `live-act-${idx}`,
        title: a.title,
        category: a.type || 'Sightseeing',
        rating: a.rating || 4.8,
        price: '₹500',
        duration: '2 hours',
      }));
    }

    return res.json(sanitized);
  } catch (err: any) {
    console.error('SerpApi proxy error:', err);
    return res.json({
      status: 'fallback_mock',
      results: mockData ? mockData[req.body.type] || mockData.activities : [],
    });
  }
});

// Route 2: /api/parse-intent (Natural Language Trip Prompt Parser)
app.post('/api/parse-intent', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Valid prompt is required' });
  }

  const promptText = prompt.trim();

  // If Gemini API is available and mock mode is false, call Gemini
  if (ai && process.env.USE_MOCK_DATA !== 'true') {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Parse this travel prompt into structured trip intent: "${promptText}"`,
        config: {
          systemInstruction: `You are the natural language intent parser for BEEMVOY, an India-first travel planning MVP.
Extract the user's travel parameters and return valid JSON matching this schema:
{
  "destination": "Goa",
  "origin": null,
  "duration_days": 3,
  "start_date": null,
  "end_date": null,
  "budget_total_inr": 15000,
  "travellers": 1,
  "interests": [],
  "travel_pace": "balanced",
  "missing_fields": ["origin", "travel_dates"],
  "assumptions": []
}`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              destination: { type: Type.STRING },
              origin: { type: Type.STRING, nullable: true },
              duration_days: { type: Type.INTEGER },
              start_date: { type: Type.STRING, nullable: true },
              end_date: { type: Type.STRING, nullable: true },
              budget_total_inr: { type: Type.INTEGER, nullable: true },
              travellers: { type: Type.INTEGER },
              interests: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              travel_pace: { type: Type.STRING },
              missing_fields: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              assumptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['destination', 'duration_days', 'travel_pace', 'missing_fields', 'assumptions'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ status: 'success', intent: parsed });
    } catch (llmErr) {
      console.warn('Gemini intent parse fallback to heuristic extractor:', llmErr);
    }
  }

  // Robust Heuristic Fallback compliant with AGENTS.md Contract
  const lower = promptText.toLowerCase();

  // Detect Destination
  let destination = 'Munnar';
  if (lower.includes('goa')) destination = 'Goa';
  else if (lower.includes('jaipur')) destination = 'Jaipur';
  else if (lower.includes('manali')) destination = 'Manali';
  else if (lower.includes('kerala') || lower.includes('munnar')) destination = 'Munnar';
  else if (lower.includes('kashmir')) destination = 'Kashmir';
  else if (lower.includes('ladakh')) destination = 'Ladakh';

  // Detect Duration
  let duration_days = 3;
  const dayMatch = lower.match(/(\d+)\s*(-|\s)?(day|days)/);
  if (dayMatch) {
    duration_days = parseInt(dayMatch[1], 10);
  } else if (lower.includes('weekend')) {
    duration_days = 2;
  } else if (lower.includes('week')) {
    duration_days = 7;
  }

  // Detect Budget
  let budget_total_inr: number | null = null;
  const budgetMatch = lower.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i) || lower.match(/under\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
  if (budgetMatch) {
    budget_total_inr = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
  } else if (destination === 'Goa') {
    budget_total_inr = 15000;
  } else if (destination === 'Munnar') {
    budget_total_inr = 30000;
  }

  // Detect Pace
  let travel_pace: 'relaxed' | 'balanced' | 'fast-paced' = 'balanced';
  if (lower.includes('relaxed') || lower.includes('chill') || lower.includes('slow')) travel_pace = 'relaxed';
  if (lower.includes('fast') || lower.includes('packed') || lower.includes('expedition')) travel_pace = 'fast-paced';

  // Detect Interests
  const interests: string[] = [];
  if (lower.includes('trek') || lower.includes('hike') || lower.includes('mountain')) interests.push('Mountain Treks');
  if (lower.includes('tea') || lower.includes('plantation')) interests.push('Tea Plantations');
  if (lower.includes('beach') || lower.includes('sea')) interests.push('Beaches');
  if (lower.includes('heritage') || lower.includes('history') || lower.includes('royal')) interests.push('Heritage');
  if (lower.includes('food') || lower.includes('culinary')) interests.push('Culinary Trails');

  const intent = {
    destination,
    origin: lower.includes('bangalore') || lower.includes('blr') ? 'BLR' : lower.includes('mumbai') || lower.includes('bom') ? 'BOM' : null,
    duration_days,
    start_date: null,
    end_date: null,
    budget_total_inr,
    travellers: 1,
    interests,
    travel_pace,
    missing_fields: ['origin', 'travel_dates'],
    assumptions: ['Default departure from nearest major hub', 'Economy airfare basis'],
  };

  return res.json({ status: 'success', intent });
});

// Dev / Prod Mode Server Setup
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`BEEMVOY MVP Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
