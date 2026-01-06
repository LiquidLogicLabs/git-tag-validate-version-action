import { ParserResult } from '../types';
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
export declare abstract class BaseParser implements VersionParser {
    abstract parse(tag: string): ParserResult;
    abstract canParse(tag: string): boolean;
    /**
     * Create an empty VersionInfo object
     */
    protected createEmptyInfo(): {
        major: string;
        minor: string;
        patch: string;
        prerelease: string;
        build: string;
    };
    /**
     * Create a failed parse result
     */
    protected createFailedResult(tag: string): ParserResult;
    /**
     * Create a successful parse result
     */
    protected createSuccessResult(tag: string, info: {
        major: string;
        minor: string;
        patch: string;
        prerelease: string;
        build: string;
    }): ParserResult;
}
//# sourceMappingURL=base.d.ts.map