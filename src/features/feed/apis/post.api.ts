import axios from "axios";

export async function getPosts(page = 1) {
   const token = localStorage.getItem('tkn');
    const baseUrl = `${import.meta.env.VITE_BASE_URL}/posts`;
    const headers = { AUTHORIZATION: `Bearer ${token}` };
    const {data} = await axios.get(`${baseUrl}?page=${page}&limit=10`,
        {
            headers,
            timeout: 15000,
        }
    )
    return data
}
