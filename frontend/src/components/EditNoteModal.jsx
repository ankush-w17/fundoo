import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, TextField, Box, IconButton, DialogActions, Button } from '@mui/material';
import { PushPinOutlined, PushPin, ArchiveOutlined, DeleteOutlineOutlined, MoreVertOutlined, PaletteOutlined, ImageOutlined, PersonAddOutlined, RestoreFromTrashOutlined, DeleteForeverOutlined, Undo, Redo } from '@mui/icons-material';
import { updateNote } from '../services/note.service';

const EditNoteModal = ({ open, onClose, note, onUpdate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPinned, setIsPinned] = useState(false);

    useEffect(() => {
        if (note) {
            setTitle(note.title || '');
            setDescription(note.description || '');
            setIsPinned(note.isPinned || false);
        }
    }, [note]);

    const handleSave = async () => {
        try {
            if (!note) return;
            const updatedData = {
                title,
                description,
                isPinned,
            };
            await updateNote(note._id || note.id, updatedData);
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to update note", error);
        }
    };

    if (!note) return null;

    return (
        <Dialog 
            open={open} 
            onClose={handleSave}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: { borderRadius: 2, p: 1 }
            }}
        >
            <DialogContent sx={{ p: 1, pb: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                        fullWidth
                        placeholder="Title"
                        variant="standard"
                        InputProps={{ disableUnderline: true, style: { fontSize: '1.25rem', fontWeight: 500 } }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <IconButton onClick={() => setIsPinned(!isPinned)}>
                        {isPinned ? <PushPin /> : <PushPinOutlined />}
                    </IconButton>
                </Box>
                <TextField
                    fullWidth
                    multiline
                    placeholder="Note"
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 2 }}
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', px: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                     <IconButton size="small"><PersonAddOutlined fontSize="small" /></IconButton>
                     <IconButton size="small"><PaletteOutlined fontSize="small" /></IconButton>
                     <IconButton size="small"><ImageOutlined fontSize="small" /></IconButton>
                     <IconButton size="small"><ArchiveOutlined fontSize="small" /></IconButton>
                     <IconButton size="small"><MoreVertOutlined fontSize="small" /></IconButton>
                     <IconButton size="small"><Undo fontSize="small" /></IconButton>
                     <IconButton size="small"><Redo fontSize="small" /></IconButton>
                </Box>
                <Button onClick={handleSave} color="inherit" sx={{ fontWeight: 500 }}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditNoteModal;
