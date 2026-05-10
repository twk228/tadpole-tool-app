import { defineStore } from 'pinia';

/**
 * root层state类型定义
 */

export const usePublicDataStore = defineStore('publicData', {
  state: () => {
    const stateData = {};
    return stateData;
  },
  getters: {},
  actions: {},
});
