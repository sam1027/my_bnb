import { useEffect, useRef, useState } from 'react';
import KakaoMapViewer from './KakaoMapViewer';

interface IProps {
  handleMapInfo: (address: string, lat: number, lon: number) => void;
}

const KakaoMapWithSearch = (props: IProps) => {
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [address, setAddress] = useState('');

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

      <KakaoMapViewer setMap={setMap} setMarker={setMarker} />
    </div>
  );
};

export default KakaoMapWithSearch;
