<script lang="ts">
	import { onMount, tick } from 'svelte'
	import { SvelteSet } from 'svelte/reactivity'
	import type { ActivityStatus, ChatMessage } from './types.js'
	import ChatBubble from './ChatBubble.svelte'
	import ChatInput from './ChatInput.svelte'

	interface Props {
		currentUser: 'user' | 'bot'
		messages?: ChatMessage[]
		activityStatus?: ActivityStatus | null
		onSend?: (message: string) => void
		onMessageVisible?: (message: ChatMessage) => void
		onLoad?: () => Promise<ChatMessage[]> | ChatMessage[]
		placeholder?: string
		class?: string
	}

	let {
		currentUser,
		messages = $bindable([]),
		activityStatus = null,
		onSend,
		onMessageVisible,
		onLoad,
		placeholder = 'Type a message…',
		class: className = '',
	}: Props = $props()
	let loading = $state(false)
	let messagesElement: HTMLElement
	let visibleMessageIds = new SvelteSet<string>()
	let isNearBottom = $state(true)

	async function scrollToBottom() {
		await tick()
		if (messagesElement) {
			messagesElement.scrollTop = messagesElement.scrollHeight
		}
	}

	/**
	 * We do want to auto scroll to the bottom, but if you've scrolled
	 * up a ways then we don't want incoming messages/statuses to
	 * yank the view back down.
	 *
	 * Currently this only keeps it from yanking for streamed messages
	 * and status changes, but I think it won't prevent yanking
	 */
	const NEAR_BOTTOM_THRESHOLD = 15 // pixels from bottom to consider "near bottom"
	function handleScroll() {
		if (!messagesElement) return
		const { scrollTop, scrollHeight, clientHeight } = messagesElement
		isNearBottom = scrollHeight - scrollTop - clientHeight < NEAR_BOTTOM_THRESHOLD
	}

	export function pushMessage(message: ChatMessage) {
		const currentlyNearBottom = isNearBottom
		messages.push(message)
		tick().then(() => {
			if (currentlyNearBottom) scrollToBottom()
		})
	}

	export function pushMessages(newMessages: ChatMessage[]) {
		const currentlyNearBottom = isNearBottom
		messages.push(...newMessages)
		tick().then(() => {
			if (currentlyNearBottom) scrollToBottom()
		})
	}

	export function clearMessages() {
		messages.length = 0
	}

	// This captures the initial state, but the $effect updates it.
	// svelte-ignore state_referenced_locally
	let previousStatus = activityStatus?.sender === 'bot' ? activityStatus.status : null
	/**
	 * If the activity status changes, we want to scroll down
	 * so long as the user hasn't scrolled up a ways.
	 */
	$effect(() => {
		if (activityStatus?.sender === 'bot' && activityStatus.status !== previousStatus) {
			previousStatus = activityStatus.status
			if (isNearBottom) scrollToBottom()
		}
	})

	let lastMessageIndex = messages.length - 1
	let lastMessageContent = messages[lastMessageIndex]?.content
	/**
	 * For streaming messages, as new chunks come in we want to continue
	 * scrolling down, so long as the user hasn't scrolled up a ways.
	 */
	$effect(() => {
		lastMessageIndex = messages.length - 1
		if (messages[lastMessageIndex]?.content !== lastMessageContent) {
			lastMessageContent = messages[lastMessageIndex]?.content
			if (isNearBottom) scrollToBottom()
		}
	})

	function handleSend(message: string) {
		onSend?.(message)
		if (isNearBottom) scrollToBottom()
	}

	function formatActivityStatus(status: ActivityStatus): string {
		const name = status.sender === 'bot' ? 'Bot' : 'User'
		return `${name} is ${status.status}…`
	}

	function observeMessage(node: HTMLElement, message: ChatMessage) {
		if (!onMessageVisible) return {}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && !visibleMessageIds.has(message.localId)) {
						visibleMessageIds.add(message.localId)
						onMessageVisible(message)
						observer.disconnect()
					}
				}
			},
			{ threshold: 0.5 },
		)

		observer.observe(node)

		return {
			destroy() {
				observer.disconnect()
			},
		}
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
	<div class="messages" bind:this={messagesElement} onscroll={handleScroll}>
		{#if loading}
			<div class="loading">Loading messages…</div>
		{/if}

		{#each messages as msg (msg.localId)}
			<div use:observeMessage={msg}>
				<ChatBubble message={msg} own={msg.sender === currentUser} />
			</div>
		{/each}

		{#if activityStatus}
			<div class="activity-status">
				{formatActivityStatus(activityStatus)}
			</div>
		{/if}
	</div>

	<ChatInput onSend={handleSend} {placeholder} />
</div>

<style>
	.svelte-chat {
		display: flex;
		flex-direction: column;
		height: 100%;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		font-size: 14px;
		background: var(--sc-bg, #f8f9fa);
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
		color: var(--sc-muted, #888);
		padding: 24px;
	}

	.activity-status {
		padding: 8px 12px;
		font-size: 13px;
		color: var(--sc-muted, #888);
		font-style: italic;
	}
</style>
