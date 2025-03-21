import { yupResolver } from '@hookform/resolvers/yup';
import * as W from '../styles/WriteStyles';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useKakaoLoader } from '../hooks/useKakaoLoader';
import KakaoMapWithSearch from '../components/KakaoMapWithSearch';

declare global {
  interface Window {
    kakao: any;
  }
}

interface IFormInput {
  title: string;
  content: string;
  address?: string;
  detailAddress?: string;
  price?: number | null;
  lat?: number;
  lon?: number;
  images?: FileList;
}

const schema = yup.object().shape({
  title: yup.string().required('제목을 입력하세요'),
  content: yup.string().required('내용을 입력하세요'),
  price: yup
    .number()
    .transform((value, originalValue) => {
      return isNaN(originalValue) || originalValue === '' ? null : value;
    })
    .positive('가격은 0보다 커야 합니다')
    .integer('가격은 정수여야 합니다')
    .nullable(),
});

const WriteContainer = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const isKakaoReady = useKakaoLoader();

  const handleSearch = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    console.log('handleSearch 호출됨');

    if (!isKakaoReady || !window.kakao?.maps?.services) {
      alert('카카오맵 로딩이 아직 안 됐어요!');
      return;
    }

    const address = getValues('address');
    if (!address || address.trim() === '') {
      alert('주소를 입력해주세요!');
      return;
    }

    console.log('주소:', address);
    console.log('카카오:', window.kakao);

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, async (result: any, status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const lat = result[0].y;
        const lng = result[0].x;

        setValue('lat', lat);
        setValue('lon', lng);

        console.log('주소:', address);
        console.log('위도:', lat);
        console.log('경도:', lng);

        // try {
        //   await axios.post('http://localhost:3001/api/location', {
        //     address,
        //     latitude: lat,
        //     longitude: lng,
        //   });
        //   alert('저장 완료');
        // } catch (error) {
        //   console.error(error);
        //   alert('저장 실패');
        // }
      } else {
        alert('주소 검색 실패');
      }
    });
  };

  return (
    <W.Container>
      <h2>숙박업소 등록</h2>
      <W.Form onSubmit={handleSubmit((data) => console.log(data))}>
        {/* 제목 */}
        <W.Label>제목 (필수)</W.Label>
        <W.Input type="text" {...register('title')} placeholder="제목을 입력하세요" />
        {errors.title && <W.Error>{errors.title.message}</W.Error>}

        {/* 내용 */}
        <W.Label>내용 (필수)</W.Label>
        <W.Textarea {...register('content')} placeholder="숙소 설명을 입력하세요" />
        {errors.content && <W.Error>{errors.content.message}</W.Error>}

        {/* 주소 (Google 자동완성) */}
        <W.Label>주소</W.Label>
        <W.Input type="text" {...register('address')} placeholder="주소를 입력하세요" />
        <button type="button" onClick={handleSearch}>
          검색
        </button>

        {/* 상세 주소 */}
        <W.Label>상세 주소</W.Label>
        <W.Input type="text" {...register('detailAddress')} placeholder="상세 주소를 입력하세요" />

        <KakaoMapWithSearch />

        {/* 가격 */}
        <W.Label>1박 가격</W.Label>
        <W.Input
          type="number"
          {...register('price', { valueAsNumber: true })}
          placeholder="가격을 입력하세요"
        />
        {errors.price && <W.Error>{errors.price.message}</W.Error>}

        {/* 위도 & 경도 */}
        <W.Label>위도</W.Label>
        <W.Input type="text" {...register('lat')} readOnly placeholder="자동 입력" />

        <W.Label>경도</W.Label>
        <W.Input type="text" {...register('lon')} readOnly placeholder="자동 입력" />

        {/* 사진 업로드 */}
        <W.Label>사진 업로드</W.Label>
        <input type="fil e" accept="image/*" multiple />

        {/* 이미지 미리보기 */}
        <W.ImagePreviewContainer>
          {/* {previewImages.map((image, index) => (
              <W.ImagePreview key={index} src={image} alt={`숙소 이미지 ${index + 1}`} />
            ))} */}
        </W.ImagePreviewContainer>

        <W.SubmitButton type="submit">숙박업소 등록</W.SubmitButton>
      </W.Form>
    </W.Container>
  );
};

export default WriteContainer;
