export interface Comment {
    id: string;
    content: string;
    userId: string;
    userName: string;
    fileURL: string;
    userPhoto: string;
    reactions: [];
    createdAt: { seconds: number; nanoseconds: number };
    replies: Comment[];
}
