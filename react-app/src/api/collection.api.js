

// react-app/src/api/collection.api.js

import { API } from "../config/api";

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  throw new Error("❌ VITE_API_URL is not defined");
}

/* =========================================
   Helper: Get Auth Headers
========================================= */
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

/* =========================================
   ADD TO COLLECTION
   Only send game_id (provider_id)
========================================= */
export async function addToCollectionDB(game) {
  const res = await fetch(API.COLLECTION, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      game_id: game.provider_id || game.id
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to add to collection");
  }

  return data;
}

/* =========================================
   FETCH MY COLLECTION
   Returns FULL game objects (via JOIN)
========================================= */
export async function fetchMyCollection() {
  const res = await fetch(API.COLLECTION, {
    method: "GET",
    headers: getAuthHeaders()
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to load collection");
  }

  // Backend should return:
  // { success: true, data: [ full game objects ] }

  return data.data || [];
}

/* =========================================
   REMOVE FROM COLLECTION
========================================= */
export async function removeFromCollectionDB(gameId) {
  const res = await fetch(`${API_BASE}/api/collection/${gameId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to remove from collection");
  }

  return data;
}