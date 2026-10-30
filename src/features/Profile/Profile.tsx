import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authContext } from "../../context/auth.context";
import { getProfile } from "./profile.api";
import { changePassword } from "../auth/apis/changePassword.api";

export default function Profile() {
  const context = useContext(authContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (response) => {
      const nextToken = response?.data?.token;
      if (nextToken) {
        localStorage.setItem("tkn", nextToken);
        context?.setLogin(nextToken);
      }
      toast.success(response?.message ?? "Password changed successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Couldn’t change password"),
  });

  const setUser = context?.setUser;
  useEffect(() => {
    const profile = profileQuery.data;
    if (profile && setUser) {
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
    }
  }, [profileQuery.data, setUser]);

  if (!context) return null;
  const user = profileQuery.data ?? context.user;

  function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword.length < 8) { toast.error("New password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("New passwords do not match"); return; }
    passwordMutation.mutate({ password: currentPassword, newPassword });
  }

  return <main className="mx-auto my-8 max-w-3xl space-y-6 px-4">
    <section className="rounded-xl bg-white p-6 shadow">
      <h1 className="mb-5 text-2xl font-bold">My profile</h1>
      {profileQuery.isLoading && <p>Loading profile…</p>}
      {profileQuery.isError && <p role="alert" className="mb-4 text-red-600">Couldn’t refresh profile data. Showing saved account details.</p>}
      {user ? <div className="flex flex-col items-center gap-5 sm:flex-row">
        <img src={user.photo} alt={`${user.name}'s profile`} className="h-28 w-28 rounded-full object-cover" />
        <dl className="grid w-full gap-3 sm:grid-cols-2">
          <div><dt className="text-sm text-gray-500">Full name</dt><dd className="font-semibold">{user.name || "—"}</dd></div>
          <div><dt className="text-sm text-gray-500">Username</dt><dd className="font-semibold">{user.username || "—"}</dd></div>
          <div><dt className="text-sm text-gray-500">Email</dt><dd className="font-semibold">{user.email || "—"}</dd></div>
          <div><dt className="text-sm text-gray-500">User ID</dt><dd className="break-all font-semibold">{user._id || "—"}</dd></div>
        </dl>
      </div> : <p>No profile data is available.</p>}
    </section>

    <section className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">Change password</h2>
      <form onSubmit={submitPassword} className="space-y-3">
        <input type="password" required autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Current password" className="w-full rounded border p-3" />
        <input type="password" required autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="New password (at least 8 characters)" className="w-full rounded border p-3" />
        <input type="password" required autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" className="w-full rounded border p-3" />
        <button disabled={passwordMutation.isPending} className="rounded bg-blue-700 px-5 py-2 font-semibold text-white disabled:opacity-50">{passwordMutation.isPending ? "Updating…" : "Update password"}</button>
      </form>
    </section>
  </main>;
}
