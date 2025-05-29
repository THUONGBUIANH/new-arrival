import { formatDate } from '@/lib/date';

describe('formatDate', () => {
  it('should format a valid date string correctly', () => {
    const result = formatDate('2023-12-25');
    expect(result).toBe('25/12/2023');
  });

  it('should format a valid timestamp correctly', () => {
    const timestamp = new Date('2023-06-15').getTime();
    const result = formatDate(timestamp);
    expect(result).toBe('15/06/2023');
  });

  it('should handle single digit days and months with padding', () => {
    const result = formatDate('2023-01-05');
    expect(result).toBe('05/01/2023');
  });

  it('should return "Invalid Date" for invalid date strings', () => {
    const result = formatDate('invalid-date');
    expect(result).toBe('Invalid Date');
  });

  it('should return "Invalid Date" for NaN input', () => {
    const result = formatDate(NaN);
    expect(result).toBe('Invalid Date');
  });

  it('should handle edge case dates', () => {
    const result = formatDate('1970-01-01');
    expect(result).toBe('01/01/1970');
  });

  it('should handle future dates', () => {
    const result = formatDate('2030-12-31');
    expect(result).toBe('31/12/2030');
  });
}); 