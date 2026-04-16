export const DurationFormatStyle = Object.freeze({
    LONG: 'long',
    SHORT: 'short',
    NARROW: 'narrow',
});


export const formatDuration = (totalMinutes, style = DurationFormatStyle.LONG) => new Intl.DurationFormat('en', { style })
.format(convertMinutesToDuration(totalMinutes));
/**
 * Converts total minutes to a formatted duration string.
 * @param {number} totalMinutes - Total minutes to convert.
 * @param {string} style - One of DurationFormat.LONG, SHORT, or NARROW.
 * @returns {string} Formatted duration.
 */
function convertMinutesToDuration(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
}