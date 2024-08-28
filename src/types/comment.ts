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

interface Reaction {
    emoji: string;
    userId: string;
    count: number;
}

export interface CommentCardProps {
    comment: {
        id: string;
        content: string;
        userId: string;
        userName: string;
        fileURL: string;
        userPhoto: string;
        reactions: Reaction[];
        createdAt: { seconds: number; nanoseconds: number };
        replies?: CommentCardProps["comment"][];
    };
    onReply: (commentId: string) => void;
    onReact: (emoji: string, commentId: string, isReply: boolean) => void;
}
