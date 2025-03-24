
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusCircle, Search, Loader2, BookOpen } from "lucide-react";
import { BookSearchResult, Book } from '@/types/book';
import { toast } from "sonner";

interface BookFormProps {
  onAddBook: (book: Book) => void;
  googleBooksApiKey: string;
}

const BookForm: React.FC<BookFormProps> = ({ onAddBook, googleBooksApiKey }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search Google Books API
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            searchQuery
          )}&key=${googleBooksApiKey}&maxResults=5`
        );

        if (!response.ok) {
          throw new Error('Failed to search books');
        }

        const data = await response.json();
        setSearchResults(data.items || []);
      } catch (error) {
        console.error('Error searching books:', error);
        toast.error('Error searching for books');
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, googleBooksApiKey]);

  const handleSelectBook = (book: BookSearchResult) => {
    const newBook: Book = {
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || ['Unknown Author'],
      description: book.volumeInfo.description || 'No description available',
      imageUrl: book.volumeInfo.imageLinks?.thumbnail || '',
      publishedDate: book.volumeInfo.publishedDate,
      publisher: book.volumeInfo.publisher,
    };

    onAddBook(newBook);
    setSearchQuery('');
    setSearchResults([]);
    setOpen(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-2">
        <div className="inline-block px-3 py-1 mb-2 text-xs font-medium tracking-wider text-primary-foreground bg-primary rounded-full animate-fade-in">
          ADD NEW BOOK
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Enter a book title</h2>
        <p className="text-sm text-muted-foreground">
          Search for books to add to your collection for the roulette selection
        </p>
      </div>
      
      <div className="mt-6 space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a book..."
                className="h-12 px-4 transition-all duration-200 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <div className="absolute top-0 right-3 h-full flex items-center">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px] md:w-[400px]" side="bottom" align="start">
            <Command>
              <CommandInput 
                placeholder="Type to search..." 
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandEmpty>
                {searchQuery.length < 3 ? 'Type at least 3 characters to search' : 'No books found'}
              </CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {searchResults.map((book) => (
                  <CommandItem
                    key={book.id}
                    onSelect={() => handleSelectBook(book)}
                    className="flex items-center gap-2 py-2 cursor-pointer"
                  >
                    <div className="w-10 h-10 flex-shrink-0 bg-muted flex items-center justify-center rounded overflow-hidden">
                      {book.volumeInfo.imageLinks?.smallThumbnail ? (
                        <img 
                          src={book.volumeInfo.imageLinks.smallThumbnail} 
                          alt={book.volumeInfo.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-medium truncate">{book.volumeInfo.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        
        <Button 
          type="button" 
          className="w-full h-12 transition-all duration-200 neo-morphism hover:bg-primary/90 hover:translate-y-[-2px]"
          disabled={!searchQuery.trim()}
          onClick={() => setOpen(true)}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Search Books
        </Button>
      </div>
    </div>
  );
};

export default BookForm;
