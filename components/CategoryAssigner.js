// Basic keyword-based categorization enhanced with coordinate-based POI lookup
import { POIS } from './poiData';

const categories = [
  { keywords: ['cafe', 'restaurant', 'food', 'starbucks'], category: 'Food & Dining' },
  { keywords: ['uber', 'ola', 'taxi', 'cab'], category: 'Transport' },
  { keywords: ['amazon', 'flipkart', 'shop', 'mall', 'bazaar'], category: 'Shopping' },
  { keywords: ['gym', 'fitness'], category: 'Health & Fitness' },
  { keywords: ['movie', 'cinema', 'theatre'], category: 'Entertainment' }
];

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (v) => v * Math.PI / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function assignCategory(transaction) {
  // transaction may include { merchant, lat, lon }
  if (!transaction) return 'Others';

  // 1) Try coordinates-based POI match if lat/lon provided
  if (transaction.lat && transaction.lon) {
    let best = null;
    for (let poi of POIS) {
      const d = haversineDistance(transaction.lat, transaction.lon, poi.lat, poi.lon);
      if (d <= 0.5) { // within 500m
        if (!best || d < best.d) best = { poi, d };
      }
    }
    if (best) return best.poi.category;
  }

  // 2) Merchant keyword matching
  if (transaction.merchant) {
    const merchantLower = transaction.merchant.toLowerCase();
    for (let c of categories) {
      if (c.keywords.some(word => merchantLower.includes(word))) {
        return c.category;
      }
    }
  }

  // 3) Fallback
  return 'Others';
}
