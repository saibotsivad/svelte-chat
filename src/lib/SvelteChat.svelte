<script lang="ts">
	import { onMount, tick } from 'svelte'
	import type { ChatMessage } from './index.js'
	import ChatBubble from './ChatBubble.svelte'
	import ChatInput from './ChatInput.svelte'

	interface Props {
		currentUser: string
		onSend?: (message: string) => void
		onLoad?: () => Promise<ChatMessage[]> | ChatMessage[]
		placeholder?: string
		class?: string
	}

	let {
		currentUser,
		onSend,
		onLoad,
		placeholder = 'Type a message…',
		class: className = '',
	}: Props = $props()

	let messages = $state<ChatMessage[]>([])
	let loading = $state(false)
	let messagesEl: HTMLElement

	async function scrollToBottom() {
		await tick()
		if (messagesEl) {
			messagesEl.scrollTop = messagesEl.scrollHeight
		}
	}

	export function pushMessage(message: ChatMessage) {
		messages.push(message)
		scrollToBottom()
	}

	export function pushMessages(newMessages: ChatMessage[]) {
		messages.push(...newMessages)
		scrollToBottom()
	}

	export function clearMessages() {
		messages.length = 0
	}

	function handleSend(message: string) {
		onSend?.(message)
		scrollToBottom()
	}

	onMount(async () => {
		if (onLoad) {
			loading = true
			try {
				const initial = await onLoad()
				messages.push(...initial)
				await scrollToBottom()
			} finally {
				loading = false
			}
		}
	})
</script>

<div class="svelte-chat {className}">
	<div class="messages" bind:this={messagesEl}>
		{#if loading}
			<div class="loading">Loading messages…</div>
		{/if}

		{#each messages as msg (msg.id)}
			<ChatBubble message={msg} own={msg.sender === currentUser} />
		{/each}
	</div>

	<ChatInput onSend={handleSend} {placeholder} />
</div>

<style>
	.svelte-chat {
		display: flex;
		flex-direction: column;
		height: 100%;
		font-family: system-ui, -apple-system, sans-serif;
		font-size: 14px;
		background: #f8f9fa;
		color: #1a1a1a;
	}

	.messages {
		flex: 1;
		overflow-y: auto;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.loading {
		text-align: center;
		color: #888;
		padding: 24px;
	}
</style>
