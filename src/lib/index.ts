import SvelteChat from './SvelteChat.svelte'

export interface ChatMessage {
	id: string
	sender: string
	sent: Date
	received?: Date
	message: string
}

export { SvelteChat }
