import type { ActivityStatus, ChatMessage } from './types.ts';
interface Props {
    currentUser: 'user' | 'bot';
    messages?: ChatMessage[];
    activityStatus?: ActivityStatus | null;
    onSend?: (message: string) => void;
    onMessageVisible?: (message: ChatMessage) => void;
    onLoad?: () => Promise<ChatMessage[]> | ChatMessage[];
    placeholder?: string;
    class?: string;
}
declare const SvelteChat: import("svelte").Component<Props, {
    pushMessage: (message: ChatMessage) => void;
    pushMessages: (newMessages: ChatMessage[]) => void;
    clearMessages: () => void;
}, "messages">;
type SvelteChat = ReturnType<typeof SvelteChat>;
export default SvelteChat;
