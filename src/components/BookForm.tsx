
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

interface BookFormProps {
  onAddBook: (book: string) => void;
}

const BookForm: React.FC<BookFormProps> = ({ onAddBook }) => {
  const [bookTitle, setBookTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookTitle.trim()) {
      onAddBook(bookTitle.trim());
      setBookTitle('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-2">
        <div className="inline-block px-3 py-1 mb-2 text-xs font-medium tracking-wider text-primary-foreground bg-primary rounded-full animate-fade-in">
          ADD NEW BOOK
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Enter a book title</h2>
        <p className="text-sm text-muted-foreground">
          Add books to your collection for the roulette selection
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="relative">
          <Input
            type="text"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            placeholder="Book title"
            className="h-12 px-4 transition-all duration-200 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full h-12 transition-all duration-200 neo-morphism hover:bg-primary/90 hover:translate-y-[-2px]"
          disabled={!bookTitle.trim()}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Book
        </Button>
      </form>
    </div>
  );
};

export default BookForm;
