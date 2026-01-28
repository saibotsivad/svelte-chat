<script lang="ts">
	import { onMount } from 'svelte'

	interface Props {
		onSend?: (message: string) => void
		placeholder?: string
	}

	let { onSend, placeholder = 'Type a message…' }: Props = $props()

	let inputText = $state('')
	let inputEl: HTMLTextAreaElement

	function handleSend() {
		const text = inputText.trim()
		if (!text) return
		inputText = ''
		onSend?.(text)
		resizeInput()
		inputEl?.focus()
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	function resizeInput() {
		if (!inputEl) return
		inputEl.style.height = 'auto'
		inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px'
	}

	export function focus() {
		inputEl?.focus()
	}

	onMount(() => {
		inputEl?.focus()
	})
</script>

<form
	class="input-area"
	onsubmit={(e) => {
		e.preventDefault()
		handleSend()
	}}
>
	<textarea
		bind:this={inputEl}
		bind:value={inputText}
		oninput={resizeInput}
		onkeydown={handleKeydown}
		{placeholder}
		rows="1"
	></textarea>
	<button type="submit" disabled={!inputText.trim()}>Send</button>
</form>

<style>
	.input-area {
		display: flex;
		gap: 8px;
		padding: 12px 16px;
		border-top: 1px solid var(--sc-footer-border, #e0e0e0);
		background: var(--sc-footer-bg, #fff);
	}

	textarea {
		flex: 1;
		resize: none;
		border: 1px solid var(--sc-input-border, #d0d0d0);
		border-radius: 8px;
		padding: 8px 12px;
		font: inherit;
		line-height: 1.4;
		outline: none;
		transition: border-color 0.15s;
	}

	textarea:focus {
		border-color: var(--sc-input-focus-border, #0b93f6);
	}

	button {
		align-self: flex-end;
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		background: var(--sc-button-bg, #0b93f6);
		color: var(--sc-button-text, #fff);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	button:disabled {
		opacity: 0.4;
		cursor: default;
	}

	button:not(:disabled):hover {
		opacity: 0.85;
	}
</style>
