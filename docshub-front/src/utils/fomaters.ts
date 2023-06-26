export const formatFileSize = (size: number): string => {
    const kiloByte = 1024;
    const megaByte = kiloByte * 1024;
    const gigaByte = megaByte * 1024;

    if (size >= gigaByte) {
        return `${(size / gigaByte).toFixed(2)} GB`;
    } else if (size >= megaByte) {
        return `${(size / megaByte).toFixed(2)} MB`;
    } else if (size >= kiloByte) {
        return `${(size / kiloByte).toFixed(2)} KB`;
    } else {
        return `${size} bytes`;
    }
}


export const formatDateTime = (dateTime: string): string => {
    const dateObj = new Date(dateTime);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear();

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${day} ${month} ${year}`;
}
