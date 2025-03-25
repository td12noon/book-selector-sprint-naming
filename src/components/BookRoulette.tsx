
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookRouletteProps {
  books: string[];
  onRequestRun: () => void;
  isRunning: boolean;
}

const BookRoulette: React.FC<BookRouletteProps> = ({ books, onRequestRun, isRunning }) => {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      setShowResult(false);
      setSelectedBook(null);
      
      // Start the animation
      const spinInterval = setInterval(() => {
        setVisibleIndex(prev => (prev + 1) % books.length);
      }, 100); // Start fast
      
      // Gradually slow down after some time
      setTimeout(() => {
        clearInterval(spinInterval);
        
        const slowerInterval = setInterval(() => {
          setVisibleIndex(prev => (prev + 1) % books.length);
        }, 150); // Slow down a bit
        
        setTimeout(() => {
          clearInterval(slowerInterval);
          
          const finalInterval = setInterval(() => {
            setVisibleIndex(prev => (prev + 1) % books.length);
          }, 300); // Even slower
          
          setTimeout(() => {
            clearInterval(finalInterval);
            
            // Final selection and display
            const randomIndex = Math.floor(Math.random() * books.length);
            setVisibleIndex(randomIndex);
            setSelectedBook(books[randomIndex]);
            
            timerRef.current = setTimeout(() => {
              setShowResult(true);
            }, 600);
            
          }, 1500); // Final slow down duration
        }, 1500); // Second slow down duration
      }, 2000); // Initial fast duration
    }
  }, [isRunning, books]);

  const handleRunClick = () => {
    if (books.length < 2) {
      toast.error("Add at least 2 books to run the roulette");
      return;
    }
    onRequestRun();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-2">
        <div className="inline-block px-3 py-1 mb-2 text-xs font-medium tracking-wider text-primary-foreground bg-primary rounded-full animate-fade-in">
          BOOK ROULETTE
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Find Your Next Read</h2>
        <p className="text-sm text-muted-foreground">
          Let fate decide what you should read next
        </p>
      </div>
      
      <div className="mt-6">
        <div className="relative book-roulette-container">
          <Card className={cn(
            "h-40 p-6 glass-morphism overflow-hidden transition-all duration-200",
            showResult ? "result-spotlight border-primary" : ""
          )}>
            <div className="relative h-full">
              {books.length > 0 ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {!isRunning && !selectedBook && (
                      <div className="text-center animate-fade-in">
                        <BookOpen className="w-10 h-10 mx-auto mb-2 text-primary/50" />
                        <p className="text-muted-foreground">
                          Click Run to select a random book
                        </p>
                      </div>
                    )}
                  
                    {(isRunning || selectedBook) && (
                      <div 
                        className={cn(
                          "text-center transition-opacity",
                          showResult ? "animate-bounce-in font-bold text-2xl text-primary" : "text-xl"
                        )}
                      >
                        {books[visibleIndex]}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                  <BookOpen className="w-10 h-10 mb-2 text-muted-foreground/50" />
                  <p className="text-muted-foreground">Add books to start the roulette</p>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <Button 
          onClick={handleRunClick}
          disabled={isRunning || books.length < 2}
          className={cn(
            "w-full h-12 mt-4 transition-all duration-300 neo-morphism hover:translate-y-[-2px]",
            isRunning ? "opacity-50" : ""
          )}
        >
          <RefreshCw className={cn("w-5 h-5 mr-2", isRunning ? "animate-spin" : "")} />
          {isRunning ? "Running..." : "Run Roulette"}
        </Button>
      </div>
    </div>
  );
};

export default BookRoulette;
