export const formatDate = (createdAt: {
    seconds: number;
    nanoseconds: number;
}) => {
    const currentDate = new Date();
    const pastDate = new Date(
        createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
    );

    const diffInSeconds = Math.floor(
        (currentDate.getTime() - pastDate.getTime()) / 1000
    );

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const weeks = Math.floor(diffInSeconds / 604800);
    const months = Math.floor(diffInSeconds / 2592000);
    const years = Math.floor(diffInSeconds / 31536000);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
};
