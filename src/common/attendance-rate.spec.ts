import { calculateAttendanceRate } from './attendance-rate'

describe('calculateAttendanceRate', () => {
  it('calculates a normal attendance rate', () => {
    expect(calculateAttendanceRate(18, 20)).toBe(90)
  })

  it('returns 0 when totalDays is 0, avoiding division by zero', () => {
    expect(calculateAttendanceRate(0, 0)).toBe(0)
  })

  it('returns 100 when presentDays equals totalDays', () => {
    expect(calculateAttendanceRate(10, 10)).toBe(100)
  })

  it('rounds down a repeating decimal (1/3)', () => {
    expect(calculateAttendanceRate(1, 3)).toBe(33)
  })

  it('rounds up a repeating decimal (2/3)', () => {
    expect(calculateAttendanceRate(2, 3)).toBe(67)
  })

  it('throws RangeError when presentDays is negative', () => {
    expect(() => calculateAttendanceRate(-1, 10)).toThrow(RangeError)
  })

  it('throws RangeError when totalDays is negative', () => {
    expect(() => calculateAttendanceRate(5, -10)).toThrow(RangeError)
  })

  it('throws RangeError when presentDays is greater than totalDays', () => {
    expect(() => calculateAttendanceRate(11, 10)).toThrow(RangeError)
  })
})
