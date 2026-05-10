import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import type { Response } from './types';
// import { auth } from '@/utils';
// import router from '@/router';
import { useToast } from '@/hooks';
import { useUserStore } from '@/store';
import * as ww from '@wecom/jssdk';

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8';

const { showToast } = useToast();

// 创建axios实例
const service = axios.create({
  // 根据不同env设置不同的baseURL
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 1000 * 60
});

// axios实例拦截请求
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const userStore = useUserStore();
    config.headers = {
      ...config.headers,
      // ...auth.headers(), // 你的自定义headers，如token等
    };
    const token = sessionStorage.getItem('token');
    config.headers['token'] = token || '';
    if (userStore.appSource === 'welink') {
      config.headers['applicationType'] = 2;
    } else if (userStore.appSource.includes('qiwei')) {
      config.headers['applicationType'] = 1;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// axios实例拦截响应
service.interceptors.response.use(
  // 2xx时触发
  (response: AxiosResponse<Response>) => {
    // response.data就是后端返回的数据，结构根据你们的约定来定义
    const res = response.data;
    if (res.code !== 200) {
      let errMessage = '';
      const userStore = useUserStore();
      switch (res.code) {
        case 403: // 无权限
          errMessage = '';
          userStore.updateErrorMessage(res.msg || res.message);
          break;
        case 401: // token过期
          errMessage = '';
          setTimeout(() => {
            if (userStore.appSource === 'welink') {
              sessionStorage.removeItem('token');
              location.reload();
            } else if (userStore.appSource.includes('qiwei')) {
              showToast('登录已过期，请重新打开应用', 'fail');
              setTimeout(() => {
                sessionStorage.removeItem('token');
                ww.closeWindow({
                  success: function () {
                    console.log('关闭成功');
                  },
                  fail: function (error: any) {
                    console.log('关闭失败', error);
                  },
                });
              }, 1500);
            }
          }, 500);
          // router.push('/login');
          break;
        case 2: // 无权限
          errMessage = 'No permission';
          break;
        default:
          errMessage = res.msg || res.message;
          break;
      }
      if (errMessage) showToast(errMessage, 'fail');
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  // 非2xx时触发
  (error: AxiosError) => {
    showToast('请求异常', 'fail');
    return Promise.reject(error);
  }
);

export type { AxiosResponse, AxiosRequestConfig };

export default service;
