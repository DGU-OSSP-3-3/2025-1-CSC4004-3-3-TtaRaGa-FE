export async function postFilterTime(lat: number, lon: number, targetTime: number) {
  const response = await fetch('http://192.168.0.3:8080/api/route/bike-route-time', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startLat: lat,
      startLon: lon,
      targetTime: targetTime,
    }),
  });

  if (!response.ok) {
    throw new Error(`서버 에러: ${response.status}`);
  }

  return response.json();
}