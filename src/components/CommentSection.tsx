import { db } from "@/lib/db";
import { CommentTree } from "./CommentTree";
import { CommentForm } from "./CommentForm";
import { generateMathChallenge } from "@/lib/spam";

export async function CommentSection({ projectId }: { projectId: number }) {
  const comments = await db.comment.findMany({
    where: { projectId, parentId: null, status: "APPROVED" },
    include: {
      replies: {
        where: { status: "APPROVED" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const { num1, num2, token } = generateMathChallenge();

  const totalComments = comments.length;
  const contributors = new Set(comments.map((c) => c.name)).size;

  return (
    <section className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Discussion</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Join the conversation and share your feedback.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-lg">💬</span>
            <span className="font-semibold">{totalComments}</span> comment{totalComments !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-lg">👥</span>
            <span className="font-semibold">{contributors}</span> contributor{contributors !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Comments */}
      {comments.length > 0 ? (
        <CommentTree
          comments={comments}
          projectId={projectId}
          num1={num1}
          num2={num2}
          token={token}
        />
      ) : (
        <p className="text-center text-gray-500 py-8">No comments yet. Be the first to share your thoughts!</p>
      )}

      {/* Add comment form */}
      <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
        <CommentForm projectId={projectId} num1={num1} num2={num2} token={token} />
      </div>
    </section>
  );
}
