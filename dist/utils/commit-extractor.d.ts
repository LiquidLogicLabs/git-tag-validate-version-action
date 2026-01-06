/**
 * Extract commit SHA from tag name
 * Supports both semver build metadata format (tag+abc1234) and hyphen suffix format (tag-abc1234)
 * Returns short SHA (7 characters) if found
 */
export declare function extractCommit(tag: string): string;
//# sourceMappingURL=commit-extractor.d.ts.map