# Git Tag Validate Version Action

[![CI](https://github.com/LiquidLogicLabs/actions/git-tag-validate-version-action/actions/workflows/ci.yml/badge.svg)](https://github.com/LiquidLogicLabs/actions/git-tag-validate-version-action/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)

A GitHub Action that validates and parses git tags into structured version information. Supports multiple version formats including semver, simple versioning, Docker tags, calendar versioning, and date-based formats.

## Features

- **Multiple Format Support**: Automatically detects and parses semver, simple, Docker, calver, and date-based version formats
- **Auto-Detection**: Automatically determines the version format type, or specify it explicitly
- **Comprehensive Outputs**: Extracts major, minor, patch, prerelease, build metadata, and commit SHA
- **Flexible Tag Input**: Use a specific tag or automatically use the most recent tag
- **Verbose Logging**: Optional debug logging for troubleshooting
- **Extensible Architecture**: Easy to add new version format parsers

## Usage

### Basic Usage (Auto-detect format)

```yaml
- name: Parse version from most recent tag
  uses: LiquidLogicLabs/actions/git-tag-validate-version-action@v1
  id: version
```

### Specify a Tag

```yaml
- name: Parse specific tag
  uses: LiquidLogicLabs/actions/git-tag-validate-version-action@v1
  with:
    tag: 'v1.2.3'
  id: version
```

### Specify Version Type

```yaml
- name: Parse as semver
  uses: LiquidLogicLabs/actions/git-tag-validate-version-action@v1
  with:
    tag: 'v1.2.3-alpha.1'
    versionType: 'semver'
  id: version
```

### With Verbose Logging

```yaml
- name: Parse version with debug logging
  uses: LiquidLogicLabs/actions/git-tag-validate-version-action@v1
  with:
    tag: 'v1.2.3'
    verbose: 'true'
  id: version
```

### Use Outputs

```yaml
- name: Parse version
  uses: LiquidLogicLabs/actions/git-tag-validate-version-action@v1
  id: version

- name: Use parsed version
  run: |
    echo "Version: ${{ steps.version.outputs.version }}"
    echo "Major: ${{ steps.version.outputs.major }}"
    echo "Minor: ${{ steps.version.outputs.minor }}"
    echo "Patch: ${{ steps.version.outputs.patch }}"
    if [ "${{ steps.version.outputs.isValid }}" == "true" ]; then
      echo "Version is valid!"
    fi
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `tag` | Specific tag to parse. If empty, uses most recent tag | No | `''` |
| `versionType` | Version format type (`auto`, `semver`, `simple`, `docker`, `calver`, `date-based`) | No | `auto` |
| `verbose` | Enable debug logging | No | `false` |

## Outputs

| Output | Description |
|--------|-------------|
| `isValid` | Boolean indicating if version was successfully validated and parsed |
| `version` | Full version string (even if parsing failed) |
| `format` | Detected version format type (semver, simple, docker, calver, date-based, or empty if invalid) |
| `major` | Major version number (if available) |
| `minor` | Minor version number (if available) |
| `patch` | Patch version number (if available) |
| `prerelease` | Prerelease identifier (if available) |
| `build` | Build metadata (if available) |
| `commit` | Short commit SHA extracted from tag (if found in + or - format) |
| `year` | Year component (for calver and date-based formats only) |
| `month` | Month component (for calver and date-based formats only) |
| `day` | Day component (for calver and date-based formats only) |
| `hasPrerelease` | Boolean indicating if semver version has prerelease identifier |
| `hasBuild` | Boolean indicating if semver version has build metadata |

## Supported Version Formats

### Semver

- `v1.2.3`
- `1.2.3`
- `v1.2.3-alpha.1`
- `1.2.3-beta.2`
- `v1.2.3+build.1`
- `1.2.3+20240115`
- `v1.2.3-alpha.1+build.1`

### Simple Versioning

- `1.2`
- `1.2.3`
- `1.2.3.4`
- `v1.2`
- `v1.2.3`

### Docker Tags

- `latest`
- `stable`
- `1.2.3`
- `v1.2.3`
- `1.2.3-alpine`
- `v1.2.3-ubuntu`
- `1.2.3-alpine-3.18`

### Calendar Versioning (Calver)

- `2024.01.15`
- `24.01.15`
- `2024.1.15`
- `2024.01.1`

### Date-Based

- `20240115` (YYYYMMDD)
- `2024-01-15` (YYYY-MM-DD)
- `2024/01/15` (YYYY/MM/DD)

## Commit SHA Extraction

The action can extract commit SHA from tags in two formats:

1. **Semver build metadata**: `v1.2.3+abc1234` → extracts `abc1234`
2. **Hyphen suffix**: `v1.2.3-abc1234` → extracts `abc1234`

The commit SHA is returned as a 7-character short SHA.

## Examples

### Complete Workflow Example

```yaml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  parse-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Parse version
        uses: LiquidLogicLabs/actions/git-tag-validate-version-action@v1
        id: version

      - name: Create release
        run: |
          echo "Creating release for version ${{ steps.version.outputs.version }}"
          echo "Major: ${{ steps.version.outputs.major }}"
          echo "Minor: ${{ steps.version.outputs.minor }}"
          echo "Patch: ${{ steps.version.outputs.patch }}"
```

### Using with Docker

```yaml
- name: Parse Docker tag
  uses: LiquidLogicLabs/actions/git-tag-validate-version-action@v1
  with:
    tag: '1.2.3-alpine'
    versionType: 'docker'
  id: version
```

### Using with Calendar Versioning

```yaml
- name: Parse calver tag
  uses: LiquidLogicLabs/actions/git-tag-validate-version-action@v1
  with:
    tag: '2024.01.15'
    versionType: 'calver'
  id: version
```

## Error Handling

- **Tag not found**: Sets `isValid=false`, `version=""`, all other outputs empty
- **No tags exist**: Sets `isValid=false`, `version=""`, all other outputs empty
- **Parse failure**: Sets `isValid=false`, preserves original `version` string, sets numeric outputs to empty strings
- **Invalid versionType**: Falls back to `auto` detection

## Security

This action only reads git tags from the local repository. It does not:
- Make any network requests
- Access any external APIs
- Modify the repository
- Access any secrets or sensitive data

## License

MIT

## Credits

Developed by [LiquidLogicLabs](https://github.com/LiquidLogicLabs)

