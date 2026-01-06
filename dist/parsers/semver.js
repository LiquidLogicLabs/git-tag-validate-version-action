"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemverParser = void 0;
const base_1 = require("./base");
/**
 * Parser for Semantic Versioning (Semver) format
 * Supports: v1.2.3, 1.2.3, v1.2.3-alpha.1, 1.2.3-beta.2, v1.2.3+build.1, 1.2.3+20240115, v1.2.3-alpha.1+build.1
 */
class SemverParser extends base_1.BaseParser {
    // Semver pattern: optional 'v' prefix, major.minor.patch, optional prerelease, optional build metadata
    semverPattern = /^v?(\d+)\.(\d+)\.(\d+)(?:-([\w.-]+))?(?:\+([\w.-]+))?$/i;
    canParse(tag) {
        return this.semverPattern.test(tag);
    }
    parse(tag) {
        const match = tag.match(this.semverPattern);
        if (!match) {
            return this.createFailedResult(tag);
        }
        const [, major, minor, patch, prerelease = '', build = ''] = match;
        return this.createSuccessResult(tag, {
            major,
            minor,
            patch,
            prerelease,
            build,
        });
    }
}
exports.SemverParser = SemverParser;
//# sourceMappingURL=semver.js.map