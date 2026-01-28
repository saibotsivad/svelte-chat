<script lang="ts">
	import type { ChatMessage } from './index.js'

	interface Props {
		message: ChatMessage
		own: boolean
	}

	let { message, own }: Props = $props()

	function formatTime(date: Date): string {
		return date.toLocaleTimeString(undefined, {
			hour: 'numeric',
			minute: '2-digit',
		})
	}
</script>

<div class="message" class:own>
	<div class="bubble">
		{#if !own}
			<span class="sender">{message.sender}</span>
		{/if}
		<p class="text">{message.message}</p>
		<span class="meta">
			<time>{formatTime(message.sent)}</time>
			{#if own}
				{#if message.status === 'sending'}
					<span class="status-icon" title="Sending">
						<svg viewBox="0 0 16 16" width="16" height="16">
							<circle cx="4" cy="8" r="1.2" fill="currentColor" opacity="0.4" />
							<circle cx="8" cy="8" r="1.2" fill="currentColor" opacity="0.6" />
							<circle cx="12" cy="8" r="1.2" fill="currentColor" opacity="0.8" />
						</svg>
					</span>
				{:else if message.status === 'sent'}
					<span class="status-icon sent" title="Sent">
						<svg viewBox="0 0 16 16" width="16" height="16">
							<path
								d="M4 8.5 L6.5 11 L12 5"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				{:else if message.status === 'delivered'}
					<span class="status-icon delivered" title="Delivered">
						<svg viewBox="0 0 20 16" width="20" height="16">
							<path
								d="M4 8.5 L6.5 11 L12 5"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M8 8.5 L10.5 11 L16 5"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				{:else if message.status === 'read'}
					<span class="status-icon read" title="Read">
						<svg viewBox="0 0 20 16" width="20" height="16">
							<path
								d="M4 8.5 L6.5 11 L12 5"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M8 8.5 L10.5 11 L16 5"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				{:else if message.status === 'error'}
					<span class="status-icon error" title="Failed to send">
						<svg viewBox="0 0 16 16" width="16" height="16">
							<circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5" />
							<path
								d="M8 4.5 L8 9"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
							/>
							<circle cx="8" cy="11.5" r="0.8" fill="currentColor" />
						</svg>
					</span>
				{/if}
			{/if}
		</span>
	</div>
</div>

<style>
	.message {
		display: flex;
		justify-content: flex-start;
		max-width: 80%;
	}

	.message.own {
		align-self: flex-end;
		justify-content: flex-end;
	}

	.bubble {
		position: relative;
		padding: 8px 12px;
		color: var(--sc-bubble-text, #555);
		background: var(--sc-bubble-bg, #fff);
		border: 1px solid var(--sc-bubble-border, #e0e0e0);
		border-radius: 12px;
		word-break: break-word;
	}

	.bubble::after {
		content: '';
		position: absolute;
		bottom: 8px;
		left: -6px;
		width: 0;
		height: 0;
		border-top: 6px solid transparent;
		border-bottom: 6px solid transparent;
		border-right: 6px solid var(--sc-bubble-bg, #fff);
	}

	.bubble::before {
		content: '';
		position: absolute;
		bottom: 7px;
		left: -8px;
		width: 0;
		height: 0;
		border-top: 7px solid transparent;
		border-bottom: 7px solid transparent;
		border-right: 7px solid var(--sc-bubble-border, #e0e0e0);
	}

	.message.own .bubble {
		color: var(--sc-bubble-self-text, #fff);
		background: var(--sc-bubble-self-bg, #0b93f6);
		border-color: var(--sc-bubble-self-border, #0b93f6);
	}

	.message.own .bubble::after {
		left: auto;
		right: -6px;
		border-right: none;
		border-left: 6px solid var(--sc-bubble-self-bg, #0b93f6);
	}

	.message.own .bubble::before {
		left: auto;
		right: -8px;
		border-right: none;
		border-left: 7px solid var(--sc-bubble-self-border, #0b93f6);
	}

	.sender {
		display: block;
		font-size: 12px;
		font-weight: 600;
		margin-bottom: 2px;
	}

	.text {
		margin: 0;
		white-space: pre-wrap;
	}

	.meta {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 4px;
		margin-top: 4px;
		font-size: 11px;
		opacity: 0.7;
	}

	.status-icon {
		width: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 0;
	}

	.status-icon.sent,
	.status-icon.delivered {
		color: var(--sc-status, #999);
	}

	.status-icon.read {
		color: var(--sc-status-read, #3b82f6);
	}

	.status-icon.error {
		color: var(--sc-status-error, #e53e3e);
	}
</style>
