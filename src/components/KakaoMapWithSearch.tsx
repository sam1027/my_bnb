import { useEffect, useRef, useState } from 'react';

interface IProps {
  handleMapInfo: (address: string, lat: number, lon: number) => void;
}

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMapWithSearch = (props: IProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [address, setAddress] = useState('');

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
      console.log('지도 초기화 조건:', { ready, mapRef: !!mapRef.current, kakao: !!window.kakao?.maps });
      return;
    }

    try {
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울
        level: 3,
      };

      const mapInstance = new window.kakao.maps.Map(mapRef.current, options);
      setMap(mapInstance);

      // 초기 마커 생성
      const initialMarker = new window.kakao.maps.Marker({
        position: options.center,
        map: mapInstance
      });
      setMarker(initialMarker);
    } catch (error) {
      console.error('지도 초기화 실패:', error);
    }
  }, [ready]);

  // 주소 검색
  const handleSearch = () => {
    if (!window.kakao?.maps?.services || !map) {
      alert('카카오 지도 준비 중입니다.');
      return;
    }

    try {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result: any, status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          map.setCenter(coords);

          if (marker) marker.setMap(null);
          const newMarker = new window.kakao.maps.Marker({ map, position: coords });
          setMarker(newMarker);

          // 부모 컴포넌트로 주소와 좌표 전달
          props.handleMapInfo(address, coords.getLat(), coords.getLng());
        } else {
          alert('정확한 주소를 입력해주세요.');
        }
      });
    } catch (error) {
      console.error('주소 검색 실패:', error);
      alert('주소 검색 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>주소 검색</h2>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="검색할 주소를 입력하세요"
        style={{ width: '300px', marginRight: '8px' }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
          }
        }}
      />
      <button type="button" onClick={handleSearch}>
        검색
      </button>

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
    </div>
  );
};

export default KakaoMapWithSearch;
