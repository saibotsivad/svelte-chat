<script lang="ts">
	import { onMount, tick } from 'svelte'

	interface Props {
		onSend?: (message: string) => void
		placeholder?: string
	}

	let { onSend, placeholder = 'Type a message…' }: Props = $props()

	let inputText = $state('')
	let inputElement: HTMLTextAreaElement

	function handleSend() {
		const text = inputText.trim()
		if (!text) return
		inputText = ''
		onSend?.(text)
		inputElement?.focus()
		tick().then(() => {
			handleGrow()
		})
	}

	function handleGrow() {
		if (inputElement?.parentNode) {
			;(inputElement.parentNode as HTMLElement).dataset.replicatedValue = inputElement.value
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	export function focus() {
		inputElement?.focus()
	}

	onMount(() => {
		inputElement?.focus()
	})
</script>

<form
	class="input-area"
	onsubmit={(e) => {
		e.preventDefault()
		handleSend()
	}}
>
	<div class="grow-wrap">
		<textarea
			id="chat-input"
			bind:this={inputElement}
			bind:value={inputText}
			onkeydown={handleKeydown}
			{placeholder}
			rows="1"
			oninput={handleGrow}
		></textarea>
	</div>
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

	/* START----------
	https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/
	*/
	.grow-wrap {
		flex: 1;
		/* easy way to plop the elements on top of each other and have them both sized based on the tallest one's height */
		display: grid;
	}
	.grow-wrap::after {
		/* Note the weird space! Needed to preventy jumpy behavior */
		content: attr(data-replicated-value) ' ';
		/* This is how textarea text behaves */
		white-space: pre-wrap;
		/* Hidden from view, clicks, and screen readers */
		visibility: hidden;
	}
	.grow-wrap > textarea {
		/* You could leave this, but after a user resizes, then it ruins the auto sizing */
		resize: none;
		/* Firefox shows scrollbar on growth, you can hide like this. */
		overflow: hidden;
	}
	.grow-wrap > textarea,
	.grow-wrap::after {
		/* Identical styling required!! */
		border: 1px solid black;
		padding: 0.5rem;
		font: inherit;
		/* Place on top of each other */
		grid-area: 1 / 1 / 2 / 2;
	}
	/* END---------- */

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
