import { useState } from 'react';
import './App.css';
import Header from "./core/components/Header/Header.tsx";
import Navigation from './core/components/Navigation/Navigation.tsx';
import MyLibraryScreen from './core/screens/MyLibraryScreen/MyLibraryScreen.tsx';
import AddBookModal from './core/components/AddBookModal/AddBookModal.tsx';
import ShelvesScreen from './core/screens/ShelvesScreen/ShelvesScreen.tsx';
import RecommendationsScreen from './core/screens/RecommendationsScreen/RecommendationsScreen.tsx';
import ImportExportScreen from './core/screens/ImportExportScreen/ImportExportScreen.tsx';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'library' | 'shelves' | 'recommendations' | 'import-export'>('library');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleBookAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleImportComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'library':
        return <MyLibraryScreen refreshKey={refreshKey} />;
      case 'shelves':
        return <ShelvesScreen />;
      case 'import-export':
        return <ImportExportScreen onImportComplete={handleImportComplete} />;
      default:
        return <MyLibraryScreen refreshKey={refreshKey} />;
    }
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
        ) : currentView === 'shelves' ? (
          <ShelvesScreen />
        ) : (
            <RecommendationsScreen />
        )}
        <AddBookModal isOpen={isModalOpen} onClose={handleCloseModal} onBookAdded={handleBookAdded} />
      </div>
    </>
  );
}

export default App;
