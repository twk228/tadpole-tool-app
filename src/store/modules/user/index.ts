import { storage } from '@/utils';
import { defineStore } from 'pinia';

/**
 * root层state类型定义
 */
export interface TypeState {
  userInfo: any;
}

export const useUserStore = defineStore('user', {
  // id: 'user', // id必填，且需要唯一。两种写法
  state: () => {
    return {
      appSource: 'welink', // app来源
      token: '', // token
      isSave: 1, // 是否有人员管理权限
      errorMessage: '', // 错误信息
      userInfo: {},
      query: {
        marketActivityId: '',
      },
    };
  },
  getters: {
    // 验证权限
    handlePermission: (state: any) => {
      return (key: string) => {
        if (key == '') {
          return true;
        } else {
          const buttons = state.userInfo.buttons || [];
          return buttons.some((item: string) => item === key);
        }
      };
    },
    getIcmUserList: (state: any) => {
      return () => {
        return state.userInfo.icmUserList || [];
      };
    },
    // 根据半径值获取value
    getValueByRadius: (state: any) => {
      return (key: any) => {
        if (key == '') {
          return '';
        } else {
          const RadiusMap: any = {
            1000: '1km',
            2000: '2km',
            3000: '3km',
          };
          return RadiusMap[key];
        }
      };
    },
    // 根据品牌名称与子品牌名称，获取车型图片地址
    handleCarSrriesUrl: (state) => {
      return (
        key: any,
        attach = 'x-image-process=image/resize,w_120/quality,Q_95'
      ) => {
        const defaultPic =
          'https://obs-sis.obs.cn-north-4.myhuaweicloud.com/590272718951186432.png';
        if (key == '') {
          return defaultPic;
        } else {
          const l: any = state.userInfo;
          const carSeries =
            l.brandVo.detalVos.filter(
              (item: any) => `${item.brandName}-${item.subBrandName}` == key
            ) || null;
          return carSeries.length > 0
            ? `${carSeries[0].icon}?${attach}`
            : defaultPic;
        }
      };
    },
  },
  actions: {
    updateUserInfo(userInfo: any) {
      this.isSave = (userInfo as any).isSave;
      this.userInfo = userInfo;
    },
    updateToken(token: string) {
      if (token !== 'null') {
        sessionStorage.setItem('token', token);
      }
      this.token = token;
    },
    updateAppSource(appSource: string) {
      storage.setItem('appSource', appSource);
      this.appSource = appSource;
    },
    updateQuery(query: any) {
      storage.setItem('query', query);
      this.query = query;
    },
    updateErrorMessage(errorMessage: string) {
      this.errorMessage = errorMessage;
    },
  },
});
