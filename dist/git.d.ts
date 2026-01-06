/**
 * Get the most recent tag from the repository
 * Uses `git describe --tags --abbrev=0` to get the most recent tag
 */
export declare function getMostRecentTag(): Promise<string | null>;
/**
 * Check if a tag exists locally
 */
export declare function tagExists(tagName: string): Promise<boolean>;
/**
 * Get a specific tag, validating it exists
 */
export declare function getTag(tagName: string): Promise<string | null>;
