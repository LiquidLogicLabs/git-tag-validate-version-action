"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleParser = void 0;
const base_1 = require("./base");
/**
 * Parser for simple versioning format
 * Supports: 1.2, 1.2.3, 1.2.3.4, v1.2, v1.2.3
 */
class SimpleParser extends base_1.BaseParser {
    // Simple version pattern: optional 'v' prefix, 2-4 numeric components separated by dots
    simplePattern = /^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:\.(\d+))?$/;
    canParse(tag) {
        return this.simplePattern.test(tag);
    }
    parse(tag) {
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
exports.SimpleParser = SimpleParser;
//# sourceMappingURL=simple.js.map