// ============================================================
// Smart Image Engine for Hotels & Rooms (High-Definition Unsplash)
// ============================================================

const HOTEL_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85", // Luxury Resort pool
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85", // Modern boutique hotel
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85", // Grand palace hotel
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85", // Tropical villa with pool
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85", // Beachfront ocean view
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=85", // Modern urban luxury hotel
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85", // Penthouse luxury suite
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85", // Warm ambient hotel room
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85", // Cozy boutique suite
  "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=85", // Mountain resort chalet
];

const CITY_IMAGES = {
  goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85",
  mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=85",
  delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=85",
  kanpur: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
  jaipur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85",
  bangalore: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=85",
  bengaluru: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=85",
  pune: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
  kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
};

const ROOM_IMAGES = {
  deluxe: [
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85",
  ],
  suite: [
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=85",
  ],
  sea: [
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=85",
  ],
  ocean: [
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85",
  ],
  executive: [
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=85",
  ],
  single: [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85",
  ],
  double: [
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=85",
  ],
  presidential: [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85",
  ],
  villa: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=85",
  ]
};

const DEFAULT_ROOM_IMAGE = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=85";

/**
 * Get dynamic HD hotel image based on hotel metadata
 */
export function getHotelImage(hotel) {
  if (!hotel) return HOTEL_IMAGES[0];

  // Match city specific image if present
  if (hotel.city) {
    const cityKey = hotel.city.trim().toLowerCase();
    if (CITY_IMAGES[cityKey]) {
      return CITY_IMAGES[cityKey];
    }
  }

  // Deterministic selection based on hotel ID
  const index = Math.abs((hotel.id || 0) % HOTEL_IMAGES.length);
  return HOTEL_IMAGES[index];
}

/**
 * Get a 3-photo gallery for the hotel details page
 */
export function getHotelGallery(hotel) {
  const baseImg = getHotelImage(hotel);
  const id = hotel?.id || 1;
  const img2 = HOTEL_IMAGES[(id + 1) % HOTEL_IMAGES.length];
  const img3 = HOTEL_IMAGES[(id + 2) % HOTEL_IMAGES.length];
  return [baseImg, img2, img3];
}

/**
 * Get room image based on room_type name or capacity
 */
export function getRoomImage(room, hotelId = 0) {
  if (!room || !room.room_type) return DEFAULT_ROOM_IMAGE;

  const typeLower = room.room_type.toLowerCase();

  for (const [key, imgArray] of Object.entries(ROOM_IMAGES)) {
    if (typeLower.includes(key)) {
      const idx = Math.abs(((room.id || 0) + hotelId) % imgArray.length);
      return imgArray[idx];
    }
  }

  // Fallback to deterministic hotel/room index
  const fallbackIndex = Math.abs(((room.id || 0) + hotelId) % HOTEL_IMAGES.length);
  return HOTEL_IMAGES[fallbackIndex];
}

/**
 * Get random realistic rating between 4.7 and 4.95 based on ID
 */
export function getHotelRating(hotelId = 1) {
  const ratings = ["4.9", "4.8", "4.95", "4.85", "4.7", "5.0"];
  const reviews = [148, 92, 230, 84, 310, 175, 64];
  const rIdx = Math.abs(hotelId % ratings.length);
  const revIdx = Math.abs(hotelId % reviews.length);
  return {
    rating: ratings[rIdx],
    reviewsCount: reviews[revIdx],
  };
}
