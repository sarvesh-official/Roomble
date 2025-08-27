export interface CreateRoom{
    name: string;
    description?: string;
    isPublic: boolean;
    creatorId: string;
    tagIds?: string[]
}

export interface JoinRoom{
    roomCode: string;
    userId: string;
}