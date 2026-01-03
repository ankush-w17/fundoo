import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TakeNote from '../components/TakeNote';
import NoteCard from '../components/NoteCard';
import { getNotes, archiveNote, trashNote, deleteForever, restoreNote, getTrashNotes, getArchivedNotes } from '../services/note.service';

const Dashboard = () => {
    const [open, setOpen] = useState(true);
    const [notes, setNotes] = useState([]);
    const [view, setView] = useState('notes'); // notes, archive, trash, reminders

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const fetchNotes = async () => {
        try {
            let data;
            if (view === 'trash') {
                data = await getTrashNotes();
            } else if (view === 'archive') {
                data = await getArchivedNotes();
            } else {
                data = await getNotes();
            }

            if (data.data) {
                setNotes(data.data);
            } else if (Array.isArray(data)) {
                setNotes(data);
            } else {
                 setNotes([]);
            }
        } catch (error) {
            console.error("Failed to fetch notes", error);
             setNotes([]);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [view]);

    const handleNoteAction = async (action, id) => {
        try {
            if (action === 'archive') await archiveNote(id);
            else if (action === 'trash') await trashNote(id);
            else if (action === 'deleteForever') await deleteForever(id);
            else if (action === 'recover') await restoreNote(id);
            
            fetchNotes();
        } catch (error) {
            console.error(`Failed to ${action} note`, error);
        }
    };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#ffffff' }}>
        <Header handleDrawerToggle={handleDrawerToggle} />
        <Box sx={{ display: 'flex', flexGrow: 1, mt: '64px' }}>
            <Sidebar open={open} onViewChange={setView} currentView={view} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {view === 'notes' && <TakeNote onNoteCreated={fetchNotes} />}
                {view === 'trash' && <Box sx={{mb: 2, fontStyle: 'italic', color: 'gray'}}>Notes in Trash are deleted after 7 days.</Box>}
                <Box sx={{ 
                    width: '100%', 
                    maxWidth: '1200px', 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 2,
                    justifyContent: 'center', // Center grid
                    alignItems: 'flex-start' 
                }}>
                     {notes.map((note) => (
                        <NoteCard key={note._id || note.id} note={note} onAction={handleNoteAction} />
                     ))}
                </Box>
            </Box>
        </Box>
    </Box>
  );
};

export default Dashboard;
