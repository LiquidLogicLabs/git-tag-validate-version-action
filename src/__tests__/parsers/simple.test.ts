import { SimpleParser } from '../../parsers/simple';

describe('SimpleParser', () => {
  const parser = new SimpleParser();

  describe('canParse', () => {
    it('should parse valid simple version tags', () => {
      expect(parser.canParse('1.2')).toBe(true);
      expect(parser.canParse('1.2.3')).toBe(true);
      expect(parser.canParse('1.2.3.4')).toBe(true);
      expect(parser.canParse('v1.2')).toBe(true);
      expect(parser.canParse('v1.2.3')).toBe(true);
      expect(parser.canParse('0.0')).toBe(true);
      expect(parser.canParse('999.999.999.999')).toBe(true);
    });

    it('should not parse invalid simple version tags', () => {
      expect(parser.canParse('abc')).toBe(false);
      expect(parser.canParse('1.2.3.4.5')).toBe(false);
      expect(parser.canParse('v')).toBe(false);
      expect(parser.canParse('1.')).toBe(false);
      expect(parser.canParse('v1.2.3-alpha')).toBe(false);
    });
  });

  describe('parse', () => {
    it('should parse two-component versions', () => {
      const result = parser.parse('1.2');
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('1.2'); // Reconstructed from components
      expect(result.info.major).toBe('1');
      expect(result.info.minor).toBe('2');
      expect(result.info.patch).toBe('');
    });

    it('should parse three-component versions', () => {
      const result = parser.parse('1.2.3');
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('1.2.3'); // Reconstructed from components
      expect(result.info.major).toBe('1');
      expect(result.info.minor).toBe('2');
      expect(result.info.patch).toBe('3');
    });

    it('should parse four-component versions', () => {
      const result = parser.parse('1.2.3.4');
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('1.2.3.4'); // Reconstructed with 4th part
      expect(result.info.major).toBe('1');
      expect(result.info.minor).toBe('2');
      expect(result.info.patch).toBe('3');
    });

    it('should parse versions with v prefix', () => {
      const result = parser.parse('v1.2.3');
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('1.2.3'); // Reconstructed without 'v' prefix
      expect(result.info.major).toBe('1');
      expect(result.info.minor).toBe('2');
      expect(result.info.patch).toBe('3');
    });

    it('should handle edge cases', () => {
      const result1 = parser.parse('0.0');
      expect(result1.isValid).toBe(true);
      expect(result1.version).toBe('0.0'); // Reconstructed
      expect(result1.info.major).toBe('0');
      expect(result1.info.minor).toBe('0');

      const result2 = parser.parse('v0.1');
      expect(result2.isValid).toBe(true);
      expect(result2.version).toBe('0.1'); // Reconstructed without 'v'
      expect(result2.info.major).toBe('0');
      expect(result2.info.minor).toBe('1');
    });

    it('should fail on invalid tags', () => {
      const result = parser.parse('invalid');
      expect(result.isValid).toBe(false);
      expect(result.version).toBe('invalid'); // Failed parse returns original tag
    });
  });

  describe('Version Reconstruction', () => {
    it('should reconstruct version without v prefix', () => {
      const result = parser.parse('v1.2');
      expect(result.version).toBe('1.2');
    });

    it('should reconstruct 3-part version', () => {
      const result = parser.parse('v1.2.3');
      expect(result.version).toBe('1.2.3');
    });

    it('should reconstruct 4-part version', () => {
      const result = parser.parse('v1.2.3.4');
      expect(result.version).toBe('1.2.3.4');
    });
  });
});

