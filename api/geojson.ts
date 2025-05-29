// src/api/geojson.ts
export const fetchGeoJson = async () => {
    try {
      const response = await fetch('http://172.30.1.36:8080/api/route/test-bike-route');
      const data = await response.json();
      console.log('GeoJSON:', data);
      return data;
    } catch (error) {
      console.error('❌ GeoJSON fetch error:', error);
      throw error;
    }
  };

  export async function fetchBestRoute(lat: number, lon: number, timeLimitMinutes: number) {
    const response = await fetch('http://172.30.1.24:8080/api/route/best', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat,
        lon,
        timeLimitMinutes,
      }),
  
    });
  
    if (!response.ok) {
      throw new Error(`서버 에러: ${response.status}`);
    }
  
    return response.json(); // GeoJSON 형태의 결과가 리턴된다고 가정
  }