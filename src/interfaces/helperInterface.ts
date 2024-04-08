import { IQueryParams } from '@/utils/query-params';

export interface IParams extends IQueryParams {
  page: number;
  pageSize: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse {
  total: number;
  page: number;
  pageSize: number;
}

export interface IFilter {
  label: string;
  values: any;
  key: string;
}
