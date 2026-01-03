import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, InputBase, IconButton, Collapse, Button } from '@mui/material';
import {
  CheckBoxOutlined,
  BrushOutlined,
  ImageOutlined,
  PushPinOutlined,
  NotificationAddOutlined,
  PersonAddOutlined,
  PaletteOutlined,
  ArchiveOutlined,
  MoreVertOutlined,
  UndoOutlined,
  RedoOutlined
} from '@mui/icons-material';
import { createNote } from '../services/note.service';

const TakeNote = ({ onNoteCreated }) => {
    const [expanded, setExpanded] = useState(false);
    const [note, setNote] = useState({ title: '', description: '' });
    const containerRef = useRef(null);

    const handleExpand = () => {
        setExpanded(true);
    };

    const handleChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    const handleClose = async () => {
        if (note.title.trim() || note.description.trim()) {
            try {
                await createNote(note);
                onNoteCreated();
                setNote({ title: '', description: '' });
            } catch (error) {
                console.error("Error creating note:", error);
            }
        }
        setExpanded(false);
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
           // We do NOT want to close immediately on click outside if we want to save, 
           // usually Google Keep saves on close. But for now let's just collapse.
           // To be safe, we can trigger save here too if needed, but let's rely on explicit close for now 
           // or just simple collapse. 
           // Actually, Keep saves on click outside.
           // For simplicity, I'll allow the user to click "Close" to save, 
           // but I'll also collapse on click outside (without saving for now to avoid bugs).
           setExpanded(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }} ref={containerRef}>
      <Paper elevation={3} sx={{
            width: '600px',
            borderRadius: '8px',
            p: 1.5,
            border: '1px solid #e0e0e0',
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)' 
        }}>
        <Collapse in={expanded}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <InputBase
                    name="title"
                    value={note.title}
                    onChange={handleChange}
                    placeholder="Title"
                    sx={{ fontSize: '1rem', fontWeight: 500, px: 1, width: '90%' }}
                />
                <IconButton>
                    <PushPinOutlined />
                </IconButton>
            </Box>
        </Collapse>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InputBase
            name="description"
            value={note.description}
            onChange={handleChange}
            placeholder="Take a note..."
            onClick={handleExpand}
            multiline
            sx={{ flexGrow: 1, fontSize: '0.875rem', fontWeight: 500, px: 1 }}
            />
             {!expanded && (
                <Box sx={{ display: 'flex' }}>
                    <IconButton><CheckBoxOutlined /></IconButton>
                    <IconButton><BrushOutlined /></IconButton>
                    <IconButton><ImageOutlined /></IconButton>
                </Box>
             )}
        </Box>

        <Collapse in={expanded}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small"><NotificationAddOutlined fontSize="small"/></IconButton>
                    <IconButton size="small"><PersonAddOutlined fontSize="small"/></IconButton>
                    <IconButton size="small"><PaletteOutlined fontSize="small"/></IconButton>
                    <IconButton size="small"><ImageOutlined fontSize="small"/></IconButton>
                    <IconButton size="small"><ArchiveOutlined fontSize="small"/></IconButton>
                    <IconButton size="small"><MoreVertOutlined fontSize="small"/></IconButton>
                    <IconButton size="small"><UndoOutlined fontSize="small"/></IconButton>
                    <IconButton size="small"><RedoOutlined fontSize="small"/></IconButton>
                </Box>
                <Box>
                     <Button size="small" onClick={handleClose} sx={{fontSize: '0.875rem', color: '#202124', textTransform: 'none', fontWeight: 500, borderRadius: 1, px: 2, '&:hover': {backgroundColor: 'rgba(0,0,0,0.08)'}}}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default TakeNote;
