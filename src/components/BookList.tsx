
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Edit, Check, X, BookOpen, Info } from "lucide-react";
import { toast } from "sonner";
import { Book } from '@/types/book';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BookListProps {
  books: Book[];
  onUpdateBook: (index: number, updatedBook: Book) => void;
  onDeleteBook: (index: number) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onUpdateBook, onDeleteBook }) => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (index: number, title: string) => {
    setEditIndex(index);
    setEditValue(title);
  };

  const handleSave = (index: number) => {
    if (editValue.trim()) {
      const updatedBook = { ...books[index], title: editValue.trim() };
      onUpdateBook(index, updatedBook);
      toast.success("Book updated successfully");
    }
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "Not available";
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="space-y-2">
        <div className="inline-block px-3 py-1 mb-2 text-xs font-medium tracking-wider text-primary-foreground bg-primary rounded-full animate-fade-in">
          YOUR COLLECTION
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Book Collection</h2>
        <p className="text-sm text-muted-foreground">
          {books.length > 0 
            ? `You have ${books.length} book${books.length === 1 ? '' : 's'} in your collection` 
            : "Your collection is empty. Add some books!"}
        </p>
      </div>
      
      <div className="mt-6 space-y-3">
        {books.length === 0 ? (
          <Card className="p-6 text-center glass-morphism">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">No books added yet. Add your first book above!</p>
          </Card>
        ) : (
          books.map((book, index) => (
            <Card 
              key={index} 
              className="overflow-hidden transition-all duration-200 glass-morphism hover:shadow-md group"
            >
              <div className="p-4">
                {editIndex === index ? (
                  <div className="flex items-center w-full space-x-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      className="flex-1"
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleSave(index)}
                      className="text-green-500"
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={handleCancel}
                      className="text-destructive"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="w-16 h-20 mr-3 flex-shrink-0 bg-muted rounded overflow-hidden">
                        {book.imageUrl ? (
                          <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted-foreground/10">
                            <BookOpen className="w-8 h-8 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium leading-tight">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">{book.authors.join(', ')}</p>
                          </div>
                          <div className="flex items-center space-x-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleEdit(index, book.title)}
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => onDeleteBook(index)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 mt-1 text-xs px-2 text-muted-foreground">
                              <Info className="w-3 h-3 mr-1" />
                              Details
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold">{book.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {book.publishedDate && `Published: ${book.publishedDate}`}
                                {book.publisher && ` • ${book.publisher}`}
                              </p>
                              <p className="text-sm mt-2">{book.description}</p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BookList;
