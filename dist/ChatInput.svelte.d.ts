interface Props {
	onSend?: (message: string) => void
	placeholder?: string
}
declare const ChatInput: import('svelte').Component<
	Props,
	{
		focus: () => void
	},
	''
>
type ChatInput = ReturnType<typeof ChatInput>
export default ChatInput
