import type React from 'react';
import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateEmail } from '@/utils/cmnUtils';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/components/ui/ui-alerts';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { checkEmail, login, signup } from '@/api/authApi';
import { useConfirm } from '@/contexts/ConfirmContext';
import { useAuthStore } from 'src/store/zustand/useAuthStore';

interface IForm {
  email: string;
  name: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().required('이메일을 입력하세요.'),
  name: yup.string().when('$currentStep', {
    is: (step: number) => step === 2,
    then: (schema) => schema.required('이름을 입력하세요.'),
    otherwise: (schema) => schema.notRequired(),
  }),
  password: yup.string().required('비밀번호를 입력하세요.'),
}) as yup.ObjectSchema<IForm>;

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const alert = useAlert();
  const { confirm } = useConfirm();
  const totalSteps = 3;
  const [currentStep, setCurrentStep] = useState(1);
  const loginStore = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    context: { currentStep },
  });

  useEffect(() => {
    reset({
      name: '',
      password: '',
    });
  }, [currentStep]);

  const emailCheck = async () => {
    const { email } = getValues();
    return await checkEmail(email);
  };

  // 계속 버튼 클릭 핸들러
  const nextStep = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    const isValid = await trigger(['email']);
    if (!isValid) return;

    // 이메일 중복 체크
    const isDuplicated = await emailCheck();
    if (isDuplicated) {
      confirm({
        title: '계정 확인',
        description: '이미 존재하는 이메일입니다.해당 이메일로 로그인하시겠습니까?',
        onConfirm: () => {
          setCurrentStep(3);
        },
      });
      return;
    }

    // 이메일 중복 체크 통과 시 다음 단계로
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  // 이전 버튼 클릭 핸들러
  const prevStep = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  // 회원가입 처리
  const handleJoin = async () => {
    setIsLoading(true);

    const { name, email, password } = getValues();

    // 이메일 중복 체크
    const isDuplicated = await emailCheck();
    if (isDuplicated) {
      confirm({
        title: '계정 확인',
        description: '이미 존재하는 이메일입니다.해당 이메일로 로그인하시겠습니까?',
        onConfirm: () => {
          setCurrentStep(3);
        },
      });
      return;
    }

    try {
      const result = await signup(name, email, password);
      if (result > 0) {
        alert.success('회원가입이 완료되었습니다.');
        setCurrentStep(3);
      } else {
        alert.error('회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert.error('회원가입에 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 처리
  const handleLogin = async () => {
    setIsLoading(true);

    const { email, password } = getValues();
    console.log(email, password);

    try {
      const response = await login(email, password);
      console.log(`login response: ${response}`);
      if (response.status === 200) {
        loginStore(response.data.accessToken);
        alert.success(response.data.message);
      } else {
        alert.error(response.data.message);
      }
    } catch (error) {
      console.error('로그인 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl border border-gray-200 bg-white">
      {/* 타이틀 */}
      <h1 className="text-center text-xl font-medium mb-6">로그인 또는 회원 가입</h1>

      <div className="border-t border-gray-200 pt-6">
        {/* 환영 메시지 */}
        <h2 className="text-xl font-medium mb-6">마이비엔비에 오신 것을 환영합니다.</h2>
        <form onSubmit={handleSubmit(currentStep > 2 ? handleLogin : handleJoin)}>
          {/* 이메일 입력 필드 */}
          <Input
            type="email"
            placeholder="이메일"
            {...register('email')}
            className={`h-14 text-base px-4 rounded-lg mb-4 ${errors.email ? 'border-destructive' : ''}`}
            disabled={currentStep > 1}
          />
          {errors.email && <p className="text-sm text-destructive mb-4">{errors.email.message}</p>}

          {currentStep === 2 && (
            <>
              {/* 이름 입력 필드 */}
              <Input
                type="text"
                placeholder="이름"
                {...register('name')}
                className={`h-14 text-base px-4 rounded-lg mb-4 ${errors.name ? 'border-destructive' : ''}`}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(handleJoin)();
                  }
                }}
              />
              {errors.name && (
                <p className="text-sm text-destructive mb-4">{errors.name.message}</p>
              )}
            </>
          )}

          {(currentStep === 2 || currentStep === 3) && (
            <>
              {/* 비밀번호 입력 필드 */}
              <Input
                type="password"
                placeholder="비밀번호"
                {...register('password')}
                className={`h-14 text-base px-4 rounded-lg mb-4 ${errors.password ? 'border-destructive' : ''}`}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(currentStep > 2 ? handleLogin : handleJoin)();
                  }
                }}
              />
              {errors.password && (
                <p className="text-sm text-destructive mb-4">{errors.password.message}</p>
              )}
            </>
          )}

          <div className="flex justify-between">
            {/* 이전 버튼 */}
            {currentStep > 1 && (
              <Button
                className="h-14 bg-[#969596] hover:bg-[#969596] text-white font-medium text-base rounded-lg mb-6"
                onClick={prevStep}
                disabled={isLoading}
              >
                <ArrowLeft className="h-5 w-5" />
                이전
              </Button>
            )}

            {/* 계속 or 로그인 or 회원가입 버튼 */}
            {currentStep === 1 ? (
              <Button
                type="button"
                className="w-full h-14 bg-[#E41D57] hover:bg-[#D91A50] text-white font-medium text-base rounded-lg mb-6"
                onClick={nextStep}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                계속
              </Button>
            ) : (
              <Button
                type="submit"
                className="h-14 bg-[#E41D57] hover:bg-[#D91A50] text-white font-medium text-base rounded-lg mb-6"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                {currentStep > 2 ? '로그인' : '회원가입'}
              </Button>
            )}
          </div>
        </form>

        {/* 구분선 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">또는</span>
          </div>
        </div>

        {/* 네이버 로그인 버튼 */}
        <Button
          variant="outline"
          className="w-full h-14 font-medium text-base flex items-center justify-center gap-3 border-gray-300 rounded-lg mb-3"
        >
          <NaverIcon className="h-6 w-6" />
          <span>네이버로 로그인하기</span>
        </Button>

        {/* 구글 로그인 버튼 */}
        <Button
          variant="outline"
          className="w-full h-14 font-medium text-base flex items-center justify-center gap-3 border-gray-300 rounded-lg mb-3"
        >
          <GoogleIcon className="h-6 w-6" />
          <span>구글로 로그인하기</span>
        </Button>

        {/* 카카오 로그인 버튼 */}
        <Button
          variant="outline"
          className="w-full h-14 font-medium text-base flex items-center justify-center gap-3 rounded-lg mb-3 bg-[#FEE500] hover:bg-[#FEE500]/80"
        >
          <KakaoIcon className="h-6 w-6" />
          <span>카카오로 로그인하기</span>
        </Button>

        {/* 애플 로그인 버튼 */}
        {/* <Button
          variant="outline"
          className="w-full h-14 font-medium text-base flex items-center justify-center gap-3 border-gray-300 rounded-lg mb-3"
        >
          <AppleIcon className="h-6 w-6" />
          <span>애플로 로그인하기</span>
        </Button> */}

        {/* 전화번호 로그인 버튼 */}
        {/* <Button
          variant="outline"
          className="w-full h-14 font-medium text-base flex items-center justify-center gap-3 border-gray-300 rounded-lg"
        >
          <PhoneIcon className="h-6 w-6" />
          <span>전화번호로 로그인하기</span>
        </Button> */}
      </div>
    </div>
  );
}

