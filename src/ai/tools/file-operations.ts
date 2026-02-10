import { ai } from '../genkit';
import { z } from 'genkit';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Tool: saveFile
 * Unrestricted file writer with recursive directory creation.
 */
export const saveFile = ai.defineTool(
  {
    name: 'saveFile',
    description: 'Writes content to a file at any path on the disk.',
    inputSchema: z.object({
      path: z.string().describe('The absolute path or relative path to the file.'),
      content: z.string().describe('The content to write to the file.'),
      encoding: z.enum(['utf-8', 'ascii', 'base64']).optional().default('utf-8'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const resolvedPath = path.resolve(input.path);
    const dir = path.dirname(resolvedPath);

    // Recursive directory creation
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(resolvedPath, input.content, { encoding: input.encoding as BufferEncoding });

    const stats = await fs.stat(resolvedPath);
    return `Successfully wrote ${stats.size} bytes to ${resolvedPath}`;
  }
);

/**
 * Tool: listFiles
 * Recursively lists files in a directory.
 */
export const listFiles = ai.defineTool(
  {
    name: 'listFiles',
    description: 'Lists all files and directories in a given path.',
    inputSchema: z.object({
      directoryPath: z.string().describe('The directory path to list.'),
    }),
    outputSchema: z.array(z.string()),
  },
  async (input) => {
    const resolvedPath = path.resolve(input.directoryPath);
    
    async function walk(dir: string): Promise<string[]> {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const files = await Promise.all(entries.map((entry) => {
        const res = path.resolve(dir, entry.name);
        return entry.isDirectory() ? walk(res) : res;
      }));
      return Array.prototype.concat(...files);
    }

    const allFiles = await walk(resolvedPath);
    return allFiles.map(f => path.relative(resolvedPath, f));
  }
);

/**
 * Tool: readFile
 * Reads content from any file on the disk.
 */
export const readFile = ai.defineTool(
  {
    name: 'readFile',
    description: 'Reads the content of a file from the disk.',
    inputSchema: z.object({
      filePath: z.string().describe('The path to the file to read.'),
      encoding: z.enum(['utf-8', 'ascii', 'base64']).optional().default('utf-8'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const resolvedPath = path.resolve(input.filePath);
    return await fs.readFile(resolvedPath, { encoding: input.encoding as BufferEncoding });
  }
);

export const fileTools = [saveFile, listFiles, readFile];