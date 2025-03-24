
export interface BookSearchResult {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    publishedDate?: string;
    publisher?: string;
  };
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  imageUrl: string;
  publishedDate?: string;
  publisher?: string;
}
