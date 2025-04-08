import type React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import KakaoMapWithSearch from '../components/KakaoMapWithSearch';
import { useEffect, useState } from 'react';
import type { IRoomForm } from '../types/room';
import { insertRoom } from '../api/roomApi';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  ImageIcon,
  MapPin,
  Home,
  PencilLine,
  DollarSign,
  Users,
  Sparkles,
  BrushIcon as Broom,
  NonBinary,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useCodeStore } from 'src/store/zustand/useCodeStore';
import { CodeGroupIds } from 'src/types/code';
import { useAlert } from '@/components/ui/ui-alerts';
import { useConfirm } from '@/contexts/ConfirmContext';

// 각 단계별 스키마 정의
const step1Schema = yup.object().shape({
  title: yup.string().required('제목을 입력하세요'),
  content: yup.string().required('내용을 입력하세요'),
  price: yup
    .number()
    .transform((value, originalValue) => {
      return isNaN(originalValue) || originalValue === '' ? null : value;
    })
    .positive('가격은 0보다 커야 합니다')
    .integer('가격은 정수여야 합니다')
    .required('가격을 입력하세요'),
  service_fee: yup
    .number()
    .transform((value, originalValue) => {
      return isNaN(originalValue) || originalValue === '' ? null : value;
    })
    .min(0, '서비스 수수료는 0 이상이어야 합니다')
    .integer('서비스 수수료는 정수여야 합니다')
    .nullable(),
  cleaning_fee: yup
    .number()
    .transform((value, originalValue) => {
      return isNaN(originalValue) || originalValue === '' ? null : value;
    })
    .min(0, '청소비는 0 이상이어야 합니다')
    .integer('청소비는 정수여야 합니다')
    .nullable(),
  max_guests: yup.number().transform((value, originalValue) => {
    return isNaN(originalValue) || originalValue === '' ? null : value;
  }),
  amenities: yup.array().of(yup.string()),
});

const step2Schema = yup.object().shape({
  address: yup.string().required('주소를 입력하세요'),
  address_dtl: yup.string().required('상세 주소를 입력하세요'),
  lat: yup
    .number()
    .typeError('주소 입력 후 검색버튼을 눌러주세요')
    .required('주소 입력 후 검색버튼을 눌러주세요'),
  lon: yup
    .number()
    .typeError('주소 입력 후 검색버튼을 눌러주세요')
    .required('주소 입력 후 검색버튼을 눌러주세요'),
});

const step3Schema = yup.object().shape({
  images: yup.mixed().optional(),
});

// 전체 스키마 (최종 제출용)
const schema = yup.object().shape({
  ...step1Schema.fields,
  ...step2Schema.fields,
  ...step3Schema.fields,
}) as yup.ObjectSchema<IRoomForm>;

const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
const MAX_IMAGE_COUNT = 10;

