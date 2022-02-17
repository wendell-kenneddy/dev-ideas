import { toast as t, ToastOptions, TypeOptions } from 'react-toastify';

interface PromisedToastConfig {
  pendingMessage: string;
  successMessage: string;
  errorMessage: string;
}

const defaultConfig: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  theme: 'dark'
};

export const toast = (message: string, type: TypeOptions) => {
  t.dismiss();

  return t(message, {
    type,
    ...defaultConfig
  });
};
