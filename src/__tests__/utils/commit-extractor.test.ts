import { extractCommit } from '../../utils/commit-extractor';

describe('extractCommit', () => {
  it('should extract commit from semver build metadata format', () => {
    expect(extractCommit('v1.2.3+abc1234')).toBe('abc1234');
    expect(extractCommit('1.2.3+def5678')).toBe('def5678');
    expect(extractCommit('v1.2.3-alpha.1+abc1234')).toBe('abc1234');
  });

  it('should extract commit from hyphen suffix format', () => {
    expect(extractCommit('v1.2.3-abc1234')).toBe('abc1234');
    expect(extractCommit('1.2.3-def5678')).toBe('def5678');
    expect(extractCommit('v1.2.3-alpha-abc1234')).toBe('abc1234');
  });

  it('should extract commit from end of string when both formats present', () => {
    // When both formats are present, extracts the one at the end
    expect(extractCommit('v1.2.3+abc1234-def5678')).toBe('def5678');
  });

  it('should return empty string if no commit found', () => {
    expect(extractCommit('v1.2.3')).toBe('');
    expect(extractCommit('1.2.3-alpha.1')).toBe('');
  });

  it('should return 7-character SHA', () => {
    expect(extractCommit('v1.2.3+abcdef0123456789')).toBe('abcdef0');
    expect(extractCommit('v1.2.3-1234567')).toBe('1234567');
  });
});

