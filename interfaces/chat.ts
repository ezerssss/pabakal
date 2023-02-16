export interface ChatInterface {
    content: string;
    from: string;
    date: Date;
}

export interface ChatPreviewInterface {
    email: string;
    name: string;
    isSeen: boolean;
    lastMessage: string;
}
