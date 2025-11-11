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
    const res = await axios.get<BlogPost[]>(API_URL.POSTS);
    return res.data;
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
    const response = await axios.get<ItemsResponse>('/api/items', {
      params: {
        limit,
        page: 1
      }
    });
    
    console.log('[fetchRecentItems] Success, items count:', response.data.items?.length || 0);
    return response.data.items || [];
  } catch (error) {
    console.error('[fetchRecentItems] Failed to fetch recent items:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch items: ${error.message}`);
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
    const response = await axios.get<{ items: Item[]; total: number }>('/api/items', {
      params
    });

    return {
      items: response.data.items || [],
      total: response.data.total || 0
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
    const response = await axios.get<MonthlySummaryData>(
      `/api/monthly-summary?year=${year}&month=${month + 1}`
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
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
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
    const response = await axios.get(`/api/items/${id}`);
    return response.data;
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
    const response = await axios.post('/api/items', payload);
    return response.data;
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
    const response = await axios.put(`/api/items/${id}`, payload);
    return response.data;
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
    const response = await axios.get<CategoryStat[]>('/api/reports/category-stats');
    return response.data;
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
    const response = await axios.get<MonthlyUsage[]>('/api/reports/monthly-usage');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch monthly usage:', error);
    throw new Error('Failed to fetch monthly usage');
  }
};

export { saveItem, fetchItems };