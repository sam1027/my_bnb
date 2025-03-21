// src/hooks/useKakaoLoader.ts
import { useEffect, useState } from 'react';

export function useKakaoLoader(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const scriptId = 'kakao-map-sdk';

    if (document.getElementById(scriptId)) {
      if (window.kakao?.maps) {
        setReady(true);
      } else {
        const check = setInterval(() => {
          if (window.kakao?.maps) {
            clearInterval(check);
            setReady(true);
          }
        }, 100);
      }
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&libraries=services`; // 꼭 JS 키로 바꾸세요!
    script.async = true;
    script.onload = () => {
      if (window.kakao?.maps?.load) {
        window.kakao.maps.load(() => {
          setReady(true);
        });
      }
    };

    document.head.appendChild(script);
  }, []);

  return ready;
}
