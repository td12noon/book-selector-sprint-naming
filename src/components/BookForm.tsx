
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusCircle, Search, Loader2, BookOpen } from "lucide-react";
import { BookSearchResult, Book } from '@/types/book';
import { toast } from "sonner";
import { LogEntry } from './LogViewer';

interface BookFormProps {
  onAddBook: (book: Book) => void;
  googleBooksApiKey: string;
  onLogRequest: (log: LogEntry) => void;
}

const BookForm: React.FC<BookFormProps> = ({ onAddBook, googleBooksApiKey, onLogRequest }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search Google Books API with debounce
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounce (wait 500ms after typing stops)
    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      
      const timestamp = new Date().toISOString();
      const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        searchQuery
      )}&key=${googleBooksApiKey}&maxResults=5`;
      
      // Log the request
      onLogRequest({
        timestamp,
        action: `Search Books API: "${searchQuery}"`,
        status: 'success', // Default to success, will update if there's an error
        details: `Request URL: ${apiUrl}`
      });

      try {
        const response = await fetch(apiUrl);
        const responseData = await response.text();

        if (!response.ok) {
          // Log the error response
          onLogRequest({
            timestamp,
            action: `Search Books API Error: "${searchQuery}"`,
            status: 'error',
            details: `Status: ${response.status} ${response.statusText}\nResponse: ${responseData}`
          });
          
          throw new Error('Failed to search books');
        }

        const data = JSON.parse(responseData);
        console.log("API Response:", data); // Debug log
        
        // Log the successful response
        onLogRequest({
          timestamp,
          action: `Search Books API Success: "${searchQuery}"`,
          status: 'success',
          details: `Found ${data.items?.length || 0} results\nResponse: ${JSON.stringify(data, null, 2).substring(0, 500)}${JSON.stringify(data, null, 2).length > 500 ? '...' : ''}`
        });
        
        if (data.items && Array.isArray(data.items)) {
          setSearchResults(data.items);
        } else {
          console.log("No items found in API response:", data);
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching books:', error);
        toast.error('Error searching for books');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, googleBooksApiKey, onLogRequest]);

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

  // Handle input change separately to update popover state
  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    
    // Open popover automatically when typing
    if (value.trim().length >= 3 && !open) {
      setOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent popover from closing when pressing Enter inside the input
    if (e.key === 'Enter') {
      e.preventDefault();
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
          Search for books to add to your collection for the roulette selection
        </p>
      </div>
      
      <div className="mt-6 space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                type="text"
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
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
          <PopoverContent 
            className="p-0 w-[300px] md:w-[400px]" 
            side="bottom" 
            align="start"
            sideOffset={4}
            avoidCollisions={false}
            onInteractOutside={(e) => {
              // Don't close popover when clicking the input
              if (inputRef.current && inputRef.current.contains(e.target as Node)) {
                e.preventDefault();
              }
            }}
          >
            <Command shouldFilter={false}>
              <CommandInput 
                value={searchQuery}
                onValueChange={handleInputChange}
                placeholder="Type to search..." 
                className="h-9"
                autoFocus={false}
              />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>
                  {searchQuery.length < 3 ? 'Type at least 3 characters to search' : 'No books found'}
                </CommandEmpty>
                <CommandGroup heading="Search Results">
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
              </CommandList>
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
