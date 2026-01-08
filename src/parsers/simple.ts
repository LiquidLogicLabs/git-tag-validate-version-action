import { BaseParser } from './base';
import { VersionInfo } from '../types';

/**
 * Parser for simple versioning format
 * Supports: 1.2, 1.2.3, 1.2.3.4, v1.2, v1.2.3
 */
export class SimpleParser extends BaseParser {
  // Simple version pattern: optional 'v' prefix, 2-4 numeric components separated by dots
  private readonly simplePattern = /^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:\.(\d+))?$/;

  canParse(tag: string): boolean {
    return this.simplePattern.test(tag);
  }

  parse(tag: string) {
    const match = tag.match(this.simplePattern);
    if (!match) {
      return this.createFailedResult(tag);
    }

    const [, major, minor = '', patch = '', fourth = ''] = match;
    
    // Store 4th part in build field if present (since VersionInfo doesn't have a 4th field)
    // We'll reconstruct from original tag if 4 parts exist
    const hasFourthPart = fourth !== '';

    return this.createSuccessResult(tag, {
      major,
      minor,
      patch,
      prerelease: '',
      build: hasFourthPart ? fourth : '', // Temporarily store 4th part here
    });
  }

  protected reconstructVersion(info: VersionInfo, originalTag: string): string {
    // Build version from non-empty components (2-4 parts)
    const parts: string[] = [info.major];
    if (info.minor) parts.push(info.minor);
    if (info.patch) parts.push(info.patch);
    // If build field contains a 4th part (numeric), add it
    if (info.build && /^\d+$/.test(info.build)) {
      parts.push(info.build);
    }
    return parts.join('.');
  }
}

