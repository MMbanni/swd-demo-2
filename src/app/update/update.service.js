"use server";

import { apiFetch } from "../shared/utils/wrapper";

export async function updateAppliance(data) {
    console.error(data)
  return apiFetch("http://localhost:3000/api/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

