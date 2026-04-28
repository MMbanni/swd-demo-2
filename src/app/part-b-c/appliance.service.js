"use server";

async function apiFetch(url, options) {
  try {
    const res = await fetch(url, options);
    let result;

    try {
      result = await res.json()
    } catch {
      result = { error: "Invalid JSON response" };
    }

    if (!res.ok) {
      return { ...result, status: res.status };
    }

    return { ...result, status: res.status };

  } catch (e) {
    return {
      errors: e.message || "Server error",
      status: 500
    }
  }
}


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