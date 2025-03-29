import { yupResolver } from '@hookform/resolvers/yup';
import * as W from '../styles/WriteStyles';
import { set, useForm } from 'react-hook-form';
import * as yup from 'yup';
import KakaoMapWithSearch from '../components/KakaoMapWithSearch';
import { useEffect, useState } from 'react';
import { IRoom, IRoomForm } from '../types/room';
import { insertRoom } from '../api/roomApi';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    kakao: any;
  }
}

const schema = yup.object().shape({
  title: yup.string().required('제목을 입력하세요'),
  content: yup.string().required('내용을 입력하세요'),
  address: yup.string().required('주소를 입력하세요'),
  address_dtl: yup.string().required('상세 주소를 입력하세요'),
  lat: yup.number().typeError('주소 입력 후 검색버튼을 눌러주세요').required('주소 입력 후 검색버튼을 눌러주세요'),
  lon: yup.number().typeError('주소 입력 후 검색버튼을 눌러주세요').required('주소 입력 후 검색버튼을 눌러주세요'),
  price: yup
    .number()
    .transform((value, originalValue) => {
      return isNaN(originalValue) || originalValue === '' ? null : value;
    })
    .positive('가격은 0보다 커야 합니다')
    .integer('가격은 정수여야 합니다')
    .required('가격을 입력하세요'),
  images: yup.mixed().optional(),
}) as yup.ObjectSchema<IRoomForm>;

const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
const MAX_IMAGE_COUNT = 10;

const WriteContainer = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IRoomForm>({
    resolver: yupResolver(schema),
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const images = watch('images');

  useEffect(() => {
    if (!images || images.length === 0) {
      setPreviewImages([]);
      return;
    }

    const fileArray = Array.from(images);
    const urls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewImages(urls);

    // 메모리 누수 방지
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleMapInfo = (address: string, lat: number, lon: number) => {
    setValue('address', address);
    setValue('lat', lat);
    setValue('lon', lon);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    if (fileArray.length > MAX_IMAGE_COUNT) {
      alert(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지 업로드 가능합니다.`);
      e.target.value = '';
      return;
    }

    let exceedFiles: string[] = [];
    const validFiles = fileArray.filter((file) => {
      if (file.size > MAX_IMAGE_SIZE) {
        exceedFiles.push(file.name);
        return false;
      }
      return true;
    });

    if (exceedFiles.length > 0)
      alert(`${exceedFiles.join(', ')} 파일은 3MB를 초과하여 제외됩니다.`);

    if (fileArray.length !== validFiles.length) {
      e.target.value = '';
    }

    if (validFiles.length === 0) {
      return;
    }

    const dataTransfer = new DataTransfer();
    validFiles.forEach((file) => dataTransfer.items.add(file));

    setValue('images', dataTransfer.files);
  };

  const handleSaveData = async (data: IRoomForm) => {
    console.log(data);

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('address', data.address || '');
    formData.append('address_dtl', data.address_dtl || '');
    formData.append('price', String(data.price || ''));
    formData.append('lat', String(data.lat || ''));
    formData.append('lon', String(data.lon || ''));
    if (data.images) {
      Array.from(data.images).forEach((image) => {
        formData.append('images', image);
      });
    }

    const roomId = await insertRoom(formData);
    if (roomId) {
      alert('등록되었습니다.');
      navigate(`/`);
    }
  };

  return (
    <W.Container>
      <h2>숙박업소 등록</h2>
      <W.Form onSubmit={handleSubmit((data) => handleSaveData(data))}>
        {/* 제목 */}
        <W.Label>제목</W.Label>
        <W.Input type="text" {...register('title')} placeholder="제목을 입력하세요" />
        {errors.title && <W.Error>{errors.title.message}</W.Error>}

        {/* 내용 */}
        <W.Label>내용</W.Label>
        <W.Textarea {...register('content')} placeholder="숙소 설명을 입력하세요" />
        {errors.content && <W.Error>{errors.content.message}</W.Error>}

        {/* 주소 검색 */}
        <KakaoMapWithSearch handleMapInfo={handleMapInfo} />

        {/* 주소 */}
        <W.Label>주소</W.Label>
        <W.Input type="text" {...register('address')} readOnly placeholder="자동 입력" />
        {errors.address && <W.Error>{errors.address.message}</W.Error>}
        {/* {!errors.address && (errors.lat || errors.lon) && <W.Error>{errors.lat?.message || errors.lon?.message}</W.Error>} */}

        {/* 상세 주소 */}
        <W.Label>상세 주소</W.Label>
        <W.Input type="text" {...register('address_dtl')} placeholder="상세 주소를 입력하세요" />
        {errors.address_dtl && <W.Error>{errors.address_dtl.message}</W.Error>}

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
        <W.Input 
          type="text" 
          {...register('lat', { valueAsNumber: true })} 
          readOnly 
          placeholder="자동 입력" 
        />

        <W.Label>경도</W.Label>
        <W.Input 
          type="text" 
          {...register('lon', { valueAsNumber: true })} 
          readOnly 
          placeholder="자동 입력" 
        />

        {/* 사진 업로드 */}
        <W.Label>사진 업로드 (최대 10장, 각 3MB 이하)</W.Label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />

        {/* 이미지 미리보기 */}
        <W.ImagePreviewContainer>
          {previewImages.map((src, index) => (
            <W.ImagePreview key={index} src={src} alt={`숙소 이미지 ${index + 1}`} />
          ))}
        </W.ImagePreviewContainer>

        <W.SubmitButton type="submit">숙박업소 등록</W.SubmitButton>
      </W.Form>
    </W.Container>
  );
};

export default WriteContainer;
