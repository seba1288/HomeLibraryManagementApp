import React, { useState, useEffect } from 'react';
import { getShelves, createShelf, deleteShelf } from '../../services/shelves/shelves.service';
import type { Shelf } from '../../services/shelves/shelves.service';
import ShelfDetailsScreen from './ShelfDetailsScreen';
import styles from './ShelvesScreen.module.css';

function ShelvesScreen() {
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newShelfName, setNewShelfName] = useState('');

    useEffect(() => {
        loadShelves();
    }, []);

    async function loadShelves() {
        setLoading(true);
        try {
            const data = await getShelves();
            setShelves(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleCreateShelf = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newShelfName.trim()) return;
        try {
            await createShelf(newShelfName);
            setNewShelfName('');
            setIsCreateModalOpen(false);
            loadShelves();
        } catch (error) {
            console.error(error);
            alert('Failed to create shelf');
        }
    };

    const handleDeleteShelf = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this shelf?')) return;
        try {
            await deleteShelf(id);
            loadShelves();
            if (selectedShelf?.id === id) setSelectedShelf(null);
        } catch (error) {
            console.error(error);
            alert('Failed to delete shelf');
        }
    };

    if (selectedShelf) {
        return <ShelfDetailsScreen shelf={selectedShelf} onBack={() => { setSelectedShelf(null); loadShelves(); }} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>My Shelves</h2>
                <button className={styles.createButton} onClick={() => setIsCreateModalOpen(true)}>
                    + Create Shelf
                </button>
            </div>

            {loading ? (
                <p>Loading shelves...</p>
            ) : shelves.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>You haven't created any shelves yet.</p>
                    <button className={styles.createButton} onClick={() => setIsCreateModalOpen(true)} style={{ marginTop: '16px' }}>
                        + Create First Shelf
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {shelves.map(shelf => (
                        <div key={shelf.id} className={styles.card} onClick={() => setSelectedShelf(shelf)}>
                            <h3 className={styles.cardTitle}>{shelf.name}</h3>
                            <p className={styles.cardCount}>{shelf.book_count} books</p>
                            <button className={styles.deleteButton} onClick={(e) => handleDeleteShelf(e, shelf.id)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isCreateModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsCreateModalOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3>Create New Shelf</h3>
                        <form onSubmit={handleCreateShelf}>
                            <input
                                type="text"
                                placeholder="Shelf Name"
                                value={newShelfName}
                                onChange={e => setNewShelfName(e.target.value)}
                                className={styles.input}
                                autoFocus
                            />
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className={styles.cancelButton}>Cancel</button>
                                <button type="submit" className={styles.saveButton}>Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShelvesScreen;
