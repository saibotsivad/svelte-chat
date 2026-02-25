<script lang="ts">
	import ChatBubble from '$lib/ChatBubble.svelte'
	import type { ChatMessage } from '$lib/types.ts'

	const now = new Date()

	const bubbles: Array<{ message: ChatMessage; own: boolean; label: string }> = [
		{
			label: 'bot message',
			own: false,
			message: {
				localId: 'b1',
				messageId: 'msg-b1',
				sender: 'bot',
				content: 'Hey there! This is a message from the bot.',
				sentAt: new Date(now.getTime() - 60000 * 3),
				serverReceivedAt: new Date(now.getTime() - 60000 * 3),
				deliveredAt: new Date(now.getTime() - 60000 * 3),
				readAt: new Date(now.getTime() - 60000 * 3),
				streaming: false,
			},
		},
		{
			label: 'sending',
			own: true,
			message: {
				localId: 'u1',
				messageId: null,
				sender: 'user',
				content: 'Just sent this.',
				sentAt: new Date(now.getTime() - 60000 * 2),
				streaming: false,
			},
		},
		{
			label: 'sent',
			own: true,
			message: {
				localId: 'u2',
				messageId: 'msg-u2',
				sender: 'user',
				content: 'Server received this one.',
				sentAt: new Date(now.getTime() - 60000 * 2),
				serverReceivedAt: new Date(now.getTime() - 60000 * 2),
				streaming: false,
			},
		},
		{
			label: 'received',
			own: true,
			message: {
				localId: 'u3',
				messageId: 'msg-u3',
				sender: 'user',
				content: 'The recipient got this one.',
				sentAt: new Date(now.getTime() - 60000),
				serverReceivedAt: new Date(now.getTime() - 60000),
				deliveredAt: new Date(now.getTime() - 60000),
				streaming: false,
			},
		},
		{
			label: 'read',
			own: true,
			message: {
				localId: 'u4',
				messageId: 'msg-u4',
				sender: 'user',
				content: 'And this one was read.',
				sentAt: now,
				serverReceivedAt: now,
				deliveredAt: now,
				readAt: now,
				streaming: false,
			},
		},
		{
			label: 'streaming',
			own: false,
			message: {
				localId: 'b2',
				messageId: 'msg-b2',
				sender: 'bot',
				content: 'The bot is still typing',
				sentAt: now,
				streaming: true,
			},
		},
	]
</script>

<div class="bubble-list">
	{#each bubbles as item (item.message.localId)}
		<div class="bubble-row" class:own={item.own}>
			<span class="label">{item.label}</span>
			<div class="bubble-wrap">
				<ChatBubble message={item.message} own={item.own} />
			</div>
		</div>
	{/each}
</div>

<style>
	.bubble-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 24px;
		max-width: 600px;
		margin: 0 auto;
	}

	.bubble-row {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.bubble-row.own {
		align-items: flex-end;
	}

	.label {
		font-size: 11px;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.bubble-wrap {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
