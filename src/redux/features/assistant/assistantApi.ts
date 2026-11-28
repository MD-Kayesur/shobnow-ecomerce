import { baseApi } from '@/redux/hooks/baseApi';

export type AssistantTurn = { role: 'user' | 'assistant'; text: string };
export type AssistantSession = {
  id: string;
  createdAt: string;
  lastMessageAt: string;
  messages: Array<{ role: 'USER' | 'ASSISTANT'; content: string; productIds: string[] }>;
};
export type AssistantReply = {
  sessionId: string | null;
  reply: string;
  recommendations: Array<{ productId: string }>;
  safetyNotice: string;
};
type Envelope<T> = { data: T };
const safeHistory = (history?: AssistantTurn[]) =>
  history?.slice(-8).map((turn) => ({ role: turn.role, text: turn.text.slice(0, 1000) }));

export const assistantApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAssistantSessions: build.query<Envelope<AssistantSession[]>, void>({
      query: () => '/ai/cosmetics/chat/sessions',
      providesTags: ['AssistantSessions'],
    }),
    getAssistantSession: build.query<Envelope<AssistantSession>, string>({
      query: (id) => `/ai/cosmetics/chat/sessions/${id}`,
    }),
    deleteAssistantSession: build.mutation<Envelope<null>, string>({
      query: (id) => ({ url: `/ai/cosmetics/chat/sessions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['AssistantSessions'],
    }),
    sendAssistantMessage: build.mutation<Envelope<AssistantReply>, {
      authenticated: boolean;
      message: string;
      sessionId?: string;
      history?: AssistantTurn[];
      photo?: File;
      photoConsent?: boolean;
    }>({
      query: ({ authenticated, message, sessionId, history, photo, photoConsent }) => {
        if (photo) {
          const body = new FormData();
          body.append('message', message);
          if (sessionId) body.append('sessionId', sessionId);
          // The backend multipart parser validates this JSON field as a string on some
          // deployments; omit optional context so photo + caption sends remain reliable.
          if (photoConsent) body.append('photoConsent', 'true');
          body.append('photo', photo);
          return { url: authenticated ? '/ai/cosmetics/chat' : '/assistant/chat', method: 'POST', body };
        }
        return {
          url: authenticated ? '/ai/cosmetics/chat' : '/assistant/chat',
          method: 'POST',
          body: { message, ...(sessionId ? { sessionId } : {}), ...(history ? { history: safeHistory(history) } : {}) },
        };
      },
      invalidatesTags: (_result, _error, args) => args.authenticated ? ['AssistantSessions'] : [],
    }),
    transcribeAssistantAudio: build.mutation<Envelope<{ transcript: string }>, File>({
      query: (audio) => {
        const body = new FormData();
        body.append('audio', audio);
        return { url: '/assistant/transcribe', method: 'POST', body };
      },
    }),
  }),
});

export const {
  useGetAssistantSessionsQuery,
  useGetAssistantSessionQuery,
  useDeleteAssistantSessionMutation,
  useSendAssistantMessageMutation,
  useTranscribeAssistantAudioMutation,
} = assistantApi;
