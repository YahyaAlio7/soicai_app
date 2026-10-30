import axios from "axios";

export type ChangePasswordPayload = { password: string; newPassword: string };

export async function changePassword(payload: ChangePasswordPayload) {
  const token = localStorage.getItem("tkn");
  const { data } = await axios.patch(`${import.meta.env.VITE_BASE_URL}/users/change-password`, payload, {
    headers: { AUTHORIZATION: `Bearer ${token}` },
  });
  return data;
}
