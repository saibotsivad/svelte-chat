import SvelteChat from './SvelteChat.svelte'

export interface ChatMessage {
	id: string
	sender: string
	sent: Date
	received?: Date
	message: string
	status?: 'sending' | 'sent' | 'error'
}

export { SvelteChat }
