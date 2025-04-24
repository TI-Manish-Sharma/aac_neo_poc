// utils/time-utils.ts

/**
 * Format a Date object to a time string in "hh:mm AM/PM" format
 * @param date Date object to format
 * @returns Formatted time string
 */
export function formatTimeString(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Add leading zeros to minutes if needed
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
}

/**
 * Calculate the time difference between two time strings in "hh:mm AM/PM" format
 * @param start Start time string
 * @param end End time string
 * @returns Time difference in "Xh Ym" format
 */
export function calculateTimeDifference(start: string, end: string): string {
    if (!start || !end) return '0h 0m';

    const toMinutes = (timeStr: string): number => {
        const [timeComponent, meridiem] = timeStr.split(' ');
        let [hours, minutes] = timeComponent.split(':').map(Number);

        // Convert to 24-hour format for calculation
        if (meridiem === 'PM' && hours < 12) {
            hours += 12;
        } else if (meridiem === 'AM' && hours === 12) {
            hours = 0;
        }

        return hours * 60 + minutes;
    };

    // Calculate the difference in minutes
    let diffMinutes = toMinutes(end) - toMinutes(start);

    // Handle cases where the end time is on the next day
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // Add 24 hours in minutes
    }

    // Convert to hours and minutes
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`;
}

/**
 * Parse a time string in "hh:mm AM/PM" format to a Date object
 * @param timeStr Time string to parse
 * @returns Date object representing the time
 */
export function parseTimeString(timeStr: string): Date {
    if (!timeStr) return new Date();

    const [timeComponent, meridiem] = timeStr.split(' ');
    let [hours, minutes] = timeComponent.split(':').map(Number);

    // Convert to 24-hour format
    if (meridiem === 'PM' && hours < 12) {
        hours += 12;
    } else if (meridiem === 'AM' && hours === 12) {
        hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date;
}

/**
 * Validates if a string is in the "hh:mm AM/PM" time format
 * @param timeStr Time string to validate
 * @returns Boolean indicating if the string is a valid time format
 */
export function isValidTimeFormat(timeStr: string): boolean {
    if (!timeStr) return false;

    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    return timeRegex.test(timeStr);
}