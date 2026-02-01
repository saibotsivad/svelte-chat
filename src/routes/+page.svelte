<!--

This is a demo place to make sure the chat component looks and behaves correctly.

-->
<script lang="ts">
	import { SvelteChat, type ChatMessage, type ActivityStatus } from '$lib/index.js'

	const deliveryStateValues = ['sending', 'sent', 'received', 'read'] as const
	let currentDeliveryState = $state<'sending' | 'sent' | 'received' | 'read'>('read')

	const activityStatusOptions = ['none', 'typing', 'thinking', 'searching']

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
	let lastOwnMessage = $derived(messages.findLast((m) => m.sender === 'user') ?? null)
	let activityStatus = $state<ActivityStatus | null>(null)
	let streamingReplyId = $state<string | null>(null)

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

		// Simulate message being sent
		setTimeout(() => {
			const msg = messages.find((m) => m.localId === localId)
			if (msg) {
				msg.serverReceivedAt = new Date()
				msg.messageId = `msg-${localId}`
			}
		}, 300)

		// Simulate bot typing
		setTimeout(() => {
			activityStatus = { sender: 'bot', status: 'typing' }
		}, 500)

		// Simulate a streaming reply
		setTimeout(() => {
			activityStatus = null
			const replyId = String(nextId++)
			streamingReplyId = replyId
			messages.push({
				localId: replyId,
				messageId: `msg-${replyId}`,
				sender: 'bot',
				sentAt: new Date(),
				content: '',
				streaming: true,
			})

			// Simulate streaming chunks
			const fullReply = `You said: "${content}"`
			let charIndex = 0
			const interval = setInterval(() => {
				const msg = messages.find((m) => m.localId === replyId)
				if (msg && charIndex < fullReply.length) {
					msg.content = fullReply.slice(0, ++charIndex)
				} else {
					clearInterval(interval)
					if (msg) {
						msg.streaming = false
					}
					streamingReplyId = null
				}
			}, 30)
		}, 1200)
	}

	function setDeliveryState(value: 'sending' | 'sent' | 'received' | 'read') {
		if (!lastOwnMessage) return
		currentDeliveryState = value
		if (value === 'sending') {
			lastOwnMessage.sentAt = new Date()
			lastOwnMessage.serverReceivedAt = undefined
			lastOwnMessage.deliveredAt = undefined
			lastOwnMessage.readAt = undefined
		} else if (value === 'sent') {
			lastOwnMessage.sentAt = new Date()
			lastOwnMessage.serverReceivedAt = new Date()
			lastOwnMessage.deliveredAt = undefined
			lastOwnMessage.readAt = undefined
		} else if (value === 'received') {
			lastOwnMessage.sentAt = new Date()
			lastOwnMessage.serverReceivedAt = new Date()
			lastOwnMessage.deliveredAt = new Date()
			lastOwnMessage.readAt = undefined
		} else {
			lastOwnMessage.sentAt = new Date()
			lastOwnMessage.serverReceivedAt = new Date()
			lastOwnMessage.deliveredAt = new Date()
			lastOwnMessage.readAt = new Date()
		}
	}

	function setActivityStatus(value: string) {
		if (value === 'none') {
			activityStatus = null
		} else {
			activityStatus = { sender: 'bot', status: value }
		}
	}

	function onMessageVisible(message: ChatMessage) {
		console.log(
			'Message visible, e.g. send read receipt:',
			message.localId,
			message.content.slice(0, 30),
		)
	}
</script>

<div class="demo-layout">
	<aside class="settings">
		<h2>Settings</h2>

		<section>
			<h3>Last Sent Message</h3>
			{#if lastOwnMessage}
				<p class="preview">"{lastOwnMessage.content}"</p>
				<div class="tab-bar">
					{#each deliveryStateValues as value (value)}
						<button
							class:active={currentDeliveryState === value}
							onclick={() => setDeliveryState(value)}
						>
							{value}
						</button>
					{/each}
				</div>
			{:else}
				<p class="empty">No messages yet.</p>
			{/if}
		</section>

		<section>
			<h3>Activity Status</h3>
			<div class="tab-bar">
				{#each activityStatusOptions as value (value)}
					<button
						class:active={value === 'none' ? !activityStatus : activityStatus?.status === value}
						onclick={() => setActivityStatus(value)}
					>
						{value}
					</button>
				{/each}
			</div>
		</section>

		<section>
			<h3>Streaming</h3>
			<p class="info">
				{#if streamingReplyId}
					Currently streaming message...
				{:else}
					Send a message to see streaming in action.
				{/if}
			</p>
		</section>
	</aside>

	<div class="chat-area">
		<SvelteChat bind:messages currentUser="user" {activityStatus} {onSend} {onMessageVisible} />
	</div>
</div>

<style>
	/* ---------- Color Scheme ---------- */
	:root {
		--sc-bg: #0a3d71;

		--sc-bubble-text: #ffffff;
		--sc-bubble-bg: #000000;
		--sc-bubble-border: #4e4e4e;

		--sc-bubble-self-text: #ffffff;
		--sc-bubble-self-bg: #001442;
		--sc-bubble-self-border: #696868;

		--sc-status: #878787;
		--sc-status-read: #17a6ff;
		--sc-status-error: #ff4069;

		--sc-footer-bg: #001442;
		--sc-footer-border: #696868;

		--sc-input-border: #696868;
		--sc-input-focus-border: #17a6ff;
		--sc-button-bg: #17a6ff;
		--sc-button-text: #ffffff;
	}

	/* ---------- Demo Styles ---------- */
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	.demo-layout {
		display: grid;
		grid-template-columns: 1fr 28rem;
	}

	.demo-layout,
	.chat-area {
		height: 100vh;
	}
	.settings {
		overflow-y: scroll;
	}

	.settings {
		padding: 24px;
		border-right: 1px solid #e0e0e0;
		background: #fff;
		overflow-y: auto;
	}

	.settings h2 {
		margin: 0 0 16px;
		font-size: 18px;
	}

	.settings h3 {
		margin: 0 0 8px;
		font-size: 14px;
		color: #555;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.tab-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.tab-bar button {
		padding: 4px 10px;
		border: 1px solid #d0d0d0;
		border-radius: 6px;
		background: #f5f5f5;
		font: inherit;
		font-size: 12px;
		cursor: pointer;
		color: #555;
	}

	.tab-bar button:hover {
		background: #eee;
	}

	.tab-bar button.active {
		background: #0b93f6;
		border-color: #0b93f6;
		color: #fff;
	}

	.preview {
		font-size: 12px;
		color: #777;
		margin: 0 0 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	section {
		margin-bottom: 32px;
	}

	.empty,
	.info {
		font-size: 13px;
		color: #999;
	}

	.chat-area {
		border-left: 1px solid #e0e0e0;
	}
</style>
