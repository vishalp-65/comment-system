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

    // Define time units in seconds
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInWeek = 604800;
    const secondsInMonth = 2592000; // Rough approximation (30 days)
    const secondsInYear = 31536000; // Rough approximation (365 days)

    // Calculate the differences in various units
    const years = Math.floor(diffInSeconds / secondsInYear);
    const months = Math.floor(diffInSeconds / secondsInMonth);
    const weeks = Math.floor(diffInSeconds / secondsInWeek);
    const days = Math.floor(diffInSeconds / secondsInDay);
    const hours = Math.floor(diffInSeconds / secondsInHour);
    const minutes = Math.floor(diffInSeconds / secondsInMinute);

    // Return the most appropriate relative time string
    if (years > 0) return `${years} year${years > 1 ? "s" : ""}`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""}`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""}`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;

    return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""}`;
};
