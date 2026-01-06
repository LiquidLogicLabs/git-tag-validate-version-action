import { DockerParser } from '../../parsers/docker';

describe('DockerParser', () => {
  const parser = new DockerParser();

  describe('canParse', () => {
    it('should parse special Docker tags', () => {
      expect(parser.canParse('latest')).toBe(true);
      expect(parser.canParse('stable')).toBe(true);
      expect(parser.canParse('dev')).toBe(true);
      expect(parser.canParse('test')).toBe(true);
      expect(parser.canParse('prod')).toBe(true);
      expect(parser.canParse('production')).toBe(true);
      expect(parser.canParse('staging')).toBe(true);
    });

    it('should parse version-like Docker tags', () => {
      expect(parser.canParse('1.2.3')).toBe(true);
      expect(parser.canParse('v1.2.3')).toBe(true);
      expect(parser.canParse('1.2.3-alpine')).toBe(true);
      expect(parser.canParse('v1.2.3-ubuntu')).toBe(true);
      expect(parser.canParse('1.2.3-alpine-3.18')).toBe(true);
    });

    it('should not parse invalid tags', () => {
      expect(parser.canParse('')).toBe(false);
      expect(parser.canParse('-')).toBe(false);
    });
  });

  describe('parse', () => {
    it('should parse special tags without numeric components', () => {
      const result = parser.parse('latest');
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('latest');
      expect(result.info.major).toBe('');
      expect(result.info.minor).toBe('');
      expect(result.info.patch).toBe('');
      expect(result.info.prerelease).toBe('');
      expect(result.info.build).toBe('');
    });

    it('should parse version tags', () => {
      const result = parser.parse('1.2.3');
      expect(result.isValid).toBe(true);
      expect(result.info.major).toBe('1');
      expect(result.info.minor).toBe('2');
      expect(result.info.patch).toBe('3');
    });

    it('should parse version tags with v prefix', () => {
      const result = parser.parse('v1.2.3');
      expect(result.isValid).toBe(true);
      expect(result.info.major).toBe('1');
      expect(result.info.minor).toBe('2');
      expect(result.info.patch).toBe('3');
    });

    it('should parse tags with suffix', () => {
      const result = parser.parse('1.2.3-alpine');
      expect(result.isValid).toBe(true);
      expect(result.info.major).toBe('1');
      expect(result.info.minor).toBe('2');
      expect(result.info.patch).toBe('3');
      expect(result.info.prerelease).toBe('alpine');
    });

    it('should parse tags with multiple suffixes', () => {
      const result = parser.parse('1.2.3-alpine-3.18');
      expect(result.isValid).toBe(true);
      expect(result.info.major).toBe('1');
      expect(result.info.minor).toBe('2');
      expect(result.info.patch).toBe('3');
      expect(result.info.prerelease).toBe('alpine-3.18');
    });

    it('should handle case-insensitive special tags', () => {
      const result1 = parser.parse('LATEST');
      expect(result1.isValid).toBe(true);
      expect(result1.info.major).toBe('');

      const result2 = parser.parse('Stable');
      expect(result2.isValid).toBe(true);
      expect(result2.info.major).toBe('');
    });

    it('should fail on invalid tags', () => {
      const result = parser.parse('invalid-tag-format');
      expect(result.isValid).toBe(false);
      expect(result.version).toBe('invalid-tag-format');
    });
  });
});

