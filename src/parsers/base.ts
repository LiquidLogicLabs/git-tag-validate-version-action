import { ParserResult, VersionInfo } from '../types';

/**
 * Base interface for version parsers
 */
export interface VersionParser {
  /**
   * Parse a tag string into version components
   */
  parse(tag: string): ParserResult;

  /**
   * Check if this parser can handle the given tag format
   * Used for auto-detection
   */
  canParse(tag: string): boolean;
}

/**
 * Base parser class with common functionality
 */
export abstract class BaseParser implements VersionParser {
  abstract parse(tag: string): ParserResult;
  abstract canParse(tag: string): boolean;

  /**
   * Reconstruct a normalized version string from parsed components
   * Must be implemented by each parser to format according to its rules
   */
  protected abstract reconstructVersion(info: VersionInfo, originalTag: string): string;

  /**
   * Create an empty VersionInfo object
   */
  protected createEmptyInfo(): { major: string; minor: string; patch: string; prerelease: string; build: string } {
    return {
      major: '',
      minor: '',
      patch: '',
      prerelease: '',
      build: '',
    };
  }

  /**
   * Create a failed parse result
   */
  protected createFailedResult(tag: string): ParserResult {
    return {
      isValid: false,
      version: tag,
      info: this.createEmptyInfo(),
    };
  }

  /**
   * Create a successful parse result
   * Reconstructs the version string from components to ensure normalized format
   */
  protected createSuccessResult(tag: string, info: { major: string; minor: string; patch: string; prerelease: string; build: string }): ParserResult {
    const reconstructedVersion = this.reconstructVersion(info, tag);
    return {
      isValid: true,
      version: reconstructedVersion,
      info,
    };
  }
}

