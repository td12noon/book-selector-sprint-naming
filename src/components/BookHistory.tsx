
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookHistoryProps {
  history: Array<{
    title: string;
    timestamp: Date;
  }>;
}

const BookHistory: React.FC<BookHistoryProps> = ({ history }) => {
  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="space-y-2">
        <div className="inline-block px-3 py-1 mb-2 text-xs font-medium tracking-wider text-primary-foreground bg-primary rounded-full animate-fade-in">
          BOOK HISTORY
        </div>
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <History className="h-5 w-5" />
          Past Winners
        </h2>
        <p className="text-sm text-muted-foreground">
          Previous books selected by the roulette
        </p>
      </div>
      
      <div className="mt-4 space-y-4">
        {history.length === 0 ? (
          <Card className="bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-6 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">No history yet. Run the roulette to select your first book!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-3 border rounded-lg transition-all",
                  index === 0 ? "border-primary/50 bg-primary/5" : "border-muted bg-card"
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                      index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium truncate">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                      Latest
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookHistory;
