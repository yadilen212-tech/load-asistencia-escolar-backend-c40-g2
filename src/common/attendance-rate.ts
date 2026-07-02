/**
 * Calculates the attendance rate as a rounded percentage (0-100).
 *
 * @throws {RangeError} if either argument is negative or `presentDays` exceeds `totalDays`.
 */
export function calculateAttendanceRate(presentDays: number, totalDays: number): number {
  if (presentDays < 0 || totalDays < 0) {
    throw new RangeError('presentDays and totalDays must not be negative')
  }

  if (presentDays > totalDays) {
    throw new RangeError('presentDays cannot be greater than totalDays')
  }

  if (totalDays === 0) {
    return 0
  }

  return Math.round((presentDays / totalDays) * 100)
}
