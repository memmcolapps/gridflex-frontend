export async function fetchAuthImage(imageUrl: string): Promise<string> {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("Authentication token not found.");

  const response = await fetch(imageUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}