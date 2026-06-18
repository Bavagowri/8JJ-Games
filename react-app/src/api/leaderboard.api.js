// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5050";

// export async function fetchLeaderboard(period = "weekly") {
//   const token = localStorage.getItem("token");

//   const res = await fetch(
//     `${API_BASE}/api/leaderboard?period=${period}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch leaderboard");
//   }

//   const data = await res.json();
//   return data.data;
// }

const API_BASE = import.meta.env.VITE_API_URL;
if (!API_BASE) {
  throw new Error("❌ VITE_API_URL is not defined");
}

export async function fetchLeaderboard(period = "weekly", tab = "global") {
  const token = localStorage.getItem("token"); //  FIXED

  if (!token) {
    throw new Error("Authentication required");
  }

  const res = await fetch(
    `${API_BASE}/api/leaderboard?period=${period}&tab=${tab}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error("Leaderboard API error:", errText);
    throw new Error("Failed to fetch leaderboard");
  }

  return res.json();
}
