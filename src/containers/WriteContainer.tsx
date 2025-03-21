import { yupResolver } from '@hookform/resolvers/yup';
import * as W from '../styles/WriteStyles';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

interface IFormInput {
  title: string;
  content: string;
  address?: string;
  detailAddress?: string;
  price: number;
  lat?: number;
  lon?: number;
  images?: FileList;
}

const schema = yup.object().shape({
  title: yup.string().required('제목을 입력하세요'),
  content: yup.string().required('내용을 입력하세요'),
  price: yup.number().positive('가격은 0보다 커야 합니다').required('가격을 입력하세요'),
});

const WriteContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  return (
    <W.Container>
      <h2>숙박업소 등록</h2>
      <W.Form onSubmit={handleSubmit((data) => console.log(data))}>
        {/* 제목 */}
        <W.Label>제목</W.Label>
        <W.Input type="text" {...register('title')} placeholder="제목을 입력하세요" />
        {errors.title && <W.Error>{errors.title.message}</W.Error>}

        {/* 내용 */}
        <W.Label>내용</W.Label>
        <W.Textarea {...register('content')} placeholder="숙소 설명을 입력하세요" />
        {errors.content && <W.Error>{errors.content.message}</W.Error>}

        {/* 주소 (Google 자동완성) */}
        <W.Label>주소</W.Label>
        {/* <Controller name="address" /> */}

        {/* 상세 주소 */}
        <W.Label>상세 주소</W.Label>
        <W.Input type="text" {...register('address')} placeholder="상세 주소를 입력하세요" />

        {/* 가격 */}
        <W.Label>1박 가격</W.Label>
        <W.Input type="number" {...register('price')} placeholder="가격을 입력하세요" />
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
