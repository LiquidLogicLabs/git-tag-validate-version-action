import { getMostRecentTag, getTag, tagExists } from '../git';

// Mock child_process.exec
jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

// Mock util.promisify to return a function that returns a promise
jest.mock('util', () => ({
  promisify: jest.fn((fn) => {
    return jest.fn((command: string, options?: any) => {
      return new Promise((resolve, reject) => {
        const mockExec = require('child_process').exec;
        mockExec(command, options, (error: any, stdout: string, stderr: string) => {
          if (error) {
            reject(error);
          } else {
            resolve({ stdout, stderr });
          }
        });
      });
    });
  }),
}));

const { exec } = require('child_process');
const mockedExec = exec as jest.MockedFunction<typeof exec>;

describe('git', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMostRecentTag', () => {
    it('should return most recent tag when tags exist', async () => {
      mockedExec.mockImplementation((command: string, options: any, callback: any) => {
        if (callback) {
          callback(null, 'v1.2.3\n', '');
        }
        return {} as any;
      });

      const tag = await getMostRecentTag();
      expect(tag).toBe('v1.2.3');
    });

    it('should return null when no tags exist', async () => {
      mockedExec.mockImplementation((command: string, options: any, callback: any) => {
        if (callback) {
          const error = new Error('No tags found') as any;
          error.code = 128;
          callback(error, '', 'fatal: No names found');
        }
        return {} as any;
      });

      const tag = await getMostRecentTag();
      expect(tag).toBeNull();
    });

    it('should return null on other errors', async () => {
      mockedExec.mockImplementation((command: string, options: any, callback: any) => {
        if (callback) {
          callback(new Error('Git error'), '', 'error');
        }
        return {} as any;
      });

      const tag = await getMostRecentTag();
      expect(tag).toBeNull();
    });

    it('should trim whitespace from tag', async () => {
      mockedExec.mockImplementation((command: string, options: any, callback: any) => {
        if (callback) {
          callback(null, '  v1.2.3  \n', '');
        }
        return {} as any;
      });

      const tag = await getMostRecentTag();
      expect(tag).toBe('v1.2.3');
    });
  });

  describe('tagExists', () => {
    it('should return true when tag exists', async () => {
      mockedExec.mockImplementation((command: string, options: any, callback: any) => {
        if (callback) {
          callback(null, 'v1.2.3', '');
        }
        return {} as any;
      });

      const exists = await tagExists('v1.2.3');
      expect(exists).toBe(true);
    });

    it('should return false when tag does not exist', async () => {
      mockedExec.mockImplementation((command: string, options: any, callback: any) => {
        if (callback) {
          const error = new Error('Tag not found') as any;
          error.code = 128;
          callback(error, '', 'fatal: ambiguous argument');
        }
        return {} as any;
      });

      const exists = await tagExists('nonexistent');
      expect(exists).toBe(false);
    });

    it('should return false for empty tag', async () => {
      const exists = await tagExists('');
      expect(exists).toBe(false);
    });

    it('should return false for whitespace-only tag', async () => {
      const exists = await tagExists('   ');
      expect(exists).toBe(false);
    });
  });

  describe('getTag', () => {
    it('should return tag when it exists', async () => {
      mockedExec.mockImplementation((command: string, options: any, callback: any) => {
        if (callback) {
          callback(null, 'v1.2.3', '');
        }
        return {} as any;
      });

      const tag = await getTag('v1.2.3');
      expect(tag).toBe('v1.2.3');
    });

    it('should return null when tag does not exist', async () => {
      mockedExec.mockImplementation((command: string, options: any, callback: any) => {
        if (callback) {
          const error = new Error('Tag not found') as any;
          error.code = 128;
          callback(error, '', 'fatal: ambiguous argument');
        }
        return {} as any;
      });

      const tag = await getTag('nonexistent');
      expect(tag).toBeNull();
    });

    it('should return null for empty tag', async () => {
      const tag = await getTag('');
      expect(tag).toBeNull();
    });

    it('should trim tag name', async () => {
      mockedExec.mockImplementation((command: string, options: any, callback: any) => {
        if (callback) {
          callback(null, 'v1.2.3', '');
        }
        return {} as any;
      });

      const tag = await getTag('  v1.2.3  ');
      expect(tag).toBe('v1.2.3');
    });
  });
});
