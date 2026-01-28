# SvelteChat

A fully featured chat component to plug and play into your apps.

```svelte
<script lang="ts">
	import { SvelteChat } from '@saibotsivad/svelte-chat'
	import type { ChatMessage } from '@saibotsivad/svelte-chat'
	function onSend(message: string) {
		// Send the message out.
	}
	let messages = $state<ChatMessage[]>([])
	// Example message
	const msg: ChatMessage = {
		id: '9001',
		sender: 'Myself',
		sent: new Date(),
		message: 'The id is over 9000?',
		status: 'sending',
	}
	messages.push(msg)
	// "me" is the `sender` name to use as oneself
	const me = 'Myself'
</script>

<SvelteChat bind:messages currentUser={me} {onSend} />
```
