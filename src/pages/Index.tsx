
import React, { useState, useEffect } from 'react';
import BookForm from '@/components/BookForm';
import BookList from '@/components/BookList';
import BookRoulette from '@/components/BookRoulette';
import { toast } from "sonner";
import { Book } from '@/types/book';

const Index = () => {
  // State management
  const [books, setBooks] = useState<Book[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [googleBooksApiKey, setGoogleBooksApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

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

    const savedApiKey = localStorage.getItem('googleBooksApiKey');
    if (savedApiKey) {
      setGoogleBooksApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  // Save books to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookRouletteBooks', JSON.stringify(books));
  }, [books]);

  // Book management functions
  const handleAddBook = (book: Book) => {
    if (books.some(b => b.id === book.id)) {
      toast.error("This book is already in your collection");
      return;
    }
    setBooks(prev => [...prev, book]);
    toast.success("Book added to your collection");
  };

  const handleUpdateBook = (index: number, updatedBook: Book) => {
    const updatedBooks = [...books];
    updatedBooks[index] = updatedBook;
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

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('googleBooksApiKey', googleBooksApiKey);
    setShowApiKeyInput(false);
    toast.success("API key saved successfully");
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
          
          {/* API Key Form */}
          {showApiKeyInput && (
            <div className="mb-8 p-4 glass-morphism rounded-lg max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-2">Google Books API Key</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Please enter your Google Books API key to enable book search.
              </p>
              <form onSubmit={handleSaveApiKey} className="flex gap-2">
                <Input
                  type="text"
                  value={googleBooksApiKey}
                  onChange={(e) => setGoogleBooksApiKey(e.target.value)}
                  placeholder="Paste your API key here"
                  className="flex-1"
                />
                <Button type="submit" disabled={!googleBooksApiKey.trim()}>
                  Save
                </Button>
              </form>
            </div>
          )}
          
          {/* Main content */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-8">
              <BookForm 
                onAddBook={handleAddBook} 
                googleBooksApiKey={googleBooksApiKey}
              />
              <BookList 
                books={books} 
                onUpdateBook={handleUpdateBook} 
                onDeleteBook={handleDeleteBook} 
              />
            </div>
            
            <div className="md:pl-8 md:border-l">
              <BookRoulette 
                books={books.map(book => book.title)} 
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
