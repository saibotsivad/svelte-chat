<!--

This is a demo place to make sure the chat component looks and behaves correctly.

-->
<script lang="ts">
	import { SvelteChat, type ChatMessage } from '$lib/index.js'

	let chat: SvelteChat

	const me = 'You'

	function onLoad(): ChatMessage[] {
		return [
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
			},
			{
				id: '3',
				sender: 'Alice',
				sent: new Date(Date.now() - 60000 * 3),
				message: 'Try sending a message — I\'ll reply automatically.',
			},
		]
	}

	let nextId = 100

	function onSend(message: string) {
		const id = String(nextId++)
		chat.pushMessage({
			id,
			sender: me,
			sent: new Date(),
			message,
		})

		// Simulate a reply
		setTimeout(() => {
			chat.pushMessage({
				id: String(nextId++),
				sender: 'Alice',
				sent: new Date(),
				message: `You said: "${message}"`,
			})
		}, 800)
	}
</script>

<div class="demo-wrapper">
	<SvelteChat
		bind:this={chat}
		currentUser={me}
		{onSend}
		{onLoad}
	/>
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
	}

	.demo-wrapper {
		max-width: 480px;
		height: 100vh;
		margin: 0 auto;
		border-left: 1px solid #e0e0e0;
		border-right: 1px solid #e0e0e0;
	}
</style>
