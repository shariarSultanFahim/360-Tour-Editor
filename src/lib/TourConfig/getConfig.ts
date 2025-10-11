export async function getTourConfig() {
  try {
    const response = await fetch("/api/tour"); // Sends a GET request
    if (!response.ok) {
      throw new Error("Failed to fetch tour configuration.");
    }
    const config = await response.json();
    console.log("Tour config loaded:", config);
    return config;
  } catch (error) {
    console.error(error);
  }
}
