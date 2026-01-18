import { useState, useEffect } from 'react';
import './App.css';
import Header from "./Header/Header.tsx";
import Navigation from './Navigation/Navigation.tsx';
import MyLibraryScreen from './MyLibraryScreen/MyLibraryScreen.tsx';
import AddBookModal from './AddBookModal/AddBookModal.tsx';
import { getBooks } from './services/books/books.service';

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
