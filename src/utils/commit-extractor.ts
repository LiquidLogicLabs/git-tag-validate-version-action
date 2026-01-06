/**
 * Extract commit SHA from tag name
 * Supports both semver build metadata format (tag+abc1234) and hyphen suffix format (tag-abc1234)
 * Returns short SHA (7 characters) if found
 */
export function extractCommit(tag: string): string {
  // Try semver build metadata format first: tag+abc1234
  const semverBuildMatch = tag.match(/\+([a-f0-9]{7,})$/i);
  if (semverBuildMatch) {
    return semverBuildMatch[1].substring(0, 7);
  }

  // Try hyphen suffix format: tag-abc1234
  // Look for a hyphen followed by 7+ hex characters at the end
  const hyphenMatch = tag.match(/-([a-f0-9]{7,})$/i);
  if (hyphenMatch) {
    return hyphenMatch[1].substring(0, 7);
  }

  return '';
}

