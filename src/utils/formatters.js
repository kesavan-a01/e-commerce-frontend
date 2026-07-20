export const formatPrice = (value) => {
  const num = Number(value) || 0;
  return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getImageUrl = (path) => {
  if (!path) return "/no-image.png";
  if (path.startsWith("http")) return path;
  const base = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
  return `${base}${path}`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