const WriteContainer = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const { confirm } = useConfirm();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<IRoomForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      max_guests: 4,
      service_fee: 30000,
      cleaning_fee: 50000,
    },
    mode: 'onChange', // 입력 값이 변경될 때마다 유효성 검사
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState(4);
  const codeGroupId = CodeGroupIds.AMENITY;
  const { codes: amenitiesCodes, fetchCodesByGroup } = useCodeStore();

  // 편의시설 코드 조회
  useEffect(() => {
    fetchCodesByGroup(codeGroupId);
  }, []);

  const images = watch('images');

  // 게스트 수 변경 시 폼 값 업데이트
  useEffect(() => {
    setValue('max_guests', guestCount);
  }, [guestCount, setValue]);

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
      alert.info(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지 업로드 가능합니다.`);
      e.target.value = '';
      return;
    }

    const exceedFiles: string[] = [];
    const validFiles = fileArray.filter((file) => {
      if (file.size > MAX_IMAGE_SIZE) {
        exceedFiles.push(file.name);
        return false;
      }
      return true;
    });

    if (exceedFiles.length > 0)
      alert.info(`${exceedFiles.join(', ')} 파일은 3MB를 초과하여 제외됩니다.`);

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

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenityId)) {
        return prev.filter((id) => id !== amenityId);
      } else {
        return [...prev, amenityId];
      }
    });

    // 폼 상태 업데이트
    setValue(
      'amenities',
      selectedAmenities.includes(amenityId)
        ? selectedAmenities.filter((id) => id !== amenityId)
        : [...selectedAmenities, amenityId]
    );
  };

  // 게스트 수 변경 핸들러
  const handleGuestCountChange = (value: number[]) => {
    setGuestCount(value[0]);
  };

  // handleSaveData 함수에 새 필드 추가
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
    formData.append('service_fee', String(data.service_fee || ''));
    formData.append('cleaning_fee', String(data.cleaning_fee || ''));
    formData.append('max_guests', String(data.max_guests || ''));

    // 선택된 편의시설 추가
    if (data.amenities && data.amenities.length > 0) {
      formData.append('amenities', JSON.stringify(data.amenities));
    }

    if (data.images) {
      Array.from(data.images).forEach((image) => {
        formData.append('images', image);
      });
    }

    confirm({
      title: '숙소 등록',
      description: '숙소를 등록하시겠습니까?',
      confirmText: '확인',
      cancelText: '취소',
      onConfirm: async () => {
        const roomId = await insertRoom(formData);
        if (roomId) {
          alert.success('등록되었습니다.');
          navigate(`/`);
        }
      },
    });
  };

  const nextStep = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    let isValid = false;

    // 현재 단계에 따라 다른 필드 검증
    switch (currentStep) {
      case 1:
        isValid = await trigger([
          'title',
          'content',
          'price',
          'service_fee',
          'cleaning_fee',
          'max_guests',
        ]);
        break;
      case 2:
        isValid = await trigger(['address', 'address_dtl', 'lat', 'lon']);
        break;
      case 3:
        // 이미지는 선택사항이므로 항상 true
        isValid = true;
        break;
      default:
        isValid = false;
    }

    // 유효성 검사 통과 시 다음 단계로
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <PencilLine className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">숙소 기본 정보</h3>
                <p className="text-muted-foreground">숙소에 대한 기본 정보를 입력해주세요.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">숙소 이름</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="게스트에게 숙소를 소개할 이름을 입력하세요"
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">숙소 설명</Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  placeholder="숙소의 특징, 편의시설, 주변 환경 등을 자세히 설명해주세요"
                  className={errors.content ? 'border-destructive' : ''}
                  rows={6}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">1박 가격 (원)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    {...register('price', { valueAsNumber: true })}
                    placeholder="숙박 1박당 가격을 입력하세요"
                    className={`pl-10 ${errors.price ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>

              {/* 최대 수용인원 */}
              <div className="space-y-4">
                <Label htmlFor="max_guests">최대 수용인원: {guestCount}명</Label>
                <div className="flex items-center gap-4">
                  <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <Slider
                    id="max_guests"
                    min={1}
                    max={20}
                    step={1}
                    value={[guestCount]}
                    onValueChange={handleGuestCountChange}
                    className="flex-grow"
                  />
                </div>
                {errors.max_guests && (
                  <p className="text-sm text-destructive">{errors.max_guests.message}</p>
                )}
              </div>

              {/* 서비스 수수료 */}
              <div className="space-y-2">
                <Label htmlFor="service_fee">서비스 수수료 (원)</Label>
                <div className="relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="service_fee"
                    type="number"
                    {...register('service_fee', { valueAsNumber: true })}
                    placeholder="서비스 수수료를 입력하세요"
                    className={`pl-10 ${errors.service_fee ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.service_fee && (
                  <p className="text-sm text-destructive">{errors.service_fee.message}</p>
                )}
              </div>

              {/* 청소비 */}
              <div className="space-y-2">
                <Label htmlFor="cleaning_fee">청소비 (원)</Label>
                <div className="relative">
                  <Broom className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="cleaning_fee"
                    type="number"
                    {...register('cleaning_fee', { valueAsNumber: true })}
                    placeholder="청소비를 입력하세요"
                    className={`pl-10 ${errors.cleaning_fee ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.cleaning_fee && (
                  <p className="text-sm text-destructive">{errors.cleaning_fee.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label>편의시설</Label>
                <div className="relative max-h-[300px] overflow-y-auto border rounded-md p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenitiesCodes[codeGroupId] &&
                      amenitiesCodes[codeGroupId].map((amenity) => (
                        <div key={amenity.code_id} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity.code_id}
                            checked={selectedAmenities.includes(amenity.code_id)}
                            onCheckedChange={() => toggleAmenity(amenity.code_id)}
                          />
                          <label
                            htmlFor={amenity.code_id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {amenity.code_name}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">숙소 위치</h3>
                <p className="text-muted-foreground">
                  정확한 위치를 입력하면 게스트가 쉽게 찾을 수 있어요.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl overflow-hidden border shadow-sm">
                <KakaoMapWithSearch handleMapInfo={handleMapInfo} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  {...register('address')}
                  readOnly
                  placeholder="지도에서 위치를 검색하세요"
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_dtl">상세 주소</Label>
                <Input
                  id="address_dtl"
                  {...register('address_dtl')}
                  placeholder="동/호수, 층수 등 상세 정보를 입력하세요"
                  className={errors.address_dtl ? 'border-destructive' : ''}
                />
                {errors.address_dtl && (
                  <p className="text-sm text-destructive">{errors.address_dtl.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 hidden">
                <div className="space-y-2">
                  <Label htmlFor="lat">위도</Label>
                  <Input
                    id="lat"
                    {...register('lat', { valueAsNumber: true })}
                    readOnly
                    placeholder="자동 입력"
                    className={errors.lat ? 'border-destructive' : ''}
                  />
                  {errors.lat && <p className="text-sm text-destructive">{errors.lat.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lon">경도</Label>
                  <Input
                    id="lon"
                    {...register('lon', { valueAsNumber: true })}
                    readOnly
                    placeholder="자동 입력"
                    className={errors.lon ? 'border-destructive' : ''}
                  />
                  {errors.lon && <p className="text-sm text-destructive">{errors.lon.message}</p>}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">숙소 사진</h3>
                <p className="text-muted-foreground">멋진 사진으로 게스트의 관심을 끌어보세요.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 text-center hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center space-y-4">
                  <Upload className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h4 className="text-xl font-medium">
                      사진을 끌어다 놓거나 클릭하여 업로드하세요
                    </h4>
                    <p className="text-sm text-muted-foreground">최대 10장, 각 3MB 이하</p>
                  </div>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="mt-4"
                  >
                    사진 선택하기
                  </Button>
                </div>
              </div>

              {previewImages.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">업로드된 사진 ({previewImages.length}장)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewImages.map((src, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-md overflow-hidden border"
                      >
                        <img
                          src={src || '/placeholder.svg'}
                          alt={`숙소 이미지 ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">검토 및 등록</h3>
                <p className="text-muted-foreground">입력하신 정보를 확인하고 등록해주세요.</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground">숙소 이름</h4>
                  <p className="text-lg">{watch('title')}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground">숙소 설명</h4>
                  <p className="line-clamp-3">{watch('content')}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground">가격 정보</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>1박 가격:</span>
                      <span className="font-medium">{watch('price')?.toLocaleString()} 원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>청소비:</span>
                      <span>{watch('cleaning_fee')?.toLocaleString()} 원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>서비스 수수료:</span>
                      <span>{watch('service_fee')?.toLocaleString()} 원</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground">최대 수용인원</h4>
                  <p>{watch('max_guests')} 명</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground">주소</h4>
                  <p>
                    {watch('address')} {watch('address_dtl')}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground">편의시설</h4>
                  {selectedAmenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
                      {selectedAmenities.map((id) => (
                        <span key={id} className="bg-muted px-2 py-1 rounded-md text-sm">
                          {amenitiesCodes[codeGroupId] &&
                            amenitiesCodes[codeGroupId].find((a) => a.code_id === id)?.code_name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">선택된 편의시설이 없습니다.</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-muted-foreground">사진</h4>
                  {previewImages.length > 0 ? (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {previewImages.map((src, index) => (
                        <img
                          key={index}
                          src={src || '/placeholder.svg'}
                          alt={`숙소 이미지 ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">등록된 사진이 없습니다.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
              <p className="text-sm">
                등록 후에도 정보를 수정할 수 있습니다. 등록 버튼을 클릭하면 숙소가 게시됩니다.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold mb-6">숙소 등록하기</h2>
        <Progress value={progressPercentage} className="h-2 mb-4" />
        <div className="flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`text-sm ${currentStep > index ? 'text-primary font-medium' : 'text-muted-foreground'}`}
            >
              {index === 0 ? '기본 정보' : index === 1 ? '위치' : index === 2 ? '사진' : '검토'}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => handleSaveData(data))}>
        {renderStepContent()}

        <div className="flex justify-between mt-10">
          {currentStep > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              <ChevronLeft className="mr-2 h-4 w-4" /> 이전
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < totalSteps ? (
            <Button type="button" onClick={(e) => nextStep(e)}>
              다음 <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              숙소 등록하기
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WriteContainer;
