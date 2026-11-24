import { baseApi } from "@/redux/hooks/baseApi";

export interface AuditPageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ActivityLog {
  id: string;
  userId?: string | null;
  visitorId?: string | null;
  deviceId?: string | null;
  requestId?: string | null;
  category: string;
  action: string;
  description?: string | null;
  resource?: string | null;
  resourceId?: string | null;
  method?: string | null;
  path: string;
  statusCode?: number | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  durationMs?: number | null;
  metadata?: unknown;
  createdAt: string;
  user?: { id: string; name?: string | null; email?: string | null; role?: string } | null;
}

export interface ErrorLog {
  id: string;
  requestId: string;
  level: "WARN" | "ERROR";
  statusCode: number;
  errorCode: string;
  errorType: string;
  message: string;
  path: string;
  method: string;
  userId?: string | null;
  visitorId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  stack?: string | null;
  details?: unknown;
  createdAt: string;
}

interface PageEnvelope<T> {
  data: T[];
  meta: AuditPageMeta;
}

export interface ActivityLogQuery {
  page: number;
  limit: number;
  search?: string;
  userId?: string;
  visitorId?: string;
  deviceId?: string;
  category?: string;
  action?: string;
  statusCode?: number;
  from?: string;
  to?: string;
}

export interface ErrorLogQuery {
  page: number;
  limit: number;
  search?: string;
  userId?: string;
  visitorId?: string;
  level?: "WARN" | "ERROR";
  statusCode?: number;
  from?: string;
  to?: string;
}

export const auditLogsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getActivityLogs: build.query<PageEnvelope<ActivityLog>, ActivityLogQuery>({
      query: (params) => ({ url: "/admin/activity-logs", params }),
    }),
    getActivityLog: build.query<{ data: ActivityLog }, string>({
      query: (id) => `/admin/activity-logs/${id}`,
    }),
    getErrorLogs: build.query<PageEnvelope<ErrorLog>, ErrorLogQuery>({
      query: (params) => ({ url: "/admin/error-logs", params }),
    }),
    getErrorLog: build.query<{ data: ErrorLog }, string>({
      query: (requestId) => `/admin/error-logs/${requestId}`,
    }),
  }),
});

export const {
  useGetActivityLogsQuery,
  useGetActivityLogQuery,
  useGetErrorLogsQuery,
  useGetErrorLogQuery,
} = auditLogsApi;
