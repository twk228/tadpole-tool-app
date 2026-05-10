import http, { Response } from '@/utils/http';
import {
  StoryDetailParams,
  StoryListParams,
  StorySearchParams,
  TabListParams,
} from './types';

export default {
  // 获取标签列表
  async getTabList(params: TabListParams): Promise<Response> {
    return await http.get<Response>('/mxnzpApi/story/types', params);
  },
  // 获取故事列表
  async getStoryList(params: StoryListParams): Promise<Response> {
    return await http.get<Response>('/mxnzpApi/story/list', params);
  },
  // 搜索故事
  async searchStory(params: StorySearchParams): Promise<Response> {
    return await http.get<Response>('/mxnzpApi/story/search', params);
  },

  // 获取故事详情
  async getStoryDetail(params: StoryDetailParams): Promise<Response> {
    return await http.get<Response>('/mxnzpApi/story/details', params);
  },
};
