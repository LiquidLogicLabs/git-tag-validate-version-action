import { CalverParser } from '../../parsers/calver';

describe('CalverParser', () => {
  const parser = new CalverParser();

  describe('canParse', () => {
    it('should parse valid calver tags', () => {
      expect(parser.canParse('2024.01.15')).toBe(true);
      expect(parser.canParse('24.01.15')).toBe(true);
      expect(parser.canParse('2024.1.15')).toBe(true);
      expect(parser.canParse('2024.01.1')).toBe(true);
      expect(parser.canParse('2024.12.31')).toBe(true);
    });

    it('should not parse invalid dates', () => {
      expect(parser.canParse('2024.13.15')).toBe(false); // Invalid month
      expect(parser.canParse('2024.01.32')).toBe(false); // Invalid day
      expect(parser.canParse('2024.0.15')).toBe(false); // Invalid month
      expect(parser.canParse('1999.01.15')).toBe(false); // Year before 2000
      expect(parser.canParse('2100.01.15')).toBe(false); // Year after 2099
    });

    it('should not parse non-date formats', () => {
      expect(parser.canParse('abc.01.15')).toBe(false);
      expect(parser.canParse('2024-01-15')).toBe(false);
      expect(parser.canParse('20240115')).toBe(false);
    });
  });

  describe('parse', () => {
    it('should parse full year format', () => {
      const result = parser.parse('2024.01.15');
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('2024.01.15');
      expect(result.info.major).toBe('2024');
      expect(result.info.minor).toBe('01');
      expect(result.info.patch).toBe('15');
    });

    it('should parse 2-digit year format', () => {
      const result = parser.parse('24.01.15');
      expect(result.isValid).toBe(true);
      expect(result.info.major).toBe('2024');
      expect(result.info.minor).toBe('01');
      expect(result.info.patch).toBe('15');
    });

    it('should parse without leading zeros', () => {
      const result = parser.parse('2024.1.15');
      expect(result.isValid).toBe(true);
      expect(result.info.major).toBe('2024');
      expect(result.info.minor).toBe('1');
      expect(result.info.patch).toBe('15');
    });

    it('should handle edge cases', () => {
      const result1 = parser.parse('2000.01.01');
      expect(result1.isValid).toBe(true);
      expect(result1.info.major).toBe('2000');

      const result2 = parser.parse('2099.12.31');
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

