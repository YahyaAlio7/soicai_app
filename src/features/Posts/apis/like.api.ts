import axios from "axios";

async function toggle(path: string) {
  const token = localStorage.getItem("tkn");
  const { data } = await axios.put(`${import.meta.env.VITE_BASE_URL}${path}`, {}, {
    headers: { AUTHORIZATION: `Bearer ${token}` },
  });
  return data;
}

export function togglePostLike(postId: string) {
  return toggle(`/posts/${postId}/like`);
}

export function toggleBookmark(postId: string) {
  return toggle(`/posts/${postId}/bookmark`);
}

export async function sharePost(postId: string) {
  const token = localStorage.getItem("tkn");
  const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/posts/${postId}/share`, {}, {
    headers: { AUTHORIZATION: `Bearer ${token}` },
  });
  return data;
}
