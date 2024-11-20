"use client"
import { useState, useEffect } from "react";

interface BookFormProps {
  onSubmit: (title: string, author: string) => void;
  initialTitle?: string;
  initialAuthor?: string;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, initialTitle = "", initialAuthor = "" }) => {
  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState(initialAuthor);

  useEffect(() => {
    setTitle(initialTitle);
    setAuthor(initialAuthor);
  }, [initialTitle, initialAuthor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, author);
    setTitle("");
    setAuthor("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white">
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2" htmlFor="title">
          Book Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2" htmlFor="author">
          Author Name
        </label>
        <input
          id="author"
          type="text"
          placeholder="Enter author name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
      >
        {initialTitle ? 'Update Book' : 'Add Book'}
      </button>
    </form>
  );
};

export default BookForm;
