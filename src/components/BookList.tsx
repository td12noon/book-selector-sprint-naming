
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Edit, Check, X, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface BookListProps {
  books: string[];
  onUpdateBook: (index: number, newTitle: string) => void;
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
      onUpdateBook(index, editValue.trim());
      toast.success("Book updated successfully");
    }
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
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
              <div className="flex items-center justify-between p-4">
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
                  <>
                    <div className="flex items-center flex-1 space-x-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="font-medium">{book}</span>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleEdit(index, book)}
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
                  </>
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
