export type CommentWithReplies = {
    id: number;
    name: string;
    content: string;
    createdAt: Date;
    replies: {
        id: number;
        name: string;
        content: string;
        createdAt: Date;
    }[];
};