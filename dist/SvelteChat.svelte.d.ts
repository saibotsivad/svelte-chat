import type { ChatMessage } from './index.js';
interface Props {
    currentUser: string;
    messages?: ChatMessage[];
    onSend?: (message: string) => void;
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
