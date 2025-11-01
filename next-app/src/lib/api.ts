import { API_URL } from '@/const/url';
import axios from 'axios';

export interface BlogPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// カテゴリマスタ型定義
export interface Category {
  id: string;
  code: string;
  name: string;
  description?: string;
}

// 単位マスタ型定義
export interface Unit {
  id: string;
  code: string;
  name: string;
  description?: string;
}

// 属性詳細型定義
export interface ItemAttributeDetail {
  code: string;
  name: string;
  value: string;
  value_type: string;
}

// Item型定義
export interface Item {
  id: string;
  code: string;
  name: string;
  category_id?: string;
  unit_id: string;
  quantity?: number;
  status: string;
  created_at: string;
  updated_at: string;
  // 結合して取得するマスタ情報
  category?: Category;
  unit?: Unit;
  attributes?: ItemAttributeDetail[];
}

// Items API レスポンス型
export interface ItemsResponse {
  items: Item[];
  total: number;
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

/**
 * 最近登録されたアイテムを取得
 * @param limit 取得件数（デフォルト: 10）
 */
export const fetchRecentItems = async (limit: number = 10): Promise<Item[]> => {
  try {
    // サーバーサイド（Server Component）では API_BASE_URL を使用
    // クライアントサイドでは NEXT_PUBLIC_API_BASE_URL を使用
    const apiBaseUrl = typeof window === 'undefined' 
      ? (process.env.API_BASE_URL || 'http://localhost:8080')
      : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080');
    
    console.log('Fetching from:', apiBaseUrl);
    
    const response = await axios.get<ItemsResponse>(`${apiBaseUrl}/api/items`, {
      params: { limit },
    });
    
    return response.data.items || [];
  } catch (error) {
    console.error('Failed to fetch recent items:', error);
    throw new Error('Failed to fetch items. Please try again later.');
  }
};

const saveItem = async (item: any): Promise<any> => {
  try {
    const response = await axios.post('/api/items', item, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to save item:', error);
    throw new Error('Failed to save item');
  }
};

const fetchItems = async (): Promise<any> => {
  try {
    const response = await axios.get('/api/items');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch items:', error);
    throw new Error('Failed to fetch items');
  }
};

export { saveItem, fetchItems };