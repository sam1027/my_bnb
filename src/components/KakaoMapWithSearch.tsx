import { useEffect, useRef, useState } from 'react';

interface IProps {
  handleMapInfo: (address: string, lat: number, lon: number) => void;
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
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setReady(true);
      });
    };
    document.head.appendChild(script);
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    const mapInstance = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울
      level: 3,
    });

    setMap(mapInstance);
  }, [ready]);

  // 주소 검색
  const handleSearch = () => {
    if (!window.kakao?.maps?.services || !map) {
      alert('카카오 지도 준비 중입니다.');
      return;
    }

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
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>주소 검색</h2>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="주소를 입력하세요"
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
          backgroundColor: '#eee',
          border: '1px solid #ccc',
        }}
      ></div>
    </div>
  );
};

export default KakaoMapWithSearch;
