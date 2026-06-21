export const formatDate = (instant) => {
    if (!instant) return "—";

    const diff = Date.now() - new Date(instant).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1)  return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24)   return `${hours}h ago`;

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    }).format(new Date(instant));
};