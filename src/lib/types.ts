export interface ChatMessage {
	/**
	 * The client-generated temporary ID, used when sending a
	 * message, prior to the mediator (chat server) assigning
	 * an authoritative message ID.
	 */
	localId: string

	/**
	 * The authoritative message ID assigned by the mediator
	 * (chat server) after the client sends the message.
	 */
	messageId: string | null

	/**
	 * TODO if we broaden this to include multi-user/group chats then we can reuse this chat component more places
	 */
	sender: 'user' | 'bot'

	/**
	 * The message text itself. May be an empty string initially
	 * for some streaming messages, but will always be present.
	 */
	content: string

	/**
	 * This is true if the client expects to continue receiving
	 * chunks assigned to this message. (Aka the message stream
	 * has not been marked as finished.)
	 */
	streaming: boolean

	/**
	 * The date at which the client sent the message, which
	 * is the initial create date.
	 */
	sentAt: Date

	/**
	 * The date at which the client received notice from the
	 * mediator (chat server) that the message was accepted.
	 */
	serverReceivedAt?: Date

	/**
	 * The date at which the client received notice that the
	 * recipient of the message marked the message as received.
	 */
	deliveredAt?: Date

	/**
	 * The date at which the client received notice that the
	 * recipient of the message marked it as read.
	 */
	readAt?: Date
}

export interface ActivityStatus {
	sender: 'user' | 'bot'
	status: string // e.g., "typing", "thinking", "searching"
	metadata?: Record<string, unknown>
}
