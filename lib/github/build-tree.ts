import type { TreeNode } from '@/lib/github/types';

export interface GitTreeEntry {
  path: string;
  type: 'blob' | 'tree' | 'commit';
}

/**
 * Converts GitHub's flat recursive tree listing into a nested `TreeNode[]`
 * suitable for rendering as a folder structure. Directories are sorted
 * before files, and both are sorted alphabetically within their group.
 */
export function buildFolderTree(entries: GitTreeEntry[]): TreeNode[] {
  const root: TreeNode = { name: '', path: '', type: 'dir', children: [] };

  for (const entry of entries) {
    if (entry.type !== 'blob' && entry.type !== 'tree') continue;

    const segments = entry.path.split('/');
    let current = root;

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;
      const path = segments.slice(0, index + 1).join('/');

      if (!current.children) current.children = [];
      let next = current.children.find((c) => c.name === segment);

      if (!next) {
        next = {
          name: segment,
          path,
          type: isLast && entry.type === 'blob' ? 'file' : 'dir',
          children: isLast && entry.type === 'blob' ? undefined : [],
        };
        current.children.push(next);
      }

      current = next;
    });
  }

  sortTree(root.children ?? []);
  return root.children ?? [];
}

function sortTree(nodes: TreeNode[]) {
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  for (const node of nodes) {
    if (node.children) sortTree(node.children);
  }
}
