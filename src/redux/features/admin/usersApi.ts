import { baseApi } from '@/redux/hooks/baseApi';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_VERIFICATION' | 'BLOCK' | 'SUSPEND';

export interface ManagedUser {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  phoneNumber: string | null;
  role: string;
  status: UserStatus;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  _count: { orders: number; wishlistItems: number; activityLogs: number; errorLogs: number };
}

export interface UserSummary {
  total: number;
  active: number;
  inactive: number;
  pendingVerification: number;
}

export interface UsersPageResult {
  data: ManagedUser[];
  meta: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean; summary: UserSummary };
}

export interface ManagedUserDetail extends ManagedUser {
  _count: ManagedUser['_count'] & { devices: number; savedLooks: number; tryOnSessions: number; cosmeticChatSessions: number };
  orders: Array<{ id: string; orderNumber: string; status: string; paymentStatus: string; total: string; currencyCode: string; createdAt: string }>;
  orderSummary: { count: number; totalSpent: string };
  activityLogs: Array<{ id: string; visitorId: string | null; deviceId: string | null; requestId: string | null; category: string; action: string; description: string | null; path: string; method: string | null; statusCode: number | null; ipAddress: string | null; userAgent: string | null; createdAt: string }>;
  errorLogs: Array<{ id: string; requestId: string; level: string; statusCode: number; errorCode: string; errorType: string; message: string; path: string; method: string; visitorId: string | null; ipAddress: string | null; userAgent: string | null; createdAt: string }>;
  devices: Array<{ firstLinkedAt: string; lastLinkedAt: string; device: { id: string; firstSeenAt: string; lastSeenAt: string; lastIpAddress: string | null; lastUserAgent: string | null } }>;
}

interface Envelope<T> { data: T; }

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getManagedUsers: build.query<UsersPageResult, { page: number; limit: number; search?: string; status?: UserStatus }>({
      query: (params) => ({ url: '/admin/users', params }),
      providesTags: ['Users'],
    }),
    getManagedUser: build.query<Envelope<ManagedUserDetail>, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),
    updateManagedUser: build.mutation<Envelope<ManagedUser>, { id: string; body: { name?: string; phoneNumber?: string; status?: UserStatus } }>({
      query: ({ id, body }) => ({ url: `/admin/users/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => ['Users', { type: 'Users', id }],
    }),
  }),
});

export const { useGetManagedUsersQuery, useGetManagedUserQuery, useUpdateManagedUserMutation } = usersApi;
