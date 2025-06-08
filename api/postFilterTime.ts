export async function postFilterTime1(lat: number, lon: number, timeLimitMinutes: number) {
  const response = await fetch('https://api.dev.ttaraga.shop/api/route/best', {
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

  const result = await response.json(); // ✅ 응답 본문을 파싱
  console.log('✅ 서버 응답 결과1 (GeoJSON):', result); // ✅ 여기서 실제 데이터를 로그

  return result;
}


export async function postFilterTime2(lat: number, lon: number, targetTime: number) {
  const response = await fetch('https://api.dev.ttaraga.shop/api/route/bike-route-time', {
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
  console.log('✅ 서버 응답 결과2 (GeoJSON):', response); // ✅ 여기서 실제 데이터를 로그
  return response.json();
}