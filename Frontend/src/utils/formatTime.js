export function formatTime(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });
}