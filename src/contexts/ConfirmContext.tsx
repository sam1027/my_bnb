// contexts/ConfirmContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type ConfirmContextType = {
  confirm: (options: {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => void;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    description: '',
    confirmText: '확인',
    cancelText: '취소',
    onConfirm: () => {},
  });

  const confirm = (options: {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => {
    setState({
      open: true,
      title: options.title || '확인',
      description: options.description || '이 작업을 진행하시겠습니까?',
      confirmText: options.confirmText || '확인',
      cancelText: options.cancelText || '취소',
      onConfirm: options.onConfirm,
    });
  };

  const handleConfirm = () => {
    state.onConfirm();
    setState({ ...state, open: false });
  };

  const handleCancel = () => {
    setState({ ...state, open: false });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AlertDialog open={state.open} onOpenChange={(open) => setState({ ...state, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state.title}</AlertDialogTitle>
            <AlertDialogDescription>{state.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>{state.cancelText}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>{state.confirmText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (context === undefined) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}
