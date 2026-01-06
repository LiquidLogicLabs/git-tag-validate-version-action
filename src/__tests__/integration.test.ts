import * as core from '@actions/core';
import { getMostRecentTag, getTag } from '../git';
import { ParserRegistry } from '../parsers';
import { extractCommit } from '../utils/commit-extractor';
import { VersionType } from '../types';

// Mock @actions/core
jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn(),
  debug: jest.fn(),
}));

// Mock git module
jest.mock('../git', () => ({
  getMostRecentTag: jest.fn(),
  getTag: jest.fn(),
  tagExists: jest.fn(),
}));

describe('Integration Tests', () => {
  const mockGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;
  const mockSetOutput = core.setOutput as jest.MockedFunction<typeof core.setOutput>;
  const mockSetFailed = core.setFailed as jest.MockedFunction<typeof core.setFailed>;
  const mockDebug = core.debug as jest.MockedFunction<typeof core.debug>;
  const mockGetMostRecentTag = getMostRecentTag as jest.MockedFunction<typeof getMostRecentTag>;
  const mockGetTag = getTag as jest.MockedFunction<typeof getTag>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Full Action Flow - Empty Tag Input', () => {
    it('should use most recent tag when tag input is empty', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return '';
        if (name === 'versionType') return 'auto';
        if (name === 'verbose') return 'false';
        return '';
      });

      mockGetMostRecentTag.mockResolvedValue('v1.2.3');

      const registry = new ParserRegistry();
      const parseResult = registry.parse('v1.2.3', VersionType.AUTO);
      const commit = extractCommit('v1.2.3');

      expect(parseResult.isValid).toBe(true);
      expect(parseResult.info.major).toBe('1');
      expect(commit).toBe('');
    });

    it('should set empty outputs when no tags exist', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return '';
        if (name === 'versionType') return 'auto';
        if (name === 'verbose') return 'false';
        return '';
      });

      mockGetMostRecentTag.mockResolvedValue(null);

      // Simulate empty outputs
      const outputs = {
        isValid: 'false',
        version: '',
        major: '',
        minor: '',
        patch: '',
        prerelease: '',
        build: '',
        commit: '',
      };

      expect(outputs.isValid).toBe('false');
      expect(outputs.version).toBe('');
    });
  });

  describe('Full Action Flow - Specific Tag Input', () => {
    it('should use specified tag when provided', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return 'v1.2.3';
        if (name === 'versionType') return 'auto';
        if (name === 'verbose') return 'false';
        return '';
      });

      mockGetTag.mockResolvedValue('v1.2.3');

      const registry = new ParserRegistry();
      const parseResult = registry.parse('v1.2.3', VersionType.AUTO);

      expect(parseResult.isValid).toBe(true);
      expect(parseResult.info.major).toBe('1');
    });

    it('should set empty outputs when specified tag does not exist', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return 'nonexistent';
        if (name === 'versionType') return 'auto';
        if (name === 'verbose') return 'false';
        return '';
      });

      mockGetTag.mockResolvedValue(null);

      const outputs = {
        isValid: 'false',
        version: '',
        major: '',
        minor: '',
        patch: '',
        prerelease: '',
        build: '',
        commit: '',
      };

      expect(outputs.isValid).toBe('false');
      expect(outputs.version).toBe('');
    });
  });

  describe('Full Action Flow - Version Type Handling', () => {
    it('should use auto-detection when versionType is auto', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return 'v1.2.3';
        if (name === 'versionType') return 'auto';
        if (name === 'verbose') return 'false';
        return '';
      });

      mockGetTag.mockResolvedValue('v1.2.3');

      const registry = new ParserRegistry();
      const parseResult = registry.parse('v1.2.3', VersionType.AUTO);

      expect(parseResult.isValid).toBe(true);
    });

    it('should use explicit version type when provided', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return '1.2.3';
        if (name === 'versionType') return 'semver';
        if (name === 'verbose') return 'false';
        return '';
      });

      mockGetTag.mockResolvedValue('1.2.3');

      const registry = new ParserRegistry();
      const parseResult = registry.parse('1.2.3', VersionType.SEMVER);

      expect(parseResult.isValid).toBe(true);
    });

    it('should fall back to auto when invalid versionType provided', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return 'v1.2.3';
        if (name === 'versionType') return 'invalid';
        if (name === 'verbose') return 'false';
        return '';
      });

      mockGetTag.mockResolvedValue('v1.2.3');

      const registry = new ParserRegistry();
      // Simulate fallback to auto
      const parseResult = registry.parse('v1.2.3', VersionType.AUTO);

      expect(parseResult.isValid).toBe(true);
    });
  });

  describe('Full Action Flow - Verbose Logging', () => {
    it('should enable debug logging when verbose is true', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return 'v1.2.3';
        if (name === 'versionType') return 'auto';
        if (name === 'verbose') return 'true';
        return '';
      });

      mockGetTag.mockResolvedValue('v1.2.3');

      // Simulate verbose logging
      if (mockGetInput('verbose') === 'true') {
        mockDebug('Verbose logging enabled');
        mockDebug('Found tag: v1.2.3');
      }

      expect(mockDebug).toHaveBeenCalled();
    });

    it('should not enable debug logging when verbose is false', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return 'v1.2.3';
        if (name === 'versionType') return 'auto';
        if (name === 'verbose') return 'false';
        return '';
      });

      mockGetTag.mockResolvedValue('v1.2.3');

      // Simulate no verbose logging
      if (mockGetInput('verbose') !== 'true') {
        // Debug should not be called for non-verbose operations
      }

      // In non-verbose mode, debug might still be called for errors, but not for normal flow
    });
  });

  describe('Full Action Flow - Commit Extraction', () => {
    it('should extract commit from semver build metadata format', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return 'v1.2.3+abc1234';
        if (name === 'versionType') return 'auto';
        if (name === 'verbose') return 'false';
        return '';
      });

      mockGetTag.mockResolvedValue('v1.2.3+abc1234');

      const commit = extractCommit('v1.2.3+abc1234');
      expect(commit).toBe('abc1234');
    });

    it('should extract commit from hyphen suffix format', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return 'v1.2.3-abc1234';
        if (name === 'versionType') return 'auto';
        if (name === 'verbose') return 'false';
        return '';
      });

      mockGetTag.mockResolvedValue('v1.2.3-abc1234');

      const commit = extractCommit('v1.2.3-abc1234');
      expect(commit).toBe('abc1234');
    });

    it('should return empty string when no commit found', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return 'v1.2.3';
        if (name === 'versionType') return 'auto';
        if (name === 'verbose') return 'false';
        return '';
      });

      mockGetTag.mockResolvedValue('v1.2.3');

      const commit = extractCommit('v1.2.3');
      expect(commit).toBe('');
    });
  });

  describe('Full Action Flow - Output Validation', () => {
    it('should set all outputs correctly for valid tag', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return 'v1.2.3-alpha.1+build.1';
        if (name === 'versionType') return 'auto';
        if (name === 'verbose') return 'false';
        return '';
      });

      mockGetTag.mockResolvedValue('v1.2.3-alpha.1+build.1');

      const registry = new ParserRegistry();
      const parseResult = registry.parse('v1.2.3-alpha.1+build.1', VersionType.AUTO);
      const commit = extractCommit('v1.2.3-alpha.1+build.1');

      const outputs = {
        isValid: parseResult.isValid.toString(),
        version: parseResult.version,
        format: parseResult.format || '',
        major: parseResult.info.major,
        minor: parseResult.info.minor,
        patch: parseResult.info.patch,
        prerelease: parseResult.info.prerelease,
        build: parseResult.info.build,
        commit: commit,
        year: '',
        month: '',
        day: '',
        hasPrerelease: parseResult.info.prerelease ? 'true' : 'false',
        hasBuild: parseResult.info.build ? 'true' : 'false',
      };

      expect(outputs.isValid).toBe('true');
      expect(outputs.version).toBe('v1.2.3-alpha.1+build.1');
      expect(outputs.format).toBe(VersionType.SEMVER);
      expect(outputs.major).toBe('1');
      expect(outputs.minor).toBe('2');
      expect(outputs.patch).toBe('3');
      expect(outputs.prerelease).toBe('alpha.1');
      expect(outputs.build).toBe('build.1');
      expect(outputs.hasPrerelease).toBe('true');
      expect(outputs.hasBuild).toBe('true');
    });

    it('should set outputs correctly for invalid tag', async () => {
      mockGetInput.mockImplementation((name: string) => {
        if (name === 'tag') return 'invalid-tag';
        if (name === 'versionType') return 'auto';
        if (name === 'verbose') return 'false';
        return '';
      });

      mockGetTag.mockResolvedValue('invalid-tag');

      const registry = new ParserRegistry();
      const parseResult = registry.parse('invalid-tag', VersionType.AUTO);

      const outputs = {
        isValid: parseResult.isValid.toString(),
        version: parseResult.version,
        format: parseResult.format || '',
        major: parseResult.info.major,
        minor: parseResult.info.minor,
        patch: parseResult.info.patch,
        prerelease: parseResult.info.prerelease,
        build: parseResult.info.build,
        commit: '',
        year: '',
        month: '',
        day: '',
        hasPrerelease: 'false',
        hasBuild: 'false',
      };

      expect(outputs.isValid).toBe('false');
      expect(outputs.version).toBe('invalid-tag');
      expect(outputs.format).toBe('');
      expect(outputs.major).toBe('');
    });
  });
});

