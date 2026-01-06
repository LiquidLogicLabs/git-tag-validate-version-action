import { DateBasedParser } from '../../parsers/date-based';

describe('DateBasedParser', () => {
  const parser = new DateBasedParser();

  describe('canParse', () => {
    it('should parse YYYYMMDD format', () => {
      expect(parser.canParse('20240115')).toBe(true);
      expect(parser.canParse('20241231')).toBe(true);
      expect(parser.canParse('20000101')).toBe(true);
    });

    it('should parse YYYY-MM-DD format', () => {
      expect(parser.canParse('2024-01-15')).toBe(true);
      expect(parser.canParse('2024-12-31')).toBe(true);
    });

    it('should parse YYYY/MM/DD format', () => {
      expect(parser.canParse('2024/01/15')).toBe(true);
      expect(parser.canParse('2024/12/31')).toBe(true);
    });

    it('should not parse invalid dates', () => {
      expect(parser.canParse('20241315')).toBe(false); // Invalid month
      expect(parser.canParse('20240132')).toBe(false); // Invalid day
      expect(parser.canParse('2024-13-15')).toBe(false); // Invalid month
      expect(parser.canParse('2024-01-32')).toBe(false); // Invalid day
      expect(parser.canParse('1999-01-15')).toBe(false); // Year before 2000
      expect(parser.canParse('2100-01-15')).toBe(false); // Year after 2099
    });

    it('should not parse non-date formats', () => {
      expect(parser.canParse('abc')).toBe(false);
      expect(parser.canParse('2024.01.15')).toBe(false);
      expect(parser.canParse('24-01-15')).toBe(false);
    });
  });

  describe('parse', () => {
    it('should parse YYYYMMDD format', () => {
      const result = parser.parse('20240115');
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('20240115');
      expect(result.info.major).toBe('2024');
      expect(result.info.minor).toBe('01');
      expect(result.info.patch).toBe('15');
    });

    it('should parse YYYY-MM-DD format', () => {
      const result = parser.parse('2024-01-15');
      expect(result.isValid).toBe(true);
      expect(result.info.major).toBe('2024');
      expect(result.info.minor).toBe('01');
      expect(result.info.patch).toBe('15');
    });

    it('should parse YYYY/MM/DD format', () => {
      const result = parser.parse('2024/01/15');
      expect(result.isValid).toBe(true);
      expect(result.info.major).toBe('2024');
      expect(result.info.minor).toBe('01');
      expect(result.info.patch).toBe('15');
    });

    it('should handle edge cases', () => {
      const result1 = parser.parse('20000101');
      expect(result1.isValid).toBe(true);
      expect(result1.info.major).toBe('2000');

      const result2 = parser.parse('20991231');
      expect(result2.isValid).toBe(true);
      expect(result2.info.major).toBe('2099');
    });

    it('should fail on invalid tags', () => {
      const result = parser.parse('invalid');
      expect(result.isValid).toBe(false);
      expect(result.version).toBe('invalid');
    });
  });
});

