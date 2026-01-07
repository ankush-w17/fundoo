import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TakeNote from '../components/TakeNote';
import NoteCard from '../components/NoteCard';
import SortableNote from '../components/SortableNote';
import EditLabelsModal from '../components/EditLabelsModal';
import { getNotes, archiveNote, trashNote, deleteForever, restoreNote, getTrashNotes, getArchivedNotes, getNotesByLabel } from '../services/note.service';
import { getLabels } from '../services/label.service';

const Dashboard = () => {
    const [open, setOpen] = useState(true);
    const [notes, setNotes] = useState([]);
    const [labels, setLabels] = useState([]);
    const [view, setView] = useState('notes'); // notes, archive, trash, reminders, label/:id
    const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
    
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const fetchLabels = async () => {
        try {
            const data = await getLabels();
            setLabels(data.data || []);
        } catch (error) {
            console.error("Failed to fetch labels", error);
        }
    };

    const fetchNotes = async () => {
        try {
            let data;
            if (view === 'trash') {
                data = await getTrashNotes();
            } else if (view === 'archive') {
                data = await getArchivedNotes();
            } else if (view.startsWith('label/')) {
                const labelId = view.split('/')[1];
                data = await getNotesByLabel(labelId);
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

    useEffect(() => {
        fetchLabels();
    }, []);

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

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setNotes((items) => {
                const oldIndex = items.findIndex((item) => (item._id || item.id) === active.id);
                const newIndex = items.findIndex((item) => (item._id || item.id) === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#ffffff' }}>
        <Header handleDrawerToggle={handleDrawerToggle} />
        <Box sx={{ display: 'flex', flexGrow: 1, mt: '64px' }}>
            <Sidebar 
                open={open} 
                onViewChange={setView} 
                currentView={view} 
                labels={labels}
                onEditLabels={() => setIsLabelModalOpen(true)}
            />
            <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {view === 'notes' && <TakeNote onNoteCreated={fetchNotes} labels={labels} />}
                {view === 'trash' && <Box sx={{mb: 2, fontStyle: 'italic', color: 'gray'}}>Notes in Trash are deleted after 7 days.</Box>}
                
                <DndContext 
                    sensors={sensors} 
                    collisionDetection={closestCenter} 
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext 
                        items={notes.map(n => n._id || n.id)} 
                        strategy={rectSortingStrategy}
                    >
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
                                <SortableNote 
                                    key={note._id || note.id} 
                                    id={note._id || note.id} 
                                    note={note} 
                                    onAction={handleNoteAction} 
                                />
                            ))}
                        </Box>
                    </SortableContext>
                </DndContext>
            </Box>
        </Box>
        <EditLabelsModal 
            open={isLabelModalOpen} 
            onClose={() => setIsLabelModalOpen(false)} 
            labels={labels}
            onUpdate={fetchLabels}
        />
    </Box>
  );
};

export default Dashboard;
