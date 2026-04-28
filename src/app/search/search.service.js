"use server";

import { apiFetch } from "../shared/utils/wrapper";

export async function searchAppliance(data) {
    console.error(data)
  return apiFetch("http://localhost:3000/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

