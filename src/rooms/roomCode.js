export function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}
