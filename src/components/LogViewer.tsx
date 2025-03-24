
import React from 'react';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface LogEntry {
  timestamp: string;
  action: string;
  status: 'success' | 'error';
  details: string;
}

interface LogViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logs: LogEntry[];
  onClearLogs: () => void;
}

const LogViewer: React.FC<LogViewerProps> = ({ 
  open, 
  onOpenChange, 
  logs, 
  onClearLogs 
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[90vw] sm:w-[450px] p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle>API Request Logs</SheetTitle>
            <div className="flex gap-2">
              <button 
                onClick={onClearLogs}
                className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded"
              >
                Clear Logs
              </button>
              <SheetClose asChild>
                <button className="rounded-full p-1 hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </SheetClose>
            </div>
          </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-100px)] p-6">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <p>No logs available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-md border ${
                    log.status === 'error' 
                      ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/30'
                      : 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-background">
                      {log.timestamp}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      log.status === 'error' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-2">{log.action}</p>
                  <pre className="mt-2 text-xs p-2 bg-background rounded overflow-x-auto">
                    {log.details}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default LogViewer;
