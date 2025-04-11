import { useEffect } from 'react';
import { useAlert } from '@/components/ui/ui-alerts';
import { popGlobalMessage } from '@/lib/globalMessage';

export const useGlobalMessageAlert = () => {
  const alert = useAlert();

  useEffect(() => {
    const message = popGlobalMessage();
    if (!message) return;

    if (message.type === 'success') alert.success(message.content);
    else if (message.type === 'error') alert.error(message.content);
    else alert.info(message.content);
  }, []);
};
