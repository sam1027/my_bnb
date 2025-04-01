import { useEffect, useRef, useState } from 'react';

interface IProps {
  lat?: number;
  lon?: number;
  setMap?: (map: any) => void;
  setMarker?: (marker: any) => void;
}

const KakaoMapViewer = (prop: IProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // SDK 로딩
  useEffect(() => {
    const scriptId = 'kakao-map-sdk';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      console.log('카카오맵 SDK 로딩 성공');
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log('카카오맵 로드 완료');
          setReady(true);
        });
      } else {
        console.error('카카오맵 SDK 로딩 실패: window.kakao 또는 window.kakao.maps가 없습니다.');
      }
    };
    script.onerror = (error) => {
      console.error('카카오맵 SDK 스크립트 로딩 실패:', error);
    };
    document.head.appendChild(script);

    return () => {
      const scriptElement = document.getElementById(scriptId);
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!ready || !mapRef.current || !window.kakao?.maps) {
      console.log('지도 초기화 조건:', {
        ready,
        mapRef: !!mapRef.current,
        kakao: !!window.kakao?.maps,
      });
      return;
    }

    try {
      const options = {
        center: new window.kakao.maps.LatLng(prop.lat || 37.5665, prop.lon || 126.978), // default: 서울
        level: 3,
      };

      const mapInstance = new window.kakao.maps.Map(mapRef.current, options);
      if (prop.setMap) prop.setMap(mapInstance);

      // 초기 마커 생성
      const initialMarker = new window.kakao.maps.Marker({
        position: options.center,
        map: mapInstance,
      });
      if (prop.setMarker) prop.setMarker(initialMarker);
    } catch (error) {
      console.error('지도 초기화 실패:', error);
    }
  }, [ready]);

  return (
    <div
      id="map"
      ref={mapRef}
      style={{
        width: '100%',
        height: '400px',
        marginTop: '1rem',
        position: 'relative',
        border: '1px solid #ccc',
      }}
    />
  );
};

export default KakaoMapViewer;
