<!--

This is a demo place to make sure the chat component looks and behaves correctly.

-->
<script lang="ts">
	import { SvelteChat, type ChatMessage } from '$lib/index.js'

	const me = 'You'

	const statusValues: Array<ChatMessage['status']> = [
		undefined,
		'sending',
		'sent',
		'delivered',
		'read',
		'error',
	]

	let messages = $state<ChatMessage[]>([
		{
			id: '1',
			sender: 'Alice',
			sent: new Date(Date.now() - 60000 * 5),
			message: 'Hey! Welcome to the chat demo.',
		},
		{
			id: '2',
			sender: me,
			sent: new Date(Date.now() - 60000 * 4),
			message: 'Thanks! This looks great.',
			status: 'read',
		},
		{
			id: '3',
			sender: 'Alice',
			sent: new Date(Date.now() - 60000 * 3),
			message: "Try sending a message — I'll reply automatically.",
		},
	])
	let lastOwnMessage = $derived(messages.findLast((m) => m.sender === me) ?? null)

	let nextId = 100

	function onSend(message: string) {
		messages.push({
			id: String(nextId++),
			sender: me,
			sent: new Date(),
			message,
			status: 'sending',
		})

		// Simulate a reply
		setTimeout(() => {
			messages.push({
				id: String(nextId++),
				sender: 'Alice',
				sent: new Date(),
				message: `You said: "${message}"`,
			})
		}, 800)
	}

	function cycleStatus() {
		if (!lastOwnMessage) return
		const current = lastOwnMessage.status
		const idx = statusValues.indexOf(current)
		lastOwnMessage.status = statusValues[(idx + 1) % statusValues.length]
	}

	function statusLabel(status: ChatMessage['status']): string {
		return status ?? 'none'
	}
</script>

<div class="demo-layout">
	<aside class="settings">
		<h2>Settings</h2>

		<section>
			<h3>Last Sent Message</h3>
			{#if lastOwnMessage}
				<p class="preview">"{lastOwnMessage.message}"</p>
				<label>
					Status
					<button onclick={cycleStatus}>
						{statusLabel(lastOwnMessage.status)}
					</button>
				</label>
			{:else}
				<p class="empty">No messages yet.</p>
			{/if}
		</section>
	</aside>

	<div class="chat-area">
		<SvelteChat bind:messages currentUser={me} {onSend} />
	</div>
</div>

<style>
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
		height: 100vh;
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

	.settings label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		color: #333;
	}

	.settings button {
		padding: 4px 12px;
		border: 1px solid #d0d0d0;
		border-radius: 6px;
		background: #f5f5f5;
		font: inherit;
		font-size: 13px;
		cursor: pointer;
		min-width: 80px;
		text-align: center;
	}

	.settings button:hover {
		background: #eee;
	}

	.preview {
		font-size: 12px;
		color: #777;
		margin: 0 0 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.empty {
		font-size: 13px;
		color: #999;
	}

	.chat-area {
		border-left: 1px solid #e0e0e0;
	}
</style>
