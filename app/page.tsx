// app/page.tsx
"use client"; // To enable React hooks in the app directory

import { useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  // Fetch books from the API
  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books");

      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.statusText}`);
      }

      const data = await response.json();
      setBooks(data);    //set books in state
    } catch (error) {
      console.error("Error fetching books:",error);
      setError("Error fetching books.please try again.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle form submission to add or update a book
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) {
      setError("Both title and author are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      if (editMode && currentBook) {
        // If editing, make a PUT request
        response = await fetch("/api/books", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: currentBook.id,
            title,
            author,
          }),
        });
      } else {
        // Otherwise, it's a new book, so make a POST request
        response = await fetch("/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, author }),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to submit book");
      }

      const newBook = await response.json();

      if (editMode && currentBook) {
        // Update book in state if editing
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === newBook.id ? newBook : book
          )
        );
      } else {
        // Add new book to state
        setBooks((prevBooks) => [...prevBooks, newBook]);
      }

      // Reset form
      setTitle("");
      setAuthor("");
      setEditMode(false);
      setCurrentBook(null);
    } catch (error) {
      console.error(error);
      setError("Error submitting book.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Book
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch("/api/books", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), //pass the book id in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      const data = await response.json();
    console.log(data.message); // Optional: Log success message

      // Remove the book from the state
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Delete Error:",error);
      setError("Error deleting book Please try again..");
    }
  };

  // Handle Edit Book
  const handleEdit = (book: Book) => {
    setEditMode(true);
    setCurrentBook(book);
    setTitle(book.title);
    setAuthor(book.author);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-t from-gray-800 to-black text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Book List</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <ul className="space-y-4">
        {books.map((book) => (
          <li key={book.id} className="p-4 bg-red-100 text-black rounded-lg shadow-md">
            <strong className="text-xl text-black">{book.title}</strong> by{" "}
            <span className="text-gray-700">{book.author}</span>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => handleEdit(book)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(book.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {editMode ? "Edit Book" : "Add a New Book"}
      </h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-green-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-green-900">
            Author
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 mt-4 text-white rounded-lg focus:outline-none ${
            loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Saving..." : editMode ? "Update Book" : "Add Book"}
        </button>
      </form>
    </div>
  );
}
