import axios from "axios";

export async function getSinglePostComment(postId:string) {
   const token = localStorage.getItem('tkn');
    const url = `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments`;
    const headers = { AUTHORIZATION: `Bearer ${token}` };
    const {data} = await axios.get(`${url}?page=1&limit=10`, { headers });
    const pages = data?.meta?.pagination?.numberOfPages ?? 1;
    for (let page = 2; page <= pages; page++) {
      const next = await axios.get(`${url}?page=${page}&limit=10`, { headers });
      data.data.comments.push(...(next.data?.data?.comments ?? []));
    }
    return data
}
