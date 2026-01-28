import type { ChatMessage } from './index.js';
interface Props {
    message: ChatMessage;
    own: boolean;
}
declare const ChatBubble: import("svelte").Component<Props, {}, "">;
type ChatBubble = ReturnType<typeof ChatBubble>;
export default ChatBubble;
