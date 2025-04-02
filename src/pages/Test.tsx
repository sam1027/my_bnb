'use client';

import { Button } from '@/components/ui/button';
import { useAlert } from '@/components/ui/ui-alerts';
import { useConfirm } from 'src/contexts/ConfirmContext';
export default function AlertExample() {
  const alert = useAlert();
  const { confirm } = useConfirm();

  // Alert 예제
  const showSuccessAlert = () => {
    alert.success('성공적으로 처리되었습니다!');
  };

  const showErrorAlert = () => {
    alert.error('오류가 발생했습니다.');
  };

  const showInfoAlert = () => {
    alert.info('참고하세요.');
  };

  // 프로그래매틱 Confirm 예제
  const handleProgrammaticConfirm = () => {
    confirm({
      title: '예약 취소',
      description: '정말로 예약을 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      confirmText: '예약 취소',
      cancelText: '돌아가기',
      onConfirm: () => {
        alert.success('예약이 취소되었습니다!');
      },
    });
  };

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Alert 예제</h2>
        <div className="flex gap-4">
          <Button onClick={showSuccessAlert}>성공 알림</Button>
          <Button onClick={showErrorAlert} variant="destructive">
            오류 알림
          </Button>
          <Button onClick={showInfoAlert} variant="outline">
            정보 알림
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Confirm 예제</h2>

        {/* 프로그래매틱 방식 */}
        <div>
          <h3 className="text-lg font-medium mb-2">프로그래매틱 방식</h3>
          <Button onClick={handleProgrammaticConfirm}>예약 취소</Button>
        </div>
      </div>
    </div>
  );
}
