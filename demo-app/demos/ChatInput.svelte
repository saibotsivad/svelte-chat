<script lang="ts">
	import ChatInput from '$lib/ChatInput.svelte'

	let sent = $state<string[]>([])

	function onSend(message: string) {
		sent.push(message)
	}
</script>

<div class="container">
	<div class="messages">
		{#if sent.length === 0}
			<p class="empty">Send a message below to see it appear here.</p>
		{:else}
			{#each sent as msg, i (i)}
				<div class="sent-message">{msg}</div>
			{/each}
		{/if}
	</div>
	<ChatInput {onSend} />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		max-width: 600px;
		margin: 0 auto;
	}

	.messages {
		flex: 1;
		padding: 24px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 8px;
	}

	.empty {
		color: #999;
		font-size: 14px;
		text-align: center;
		margin: 0;
	}

	.sent-message {
		align-self: flex-end;
		background: #0b93f6;
		color: #fff;
		padding: 8px 14px;
		border-radius: 12px;
		font-size: 15px;
		max-width: 80%;
		word-break: break-word;
	}
</style>
