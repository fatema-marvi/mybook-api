// app/api/books/route.ts
import { NextResponse } from "next/server";

// Sample data
const books: { id: number; title: string; author: string }[] = [
  { id: 1, title: "1984", author: "George Orwell" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
];

// GET method to retrieve books
export async function GET() {
  return NextResponse.json(books);
}

// POST method to create a new book
export async function POST(req: Request) {
  try {
    const { title, author } = await req.json();
    if (!title || !author) {
      return NextResponse.json({ message: "Title and author are required" }, { status: 400 });
    }

    const newBook = { id: books.length + 1, title, author };
    books.push(newBook);
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}

// PUT method to update an existing book
export async function PUT(req: Request) {
  try {
    const { id, title, author } = await req.json();
    
    // Validate input
    if (!id || !title || !author) {
      return NextResponse.json({ message: "ID, title, and author are required" }, { status: 400 });
    }

    // Find the book to update
    const bookIndex = books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    // Update the book
    books[bookIndex] = { id, title, author };

    return NextResponse.json(books[bookIndex], { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return NextResponse.json({ message: "Error updating book" }, { status: 500 });
  }
}

// DELETE method to remove a book
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // Expecting the id of the book to delete

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const bookIndex = books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    // Remove the book from the array
    books.splice(bookIndex, 1);

    return NextResponse.json({ message: "Book deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return NextResponse.json({ message: "Error deleting book" }, { status: 500 });
  }
}
