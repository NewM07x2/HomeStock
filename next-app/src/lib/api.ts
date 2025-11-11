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
    // Server Component（サーバーサイド）の場合は、内部的に相対パスで呼び出す
    // クライアントサイドの場合は、相対パスで呼び出す
    const isServer = typeof window === 'undefined';
    
    // サーバーサイドでは絶対URLが必要な場合があるため、ベースURLを設定
    const baseUrl = isServer 
      ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
      : '';
    
    const url = `${baseUrl}/api/items?limit=${limit}&page=1`;
    
    console.log('[fetchRecentItems] Fetching from:', url);
    console.log('[fetchRecentItems] Environment:', {
      isServer,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      nodeEnv: process.env.NODE_ENV
    });
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Server Componentではキャッシュを使用
      next: { revalidate: 60 }
    });

    console.log('[fetchRecentItems] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[fetchRecentItems] Response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[fetchRecentItems] Success, items count:', data.items?.length || 0);
    return data.items || [];
  } catch (error) {
    console.error('[fetchRecentItems] Failed to fetch recent items:', error);
    if (error instanceof Error) {
      throw error;
    }
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

/**
 * 検索条件付きでアイテムを取得
 */
export const fetchItemsWithSearch = async (params: {
  page?: number;
  limit?: number;
  code?: string;
  name?: string;
  categories?: string;
  minQty?: string;
  maxQty?: string;
}): Promise<{ items: Item[]; total: number }> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', String(params.page));
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.code) queryParams.append('code', params.code);
    if (params.name) queryParams.append('name', params.name);
    if (params.categories) queryParams.append('categories', params.categories);
    if (params.minQty) queryParams.append('minQty', params.minQty);
    if (params.maxQty) queryParams.append('maxQty', params.maxQty);

    const response = await fetch(`/api/items?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // クライアントサイドなので常に最新データを取得
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      items: data.items || [],
      total: data.total || 0
    };
  } catch (error) {
    console.error('Failed to fetch items with search:', error);
    throw new Error('Failed to fetch items. Please try again later.');
  }
};

// 月別集計用の型定義
export interface DailyAmount {
  date: number;
  amount: number;
}

export interface MonthlySummaryData {
  year: number;
  month: number;
  totalAmount: number;
  dailyAmounts: DailyAmount[];
}

/**
 * 月別利用金額を取得
 */
export const fetchMonthlySummary = async (year: number, month: number): Promise<MonthlySummaryData> => {
  try {
    const apiBaseUrl = typeof window === 'undefined' 
      ? (process.env.API_BASE_URL || 'http://localhost:3000')
      : (process.env.NEXT_PUBLIC_API_BASE_URL || '');
    
    const response = await axios.get<MonthlySummaryData>(
      `${apiBaseUrl}/api/monthly-summary?year=${year}&month=${month + 1}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch monthly summary:', error);
    throw new Error('Failed to fetch monthly summary');
  }
};

/**
 * カテゴリマスタを取得
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const apiBaseUrl = typeof window === 'undefined' 
      ? (process.env.API_BASE_URL || 'http://localhost:8080')
      : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080');
    
    const response = await axios.get<Category[]>(`${apiBaseUrl}/api/categories`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

/**
 * IDでアイテムを取得
 */
export const fetchItemById = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`/api/items/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch item by id:', error);
    throw new Error('Failed to fetch item');
  }
};

/**
 * アイテムを作成
 */
export const createItem = async (payload: any): Promise<any> => {
  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create item:', error);
    throw new Error('Failed to create item');
  }
};

/**
 * アイテムを更新
 */
export const updateItem = async (id: string, payload: any): Promise<any> => {
  try {
    const response = await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to update item:', error);
    throw new Error('Failed to update item');
  }
};

/**
 * カテゴリ別統計情報を取得
 */
export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export const fetchCategoryStats = async (): Promise<CategoryStat[]> => {
  try {
    const response = await fetch('/api/reports/category-stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch category stats:', error);
    throw new Error('Failed to fetch category stats');
  }
};

/**
 * 月別利用金額を取得
 */
export interface MonthlyUsage {
  month: string;
  amount: number;
}

export const fetchMonthlyUsage = async (): Promise<MonthlyUsage[]> => {
  try {
    const response = await fetch('/api/reports/monthly-usage', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch monthly usage:', error);
    throw new Error('Failed to fetch monthly usage');
  }
};

export { saveItem, fetchItems };