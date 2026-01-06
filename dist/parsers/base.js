"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseParser = void 0;
/**
 * Base parser class with common functionality
 */
class BaseParser {
    /**
     * Create an empty VersionInfo object
     */
    createEmptyInfo() {
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
    createFailedResult(tag) {
        return {
            isValid: false,
            version: tag,
            info: this.createEmptyInfo(),
        };
    }
    /**
     * Create a successful parse result
     */
    createSuccessResult(tag, info) {
        return {
            isValid: true,
            version: tag,
            info,
        };
    }
}
exports.BaseParser = BaseParser;
//# sourceMappingURL=base.js.map