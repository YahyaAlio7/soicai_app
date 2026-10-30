import { useState } from "react";
import { Dropdown, DropdownItem } from "flowbite-react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { Post } from "../interfaces/post.interface";
import { deletePost } from "../features/Posts/apis/delete.post.api";
import { updatePost } from "../features/Posts/apis/update.post.api";

export function DropDownCom({ post }: { post: Post }) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(post.body ?? "");
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => { toast.success("Post deleted"); void queryClient.invalidateQueries({ queryKey: ["posts"] }); },
    onError: () => toast.error("Couldn’t delete post"),
  });
  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      toast.success("Post updated");
      setEditing(false);
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["post", post._id] });
    },
    onError: () => toast.error("Couldn’t update post"),
  });

  function savePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("body", body);
    updateMutation.mutate({ postId: post._id, formData });
  }

  return <>
    <Dropdown inline label={<span className="px-2 text-xl" aria-label="Post options">⋯</span>}>
      <DropdownItem onClick={() => setEditing(true)}><span className="flex items-center"><FaEdit className="mr-2" />Edit post</span></DropdownItem>
      <DropdownItem onClick={() => { if (window.confirm("Delete this post?")) deleteMutation.mutate(post._id); }}><span className="flex items-center"><MdDelete className="mr-2" />Delete</span></DropdownItem>
    </Dropdown>
    {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation">
      <form onSubmit={savePost} className="w-full max-w-lg space-y-4 rounded-xl bg-white p-5 shadow-xl" aria-label="Edit post">
        <h2 className="text-lg font-bold">Edit post</h2>
        <textarea value={body} onChange={(event) => setBody(event.target.value)} className="w-full rounded border p-3" rows={5} aria-label="Post text" />
        <p className="text-sm text-gray-500">This updates the post text. The current image is left unchanged.</p>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setEditing(false)} className="rounded border px-4 py-2">Cancel</button>
          <button type="submit" disabled={updateMutation.isPending} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">{updateMutation.isPending ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </div>}
  </>;
}
