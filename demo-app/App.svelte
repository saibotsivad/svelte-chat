<script lang="ts">
	import SvelteChatDemo from './demos/SvelteChat.svelte'
	import ChatBubbleDemo from './demos/ChatBubble.svelte'
	import ChatInputDemo from './demos/ChatInput.svelte'

	const components = [
		{ name: 'SvelteChat', label: 'SvelteChat' },
		{ name: 'ChatBubble', label: 'ChatBubble' },
		{ name: 'ChatInput', label: 'ChatInput' },
	]

	let hash = $state(window.location.hash.slice(1))

	$effect(() => {
		const handler = () => {
			hash = window.location.hash.slice(1)
		}
		window.addEventListener('hashchange', handler)
		return () => window.removeEventListener('hashchange', handler)
	})
</script>

{#if hash === 'SvelteChat'}
	<div class="demo-page">
		<header><button onclick={() => (window.location.hash = '')}>← Components</button><span>SvelteChat</span></header>
		<div class="demo-content"><SvelteChatDemo /></div>
	</div>
{:else if hash === 'ChatBubble'}
	<div class="demo-page">
		<header><button onclick={() => (window.location.hash = '')}>← Components</button><span>ChatBubble</span></header>
		<div class="demo-content"><ChatBubbleDemo /></div>
	</div>
{:else if hash === 'ChatInput'}
	<div class="demo-page">
		<header><button onclick={() => (window.location.hash = '')}>← Components</button><span>ChatInput</span></header>
		<div class="demo-content"><ChatInputDemo /></div>
	</div>
{:else}
	<div class="index-page">
		<h1>svelte-chat</h1>
		<ul>
			{#each components as comp (comp.name)}
				<li><a href="#{comp.name}">{comp.label}</a></li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}

	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		font-family: system-ui, -apple-system, sans-serif;
	}

	:global(#app) {
		height: 100%;
	}

	/* Index page */
	.index-page {
		max-width: 480px;
		margin: 80px auto;
		padding: 0 24px;
	}

	.index-page h1 {
		font-size: 24px;
		font-weight: 700;
		margin: 0 0 32px;
		color: #111;
	}

	.index-page ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.index-page li a {
		display: block;
		padding: 14px 20px;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		text-decoration: none;
		color: #111;
		font-size: 16px;
		font-weight: 500;
		transition: background 0.1s;
	}

	.index-page li a:hover {
		background: #f5f5f5;
	}

	/* Demo page */
	.demo-page {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	header {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 12px 20px;
		border-bottom: 1px solid #e0e0e0;
		background: #fff;
	}

	header button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: #555;
		font: inherit;
		font-size: 14px;
	}

	header button:hover {
		color: #111;
	}

	header span {
		font-size: 15px;
		font-weight: 600;
		color: #111;
	}

	.demo-content {
		flex: 1;
		overflow: hidden;
	}
</style>
