export interface CreateMessageInput{
    roomId: string;
    senderId: string;
    senderName: string;
    senderProfileUrl?: string;
    content: string;
    replyToId?: string
}