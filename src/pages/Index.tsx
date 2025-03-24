
import React, { useState, useEffect } from 'react';
import BookForm from '@/components/BookForm';
import BookList from '@/components/BookList';
import BookRoulette from '@/components/BookRoulette';
import { toast } from "sonner";

const Index = () => {
  // State management
  const [books, setBooks] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Load books from localStorage on initial load
  useEffect(() => {
    const savedBooks = localStorage.getItem('bookRouletteBooks');
    if (savedBooks) {
      try {
        setBooks(JSON.parse(savedBooks));
      } catch (e) {
        console.error('Error loading saved books:', e);
      }
    }
  }, []);

  // Save books to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookRouletteBooks', JSON.stringify(books));
  }, [books]);

  // Book management functions
  const handleAddBook = (book: string) => {
    if (books.includes(book)) {
      toast.error("This book is already in your collection");
      return;
    }
    setBooks(prev => [...prev, book]);
    toast.success("Book added to your collection");
  };

  const handleUpdateBook = (index: number, newTitle: string) => {
    const updatedBooks = [...books];
    updatedBooks[index] = newTitle;
    setBooks(updatedBooks);
  };

  const handleDeleteBook = (index: number) => {
    setBooks(prev => prev.filter((_, i) => i !== index));
    toast.success("Book removed from your collection");
  };

  // Roulette functions
  const handleRunRoulette = () => {
    if (books.length < 2) {
      toast.error("Add at least 2 books to run the roulette");
      return;
    }
    setIsRunning(true);
    
    // Reset the running state after the animation duration
    setTimeout(() => {
      setIsRunning(false);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container px-4 py-12 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="pb-8 mb-8 text-center border-b">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-primary-foreground bg-primary rounded-full animate-fade-in">
              BOOK SELECTOR
            </div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">Book Roulette</h1>
            <p className="max-w-xl mx-auto text-lg text-muted-foreground">
              Add your favorite books and let the roulette decide your next reading adventure
            </p>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-8">
              <BookForm onAddBook={handleAddBook} />
              <BookList 
                books={books} 
                onUpdateBook={handleUpdateBook} 
                onDeleteBook={handleDeleteBook} 
              />
            </div>
            
            <div className="md:pl-8 md:border-l">
              <BookRoulette 
                books={books} 
                onRequestRun={handleRunRoulette} 
                isRunning={isRunning} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
