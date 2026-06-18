// react-app/src/api/profile.api.js

const API_BASE = import.meta.env.VITE_API_URL;

export async function updateProfile(payload) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/api/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to update profile");
  }

  return res.json();
}
