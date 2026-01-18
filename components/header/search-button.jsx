"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function HeaderSearchButton({ onOpen }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onOpen}
      className="group relative flex items-center gap-2 border-border bg-background/50 backdrop-blur-sm hover:bg-accent hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md dark:bg-slate-900/50 dark:hover:bg-slate-800/80 dark:border-slate-700"
    >
      <div className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors dark:bg-blue-500/20 dark:group-hover:bg-blue-500/30">
        <Search className="h-3.5 w-3.5 text-primary dark:text-blue-400" />
      </div>

      <span className="hidden sm:inline text-sm font-medium text-foreground/80 group-hover:text-foreground dark:text-slate-300 dark:group-hover:text-slate-100">
        Search
      </span>

      <kbd className="ml-auto hidden md:inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
