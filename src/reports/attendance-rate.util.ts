export function calculateAttendanceRate(
  presentDays: number,
  totalDays: number,
): number {
  if (totalDays === 0) return 0;
  return Math.round((presentDays / totalDays) * 100);
}
