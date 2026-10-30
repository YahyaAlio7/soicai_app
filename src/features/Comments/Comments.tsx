import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CommentInterface } from "./interfaces/comment.interface";
import { timeAgo } from "../../utilites/timeAgo";
import { getSinglePostComment } from "./apis/comment.api";
import { deleteComment, updateComment } from "./apis/updateComment.api";
import { useAuth } from "../../context/auth.context";

export default function Comments({ id }: { id: string }) {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getSinglePostComment(id),
  });
  if (isLoading) return <Loading />;
  if (isError) {
    toast.error(error.message);
    return <p role="alert" className="p-4 text-red-600">Couldn’t load comments. Please try again.</p>;
  }

  return <div>{(data?.data?.comments ?? []).map((comment: CommentInterface) =>
    <CommentItem comment={comment} key={comment._id} postId={id} />
  )}</div>;
}

function CommentItem({ comment, postId }: { comment: CommentInterface; postId: string }) {
  const user = useAuth()?.user;
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["comments", postId] });
  const editMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => { toast.success("Comment updated"); setEditing(false); void refresh(); },
    onError: () => toast.error("Couldn’t update comment"),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => { toast.success("Comment deleted"); void refresh(); },
    onError: () => toast.error("Couldn’t delete comment"),
  });

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;
    editMutation.mutate({ postId, commentId: comment._id, content: content.trim() });
  }

  return <article className="my-4 rounded-lg bg-gray-800 p-4 shadow">
    <div className="mb-2 flex items-center gap-3">
      <img src={comment.commentCreator.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
      <div>
        <h3 className="font-semibold text-white">{comment.commentCreator.name}</h3>
        <p className="text-sm text-gray-400">{timeAgo(comment.createdAt)} ago</p>
      </div>
      {comment.commentCreator._id === user?._id && <div className="ml-auto flex gap-3 text-sm">
        <button type="button" onClick={() => setEditing((value) => !value)} className="text-blue-300">{editing ? "Cancel" : "Edit"}</button>
        <button type="button" disabled={deleteMutation.isPending} onClick={() => { if (window.confirm("Delete this comment?")) deleteMutation.mutate({ postId, commentId: comment._id }); }} className="text-red-300">Delete</button>
      </div>}
    </div>
    {editing ? <form onSubmit={save} className="flex gap-2">
      <input value={content} onChange={(event) => setContent(event.target.value)} className="min-w-0 flex-1 rounded px-3 py-2 text-gray-900" aria-label="Edit comment" />
      <button disabled={editMutation.isPending} className="rounded bg-blue-600 px-3 text-white">Save</button>
    </form> : <p className="text-white">{comment.content}</p>}
    <p className="mt-2 text-sm text-gray-300">{comment.likes?.length ?? 0} likes</p>
  </article>;
}
