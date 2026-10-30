import axios from "axios";

export async function getProfile() {
  const token = localStorage.getItem("tkn");
  const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile-data`, {
    headers: { AUTHORIZATION: `Bearer ${token}` },
  });
  return data?.data?.user ?? data?.data;
}
