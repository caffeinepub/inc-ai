import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { Role, type UserProfile } from '../backend';

// ── User Profile ──────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export function useListSessions() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ['sessions', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSessions();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useCreateSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSession(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', identity?.getPrincipal().toString()] });
    },
  });
}

export function useDeleteSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSession(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', identity?.getPrincipal().toString()] });
    },
  });
}

// ── Messages ──────────────────────────────────────────────────────────────────

export function useGetMessages(sessionName: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['messages', sessionName],
    queryFn: async () => {
      if (!actor || !sessionName) return [];
      return actor.getMessages(sessionName);
    },
    enabled: !!actor && !actorFetching && !!sessionName,
  });
}

export function useAddMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionName, role, content }: { sessionName: string; role: Role; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMessage(sessionName, role, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.sessionName] });
    },
  });
}

// ── Send Message (AI Integration) ─────────────────────────────────────────────

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionName,
      userMessage,
      conversationHistory,
    }: {
      sessionName: string;
      userMessage: string;
      conversationHistory: ConversationMessage[];
    }) => {
      if (!actor) throw new Error('Actor not available');

      // 1. Save user message to backend
      await actor.addMessage(sessionName, Role.user, userMessage);
      queryClient.invalidateQueries({ queryKey: ['messages', sessionName] });

      // 2. Build messages array for Pollinations AI
      const messages: ConversationMessage[] = [
        {
          role: 'system',
          content: 'You are INC.ai, a helpful and intelligent AI assistant. Be concise, clear, and helpful.',
        },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];

      // 3. Call Pollinations AI API
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          messages,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent: string =
        data?.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response.';

      // 4. Save assistant response to backend
      await actor.addMessage(sessionName, Role.assistant, assistantContent);
      queryClient.invalidateQueries({ queryKey: ['messages', sessionName] });

      return assistantContent;
    },
  });
}
