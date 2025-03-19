import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Autocomplete from 'react-google-autocomplete';
import * as W from '../styles/WriteStyles';

// 📌 유효성 검사 스키마 정의
const schema = yup.object().shape({
  title: yup.string().required('제목을 입력하세요.'),
  description: yup.string().required('내용을 입력하세요.'),
  address: yup.string().required('주소를 입력하세요.'),
  detailAddress: yup.string().required('상세 주소를 입력하세요.'),
  price: yup
    .number()
    .typeError('가격은 숫자로 입력하세요.')
    .positive('가격은 0보다 커야 합니다.')
    .integer('가격은 정수로 입력하세요.')
    .required('가격을 입력하세요.'),
  images: yup.mixed<FileList>().test('required', '사진을 최소 1장 업로드하세요.', (value) => {
    return value && value instanceof FileList && value.length > 0;
  }),
  latitude: yup.number().nullable().notRequired(),
  longitude: yup.number().nullable().notRequired(),
});

// 📌 폼 데이터 타입
interface FormData {
  title: string;
  description: string;
  address: string;
  detailAddress: string;
  price: number;
  images?: FileList; // `undefined` 허용
  latitude?: number | null; // ✅ null 허용
  longitude?: number | null; // ✅ null 허용
}

const Write: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // 📌 주소 선택 시 위도·경도 변환
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place && place.geometry) {
      setValue('address', place.formatted_address || '');
      setLatitude(place.geometry.location?.lat() || null);
      setLongitude(place.geometry.location?.lng() || null);
    }
  };

  // 📌 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);

    // 업로드된 파일을 `FileList`로 저장
    setValue('images', event.target.files);

    // 이미지 미리보기 생성
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(imageUrls);
  };

  // 📌 폼 제출 핸들러
  const onSubmit = (data: FormData) => {
    console.log('폼 데이터:', { ...data, latitude, longitude });
    alert('숙박업소 등록 완료!');
  };

  return (
    <W.Container>
      <h2>숙박업소 등록</h2>
      <W.Form onSubmit={handleSubmit(onSubmit)}>
        {/* 제목 */}
        <W.Label>제목</W.Label>
        <W.Input type="text" {...register('title')} placeholder="제목을 입력하세요" />
        {errors.title && <W.Error>{errors.title.message}</W.Error>}

        {/* 내용 */}
        <W.Label>내용</W.Label>
        <W.Textarea {...register('description')} placeholder="숙소 설명을 입력하세요" />
        {errors.description && <W.Error>{errors.description.message}</W.Error>}

        {/* 주소 (Google 자동완성) */}
        <W.Label>주소</W.Label>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Autocomplete
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
              onPlaceSelected={handlePlaceSelect}
              defaultValue={field.value}
              types={['geocode']}
              placeholder="주소를 검색하세요"
              className="autocomplete-input"
            />
          )}
        />
        {errors.address && <W.Error>{errors.address.message}</W.Error>}

        {/* 상세 주소 */}
        <W.Label>상세 주소</W.Label>
        <W.Input type="text" {...register('detailAddress')} placeholder="상세 주소를 입력하세요" />
        {errors.detailAddress && <W.Error>{errors.detailAddress.message}</W.Error>}

        {/* 가격 */}
        <W.Label>1박 가격</W.Label>
        <W.Input type="number" {...register('price')} placeholder="가격을 입력하세요" />
        {errors.price && <W.Error>{errors.price.message}</W.Error>}

        {/* 위도 & 경도 */}
        <W.Label>위도</W.Label>
        <W.Input type="text" value={latitude ?? ''} readOnly placeholder="자동 입력" />

        <W.Label>경도</W.Label>
        <W.Input type="text" value={longitude ?? ''} readOnly placeholder="자동 입력" />

        {/* 사진 업로드 */}
        <W.Label>사진 업로드</W.Label>
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
        {errors.images && <W.Error>{errors.images.message}</W.Error>}

        {/* 이미지 미리보기 */}
        <W.ImagePreviewContainer>
          {previewImages.map((image, index) => (
            <W.ImagePreview key={index} src={image} alt={`숙소 이미지 ${index + 1}`} />
          ))}
        </W.ImagePreviewContainer>

        <W.SubmitButton type="submit">숙박업소 등록</W.SubmitButton>
      </W.Form>
    </W.Container>
  );
};

export default Write;
