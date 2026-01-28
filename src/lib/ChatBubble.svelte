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
			{#if message.status === 'sending'}
				<span class="status">…</span>
			{:else if message.status === 'error'}
				<span class="status error">!</span>
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
		padding: 8px 12px;
		border-radius: 12px;
		background: #fff;
		border: 1px solid #e0e0e0;
		word-break: break-word;
	}

	.message.own .bubble {
		background: #0b93f6;
		color: #fff;
		border-color: #0b93f6;
	}

	.sender {
		display: block;
		font-size: 12px;
		font-weight: 600;
		margin-bottom: 2px;
		color: #555;
	}

	.text {
		margin: 0;
		white-space: pre-wrap;
	}

	.meta {
		display: flex;
		justify-content: flex-end;
		gap: 4px;
		margin-top: 4px;
		font-size: 11px;
		opacity: 0.7;
	}

	.status.error {
		color: #e53e3e;
		font-weight: 700;
	}
</style>
