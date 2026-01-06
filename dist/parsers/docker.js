"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerParser = void 0;
const base_1 = require("./base");
/**
 * Parser for Docker tag formats
 * Supports: latest, stable, 1.2.3, v1.2.3, 1.2.3-alpine, v1.2.3-ubuntu, 1.2.3-alpine-3.18
 */
class DockerParser extends base_1.BaseParser {
    // Special tags that don't have numeric components
    specialTags = ['latest', 'stable', 'dev', 'test', 'prod', 'production', 'staging'];
    // Docker tag pattern: optional 'v' prefix, version numbers, optional suffixes with hyphens
    dockerVersionPattern = /^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-([\w.-]+))?$/i;
    canParse(tag) {
        // Accept special tags or version-like tags
        return this.specialTags.includes(tag.toLowerCase()) || this.dockerVersionPattern.test(tag);
    }
    parse(tag) {
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
exports.DockerParser = DockerParser;
//# sourceMappingURL=docker.js.map