// High-fidelity image assets and gradient visual backdrops
// Zero-broken-image policy: resilient inline SVG and high-resolution assets

export const travelImages = {
  munnarRidge: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
  teaPlantation: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  kolukkumalaiSunrise: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  heritageBungalow: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  goaBeach: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
  teaTasting: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

// SVG Fallback renderer for resilient zero-broken-image guarantees
export const getFallbackImage = (category: string) => {
  if (category === 'flight') {
    return 'linear-gradient(135deg, #7e22ce 0%, #3b82f6 100%)';
  }
  if (category === 'stay') {
    return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  }
  return 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)';
};
