/**
 * Creates a function that generates numbers in increments of `n`,
 * starting from a rounded base value.
 *
 * Each call returns the next multiple of `n`.
 *
 * @function createNextNumberGenerator
 * @param {Object} options
 * @param {number} [options.initialValue=6] - Starting value before rounding
 * @param {number} options.n - Step size / rounding interval
 * @returns {Function} A function that returns the next generated number
 */
export function createNextNumberGenerator({initialValue=6, n=10}) {
    let currentValue = initialValue;
    return function () {
        // advances to the next multiple of n
        const nextNumber = ((Math.floor(currentValue / n)) * n) + n;
        currentValue += n;
        return nextNumber;
    }
}