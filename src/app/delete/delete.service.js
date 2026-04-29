"use server";

import { apiFetch } from "../shared/utils/wrapper";

export async function deleteAppliance(data) {
    console.error(data)
  return apiFetch("http://localhost:3000/api/search", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

