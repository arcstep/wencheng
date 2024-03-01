export async function get_agents() {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const response = await fetch(`${base_url}/agents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed: ", error);
    return []
  }
}