export interface StoryItem {
  storyId: number;
  title: string;
  type: string;
  readTime: string;
  content?: string;
  length: number;
}

export interface TabItem {
  type_id: number;
  name: string;
}
