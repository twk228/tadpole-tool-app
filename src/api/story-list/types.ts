export interface TabListParams {
  app_id: string;
  app_secret: string;
}

export interface StoryListParams {
  app_id: string;
  app_secret: string;
  type_id: number;
  page: number;
}

export interface StorySearchParams {
  app_id: string;
  app_secret: string;
  keyword: string;
  page: number;
}

export interface StoryDetailParams {
  app_id: string;
  app_secret: string;
  story_id: string;
}
