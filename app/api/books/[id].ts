"use client"
import { NextRequest, NextResponse } from 'next/server';

// Sample in-memory database
let books: { id: number; title: string; author: string }[] = [
  { id: 1, title: "1984", author: "George Orwell" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" }
];

export default async function handler(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop(); // Extract id from URL

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ message: 'Invalid book ID' }, { status: 400 });
  }

  switch (req.method) {
    case 'PUT':
      // Update book
      const bookIndex = books.findIndex((book) => book.id === parseInt(id));
      if (bookIndex === -1) return NextResponse.json({ message: 'Book not found' }, { status: 404 });

      const updatedBook = await req.json();
      const { title, author } = updatedBook;

      // Ensure the updated data has title and author
      if (!title || !author) {
        return NextResponse.json({ message: 'Title and author are required' }, { status: 400 });
      }
      books[bookIndex] = { ...books[bookIndex], ...updatedBook };
      return NextResponse.json(books[bookIndex], { status: 200 });

    case 'DELETE':
      // Delete book
      books = books.filter((book) => book.id !== parseInt(id));
      return NextResponse.json({ message: 'Book deleted successfully' }, { status: 200 });

    default:
      return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }
}
