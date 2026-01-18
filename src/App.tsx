import { useState, useEffect } from 'react';
import './App.css';
import Header from "./core/components/Header/Header.tsx";
import Navigation from './core/components/Navigation/Navigation.tsx';
import MyLibraryScreen from './core/screens/MyLibraryScreen/MyLibraryScreen.tsx';
import AddBookModal from './core/components/AddBookModal/AddBookModal.tsx';
import { getBooks } from './core/services/books/books.service.ts';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const data = await getBooks();
      setBooks(data);
    } catch {
      setBooks([]);
    }
    setLoadingBooks(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div>
        <Header />
        <Navigation onAddBookClick={handleOpenModal} />
        <MyLibraryScreen books={books} loading={loadingBooks} onBookDeleted={fetchBooks} />
        <AddBookModal isOpen={isModalOpen} onClose={handleCloseModal} onBookAdded={fetchBooks} />
      </div>
    </>
  );
}

export default App;
