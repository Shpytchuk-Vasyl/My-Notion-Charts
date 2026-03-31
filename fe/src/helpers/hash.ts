export const generateHashForObject = async (obj: unknown): Promise<string> => {
  if (!crypto.subtle) return Date.now().toString(); // Fallback for environments without crypto.subtle

  return crypto.subtle
    .digest("SHA-1", new TextEncoder().encode(JSON.stringify(obj)))
    .then((hashBuffer) =>
      new Uint8Array(hashBuffer)
        .map((b: any) => b.toString(16).padStart(2, "0"))
        .join(""),
    );
};
