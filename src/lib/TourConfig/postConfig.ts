// This function sends the updated tour configuration to the server to be saved.
export async function saveTourConfig(newConfig) {
  try {
    const response = await fetch("/api/tour", {
      method: "POST", // Specifies the request method
      headers: {
        "Content-Type": "application/json", // Tells the server we're sending JSON
      },
      body: JSON.stringify(newConfig), // The new configuration object, converted to a JSON string
    });

    if (!response.ok) {
      throw new Error("Failed to save tour configuration.");
    }

    const result = await response.json();
    console.log(result.message); // Should log "Configuration saved successfully."
  } catch (error) {
    console.error(error);
  }
}
