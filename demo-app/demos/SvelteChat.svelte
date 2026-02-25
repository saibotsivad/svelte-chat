<script lang="ts">
	import { SvelteChat, type ChatMessage, type ActivityStatus } from '$lib/index.js'

	let messages = $state<ChatMessage[]>([
		{
			localId: '1',
			messageId: 'msg-1',
			sender: 'bot',
			content: 'Hey! Welcome to the chat demo.',
			sentAt: new Date(Date.now() - 60000 * 5),
			serverReceivedAt: new Date(Date.now() - 60000 * 5),
			deliveredAt: new Date(Date.now() - 60000 * 5),
			readAt: new Date(Date.now() - 60000 * 5),
			streaming: false,
		},
		{
			localId: '2',
			messageId: 'msg-2',
			sender: 'user',
			content: 'Thanks! This looks great.',
			sentAt: new Date(Date.now() - 60000 * 4),
			serverReceivedAt: new Date(Date.now() - 60000 * 4),
			deliveredAt: new Date(Date.now() - 60000 * 4),
			readAt: new Date(Date.now() - 60000 * 4),
			streaming: false,
		},
		{
			localId: '3',
			messageId: 'msg-3',
			sender: 'bot',
			content: "Try sending a message — I'll reply automatically.",
			sentAt: new Date(Date.now() - 60000 * 3),
			serverReceivedAt: new Date(Date.now() - 60000 * 3),
			deliveredAt: new Date(Date.now() - 60000 * 3),
			readAt: new Date(Date.now() - 60000 * 3),
			streaming: false,
		},
	])

	let activityStatus = $state<ActivityStatus | null>(null)
	let nextId = 100

	function onSend(content: string) {
		const localId = String(nextId++)
		messages.push({
			localId,
			messageId: null,
			sender: 'user',
			content,
			sentAt: new Date(),
			streaming: false,
		})

		setTimeout(() => {
			const msg = messages.find((m) => m.localId === localId)
			if (msg) {
				msg.serverReceivedAt = new Date()
				msg.messageId = `msg-${localId}`
			}
		}, 300)

		setTimeout(() => {
			activityStatus = { sender: 'bot', status: 'typing' }
		}, 500)

		setTimeout(() => {
			activityStatus = null
			const replyId = String(nextId++)
			messages.push({
				localId: replyId,
				messageId: `msg-${replyId}`,
				sender: 'bot',
				sentAt: new Date(),
				content: '',
				streaming: true,
			})

			const fullReply = `You said: "${content}"`
			let charIndex = 0
			const interval = setInterval(() => {
				const msg = messages.find((m) => m.localId === replyId)
				if (msg && charIndex < fullReply.length) {
					msg.content = fullReply.slice(0, ++charIndex)
				} else {
					clearInterval(interval)
					if (msg) msg.streaming = false
				}
			}, 30)
		}, 1200)
	}
</script>

<SvelteChat bind:messages currentUser="user" {activityStatus} {onSend} />

<style>
	:global(.demo-content) {
		--sc-bg: #0a3d71;
		--sc-bubble-text: #ffffff;
		--sc-bubble-bg: #000000;
		--sc-bubble-border: #4e4e4e;
		--sc-bubble-self-text: #ffffff;
		--sc-bubble-self-bg: #001442;
		--sc-bubble-self-border: #696868;
		--sc-status: #878787;
		--sc-status-read: #17a6ff;
		--sc-footer-bg: #001442;
		--sc-footer-border: #696868;
		--sc-input-border: #696868;
		--sc-input-focus-border: #17a6ff;
		--sc-button-bg: #17a6ff;
		--sc-button-text: #ffffff;
	}
</style>
