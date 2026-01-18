import { useState } from 'react';
import './App.css';
import Header from "./core/components/Header/Header.tsx";
import Navigation from './core/components/Navigation/Navigation.tsx';
import MyLibraryScreen from './core/screens/MyLibraryScreen/MyLibraryScreen.tsx';
import AddBookModal from './core/components/AddBookModal/AddBookModal.tsx';
import ShelvesScreen from './core/screens/ShelvesScreen/ShelvesScreen.tsx';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'library' | 'shelves'>('library');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleBookAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <div>
        <Header />
        <Navigation 
          onAddBookClick={handleOpenModal} 
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        {currentView === 'library' ? (
          <MyLibraryScreen refreshKey={refreshKey} />
        ) : (
          <ShelvesScreen />
        )}
        <AddBookModal isOpen={isModalOpen} onClose={handleCloseModal} onBookAdded={handleBookAdded} />
      </div>
    </>
  );
}

export default App;