// 네이버 아이콘 컴포넌트
function NaverIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" fill="#03C75A" />
      <path
        d="M13.5 12.14L10.25 7.2H7.2V16.8H10.4V11.86L13.65 16.8H16.7V7.2H13.5V12.14Z"
        fill="white"
      />
    </svg>
  );
}

// 구글 아이콘 컴포넌트
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// 카카오 아이콘 컴포넌트
function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3C6.48 3 2 6.48 2 10.8C2 13.8 3.95 16.41 6.88 17.86V21.5L10.48 19.25C10.98 19.31 11.48 19.35 12 19.35C17.52 19.35 22 15.87 22 11.55C22 7.23 17.52 3 12 3Z"
        fill="black"
      />
    </svg>
  );
}

// 애플 아이콘 컴포넌트
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.05 12.536C17.017 9.764 19.333 8.513 19.428 8.456C18.067 6.442 15.939 6.172 15.192 6.153C13.397 5.969 11.662 7.237 10.752 7.237C9.827 7.237 8.407 6.172 6.891 6.203C4.933 6.234 3.102 7.361 2.083 9.134C0.006 12.722 1.522 18.045 3.519 20.779C4.519 22.122 5.693 23.629 7.242 23.577C8.758 23.519 9.345 22.615 11.173 22.615C12.986 22.615 13.539 23.577 15.125 23.546C16.75 23.519 17.775 22.179 18.744 20.825C19.911 19.266 20.386 17.738 20.417 17.655C20.375 17.64 17.089 16.401 17.05 12.536Z"
        fill="black"
      />
      <path
        d="M14.5 5.224C15.308 4.237 15.867 2.881 15.717 1.5C14.558 1.553 13.147 2.288 12.308 3.253C11.564 4.102 10.883 5.5 11.05 6.828C12.342 6.922 13.661 6.195 14.5 5.224Z"
        fill="black"
      />
    </svg>
  );
}

// 전화번호 아이콘 컴포넌트
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#F7F7F7" />
      <path
        d="M17.45 14.18L15.08 13.91C14.7 13.87 14.33 14 14.05 14.28L12.77 15.56C10.8 14.56 9.22 13 8.23 11L9.51 9.72C9.79 9.44 9.92 9.07 9.88 8.69L9.61 6.31C9.54 5.68 9.03 5.21 8.4 5.21H7.12C6.41 5.21 5.82 5.8 5.86 6.51C6.19 12.94 11.07 17.81 17.49 18.14C18.2 18.18 18.79 17.59 18.79 16.88V15.6C18.8 14.97 18.33 14.46 17.7 14.39L17.45 14.18Z"
        fill="#222222"
      />
    </svg>
  );
}
