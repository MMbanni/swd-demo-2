"use server";
import { apiFetch } from "../shared/utils/wrapper";


export async function registerAppliance(data) {
  return apiFetch("http://localhost:3000/api/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}


export async function getInventory() {
  return apiFetch("http://localhost:3000/api/inventory", {
    method: "GET"
  });
}