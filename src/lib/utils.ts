import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TreeItem } from '~/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a flat record of file paths to a hierarchical tree structure
 *
 * Processes file paths by splitting on '/' and building a nested tree where
 * folders are represented as arrays with the folder name as the first element,
 * followed by their contents.
 *
 * @param files - Record mapping file paths to their content
 * @returns Hierarchical tree structure compatible with TreeView component
 *
 * @example
 * ```typescript
 * const files = {
 *   "src/components/Button.tsx": "export const Button = ...",
 *   "src/utils/helpers.ts": "export function helper() ...",
 *   "README.md": "# Project"
 * };
 *
 * const tree = convertFilesToTreeItems(files);
 * // Result: [
 * //   ["src",
 * //     ["components", "Button.tsx"],
 * //     ["utils", "helpers.ts"]
 * //   ],
 * //   "README.md"
 * // ]
 * ```
 */
export function convertFilesToTreeItems(files: Record<string, string>): TreeItem[] {
  interface TreeNode {
    [key: string]: TreeNode | null;
  }

  const tree: TreeNode = {};

  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split('/');
    let current: TreeNode = tree;

    // Navigate/create the tree structure
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (part && !current[part]) {
        current[part] = {};
      }
      // Type assertion since we know current[part] is TreeNode after null check
      if (part && current[part] !== null) {
        current = current[part]!;
      }
    }

    // Add the file (leaf node)
    const fileName = parts[parts.length - 1];
    if (fileName) {
      current[fileName] = null; // null indicates it's a file
    }
  }

  /**
   * Recursively converts tree node structure to TreeItem format
   *
   * @param node - Tree node to convert
   * @param name - Optional name for the current node
   * @returns TreeItem array or single TreeItem
   */
  function convertNode(node: TreeNode, name?: string): TreeItem[] | TreeItem {
    const entries = Object.entries(node);

    if (entries.length === 0) {
      return name ?? '';
    }

    const children: TreeItem[] = [];

    for (const [key, value] of entries) {
      if (value === null) {
        // It's a file
        children.push(key);
      } else {
        // It's a folder
        const subTree = convertNode(value, key);
        if (Array.isArray(subTree)) {
          children.push([key, ...subTree]);
        } else {
          children.push([key, subTree]);
        }
      }
    }

    return children;
  }

  const result = convertNode(tree);
  return Array.isArray(result) ? result : [result];
}
