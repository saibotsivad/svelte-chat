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

	function setStatus(value: ChatMessage['status']) {
		if (!lastOwnMessage) return
		lastOwnMessage.status = value
	}

	function statusLabel(value: ChatMessage['status']): string {
		return value ?? 'none'
	}
</script>

<div class="demo-layout">
	<aside class="settings">
		<h2>Settings</h2>

		<section>
			<h3>Last Sent Message</h3>
			{#if lastOwnMessage}
				<p class="preview">"{lastOwnMessage.message}"</p>
				<div class="tab-bar">
					{#each statusValues as value (value)}
						<button class:active={lastOwnMessage.status === value} onclick={() => setStatus(value)}>
							{statusLabel(value)}
						</button>
					{/each}
				</div>
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
	/* ---------- Color Scheme ---------- */
	:global(html[data-theme='dark']) {
		color-scheme: dark;
	}
	:global(html[data-theme='light']) {
		color-scheme: light;
	}
	:root {
		color-scheme: light dark;
		--sc-bg: #0d2d4e;

		--sc-bubble-text: #1a1a1a;
		--sc-bubble-bg: #fff;
		--sc-bubble-border: #e615e2;

		--sc-bubble-self-text: #fff;
		--sc-bubble-self-bg: #0b93f6;
		--sc-bubble-self-border: #e0e0e0;

		--sc-status: #e1dfdf;
		--sc-status-read: #53fe5f;
		--sc-status-error: #ff0000;

		--sc-footer-border: rgb(255, 85, 255);
		--sc-footer-bg: #ffbfbf;

		--sc-input-border: #e600ff;
		--sc-input-focus-border: #37dd37;
		--sc-button-bg: #0b93f6;
		--sc-button-text: #fffaaa;
	}
	@media (prefers-color-scheme: dark) {
		:root {
			--sc-bg: #0d2d4e;

			--sc-bubble-text: #1a1a1a;
			--sc-bubble-bg: #fff;
			--sc-bubble-border: #e615e2;

			--sc-bubble-self-text: #fff;
			--sc-bubble-self-bg: #0b93f6;
			--sc-bubble-self-border: #e0e0e0;

			--sc-status: #e1dfdf;
			--sc-status-read: #53fe5f;
			--sc-status-error: #ff0000;

			--sc-footer-border: rgb(255, 85, 255);
			--sc-footer-bg: #ffbfbf;

			--sc-input-border: #e600ff;
			--sc-input-focus-border: #37dd37;
			--sc-button-bg: #0b93f6;
			--sc-button-text: #fffaaa;
		}
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

	.empty {
		font-size: 13px;
		color: #999;
	}

	.chat-area {
		border-left: 1px solid #e0e0e0;
	}
</style>
