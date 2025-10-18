import { API_URL } from '@/const/url';

export interface BlogPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export const getPosts = async (): Promise<BlogPost[]> => {
  try {
    const res = await fetch(API_URL.POSTS, {
      next: { revalidate: 60 },
      cache: 'force-cache'
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw new Error('Failed to fetch posts. Please try again later.');
  }
}

import { AsyncCountResponse } from './getJsonData';

const saveItem = async (item: any): Promise<AsyncCountResponse> => {
  const response = await fetch('/api/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error('Failed to save item');
  }

  return response.json();
};

export { saveItem };