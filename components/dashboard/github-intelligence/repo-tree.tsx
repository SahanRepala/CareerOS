'use client';

import { useState } from 'react';
import { ChevronRight, File, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TreeNode } from '@/lib/github/types';

export function RepoTree({ nodes }: { nodes: TreeNode[] }) {
  if (nodes.length === 0) {
    return <p className="text-sm text-muted-foreground">No files found for this repository.</p>;
  }

  return (
    <ul className="space-y-0.5 text-sm">
      {nodes.map((node) => (
        <TreeRow key={node.path} node={node} depth={0} />
      ))}
    </ul>
  );
}

function TreeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const [open, setOpen] = useState(depth < 1);
  const isDir = node.type === 'dir';
  const hasChildren = isDir && (node.children?.length ?? 0) > 0;

  return (
    <li>
      <button
        type="button"
        disabled={!hasChildren}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-1.5 rounded-lg px-2 py-1 text-left transition-colors',
          hasChildren ? 'hover:bg-muted' : 'cursor-default'
        )}
        style={{ paddingLeft: depth * 16 + 8 }}
      >
        {hasChildren ? (
          <ChevronRight
            className={cn('h-3.5 w-3.5 flex-none text-muted-foreground transition-transform', open && 'rotate-90')}
          />
        ) : (
          <span className="w-3.5 flex-none" />
        )}
        {isDir ? (
          open ? (
            <FolderOpen className="h-3.5 w-3.5 flex-none text-primary" />
          ) : (
            <Folder className="h-3.5 w-3.5 flex-none text-primary" />
          )
        ) : (
          <File className="h-3.5 w-3.5 flex-none text-muted-foreground" />
        )}
        <span className={cn('truncate', isDir ? 'font-medium text-foreground' : 'text-muted-foreground')}>
          {node.name}
        </span>
      </button>

      {isDir && open && hasChildren && (
        <ul className="space-y-0.5">
          {node.children!.map((child) => (
            <TreeRow key={child.path} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
