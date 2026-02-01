# SvelteChat

A fully featured chat component to plug and play into your apps.

Currently focused on bot:user comms, but hoping to add support for mult-user/group chat eventually.

A message has four different states, indicated by the following properties:

- `sentAt: Date` - The date at which the client sent the message, aka set this when you make the message.
- `serverReceivedAt?: Date` - The date at which the client received notice from the mediator (chat server) that the message was accepted.
- `deliveredAt?: Date` - The date at which the client received notice that the recipient of the message marked the message as received.
- `readAt?: Date` - The date at which the client received notice that the recipient of the message marked it as read.

It also considers that you might have a locally assigned ID on a message when you send, e.g. if you push RPC-style over WebSockets, but that the mediator/server would assign an authoritative ID shortly after.

```svelte
<script lang="ts">
	import { SvelteChat } from '@saibotsivad/svelte-chat'
	import type { ChatMessage } from '@saibotsivad/svelte-chat'
	function onSend(message: string) {
		// Send the message out.
	}
	function onMessageVisible(message: ChatMessage) {
		// Fires for all visible messages, as you scroll
		// Use to send read-receipts
	}
	let messages = $state<ChatMessage[]>([])
	// Example message
	const msg: ChatMessage = {
		localId: '2', // locally assigned
		messageId: 'abc123def456', // assigned by server
		sender: 'user', // TODO currently user/bot, would like to make this multi-user
		content: 'Thanks! This looks great.',
		sentAt: new Date('2026-02-01T05:11:25.000Z'), // when you create it
		serverReceivedAt: new Date('2026-02-01T05:11:26.000Z'), // the server says it got it
		deliveredAt: new Date('2026-02-01T05:11:28.000Z'), // the bot says it got it
		readAt: new Date('2026-02-01T05:11:35.000Z'), // the bot says it read it
		streaming: false,
	}
	messages.push(msg)
	// "me" is the `sender` name to use as oneself
	const me = 'Myself'
</script>

<SvelteChat bind:messages currentUser="user" {activityStatus} {onSend} {onMessageVisible} />
```
