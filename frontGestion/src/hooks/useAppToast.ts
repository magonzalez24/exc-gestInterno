import { useToast } from '@/components/ui/use-toast';

export type AppToastType = 'success' | 'error' | 'warning' | 'info';

export const useAppToast = () => {
  const { toast, ...rest } = useToast();

  const showToast = (
    type: AppToastType,
    title: string,
    description?: string
  ) => {
    const variant = type === 'error' ? 'destructive' : 'default';

    toast({
      variant,
      title,
      description,
    });
  };

  return {
    ...rest,
    showToast,
  };
};

