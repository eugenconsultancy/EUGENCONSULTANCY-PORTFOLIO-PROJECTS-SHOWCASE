"use client";

import { CommentItem } from "./CommentItem";

type CommentData = {
  id: number;
  name: string;
  content: string;
  createdAt: Date;
  replies?: CommentData[];
};

type Props = {
  comments: CommentData[];
  projectId: number;
  num1: number;
  num2: number;
  token: string;
};

export function CommentTree({ comments, projectId, num1, num2, token }: Props) {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          projectId={projectId}
          num1={num1}
          num2={num2}
          token={token}
        />
      ))}
    </div>
  );
}
