import { BaseParser } from './base';

/**
 * Parser for Docker tag formats
 * Supports: latest, stable, 1.2.3, v1.2.3, 1.2.3-alpine, v1.2.3-ubuntu, 1.2.3-alpine-3.18
 */
export class DockerParser extends BaseParser {
  // Special tags that don't have numeric components
  private readonly specialTags = ['latest', 'stable', 'dev', 'test', 'prod', 'production', 'staging'];

  // Docker tag pattern: optional 'v' prefix, version numbers, optional suffixes with hyphens
  private readonly dockerVersionPattern = /^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-([\w.-]+))?$/i;

  canParse(tag: string): boolean {
    // Accept special tags or version-like tags
    return this.specialTags.includes(tag.toLowerCase()) || this.dockerVersionPattern.test(tag);
  }

  parse(tag: string) {
    const lowerTag = tag.toLowerCase();

    // Handle special tags
    if (this.specialTags.includes(lowerTag)) {
      return this.createSuccessResult(tag, {
        major: '',
        minor: '',
        patch: '',
        prerelease: '',
        build: '',
      });
    }

    // Try to parse as version
    const match = tag.match(this.dockerVersionPattern);
    if (!match) {
      return this.createFailedResult(tag);
    }

    const [, major, minor = '', patch = '', suffix = ''] = match;

    return this.createSuccessResult(tag, {
      major,
      minor,
      patch,
      prerelease: suffix,
      build: '',
    });
  }
}

