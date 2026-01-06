import { BaseParser } from './base';

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

    const [, major, minor = '', patch = ''] = match;

    return this.createSuccessResult(tag, {
      major,
      minor,
      patch,
      prerelease: '',
      build: '',
    });
  }
}

