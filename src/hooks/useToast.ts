/* eslint-disable @typescript-eslint/no-explicit-any */
import { showLoadingToast, showToast, showSuccessToast, showFailToast } from 'vant';

const showToastFn = showToast;

export function useToast() {

  let toast: any = null;
  let count: number = 0;

  const startLoading = (message: string = '加载中', duration: number = 0) => {
    count++;
    toast = showLoadingToast({
      duration: duration,
      forbidClick: true,
      message: message,
      iconSize: '30px'
    });
  };
  const stopLoading = () => {
    count--;
    if (count < 1) {
      toast && toast.close();
    }
  };
  const showToast = (message: string = '提示内容', type: string = 'info', duration: number = 2000) => {
    if (type === 'info') {
      showToastFn({
        message: message,
        duration: duration
      })
    } else if (type === 'success') {
      showSuccessToast({
        message: message,
        duration: duration
      })
    } else if (type === 'fail') {
      showFailToast({
        message: message,
        duration: duration
      })
    }
  };

  return { startLoading, stopLoading, showToast };
}
