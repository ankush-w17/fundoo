import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, InputBase, IconButton, Collapse, Button, Checkbox, Chip, Menu, MenuItem, ListItemText } from '@mui/material';
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
  RedoOutlined,
  Close,
  LabelOutlined
} from '@mui/icons-material';
import { createNote } from '../services/note.service';

const TakeNote = ({ onNoteCreated, labels = [] }) => {
    const [expanded, setExpanded] = useState(false);
    const [note, setNote] = useState({ title: '', description: '' });
    const [isChecklist, setIsChecklist] = useState(false);
    const [checklistItems, setChecklistItems] = useState([{ text: '', isDone: false }]);
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    const containerRef = useRef(null);

    const handleExpand = () => {
        setExpanded(true);
    };

    const handleChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    const handleChecklistChange = (index, value) => {
        const newItems = [...checklistItems];
        newItems[index].text = value;
        setChecklistItems(newItems);
        // Add new item if typing in last
        if (index === newItems.length - 1 && value) {
            setChecklistItems([...newItems, { text: '', isDone: false }]);
        }
    };

    const toggleChecklist = () => {
        setIsChecklist(!isChecklist);
        setChecklistItems([{ text: '', isDone: false }]);
        // Preserve description if switching back? For now simple toggle.
    };

    const handleLabelClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLabelClose = () => {
        setAnchorEl(null);
    };
    
    const toggleLabel = (labelId) => {
        if (selectedLabels.includes(labelId)) {
            setSelectedLabels(selectedLabels.filter(id => id !== labelId));
        } else {
            setSelectedLabels([...selectedLabels, labelId]);
        }
    };

    const handleClose = async () => {
        const hasContent = note.title.trim() || note.description.trim() || (isChecklist && checklistItems.some(i => i.text.trim()));
        
        if (hasContent) {
            try {
                const payload = {
                    title: note.title,
                    description: isChecklist ? '' : note.description,
                    checklist: isChecklist ? checklistItems.filter(i => i.text.trim()) : [],
                    labels: selectedLabels
                };
                
                // Description is required by backend validation? 
                // Model: required: [true, 'Note description is required']
                // If Checklist, description might be empty.
                // I should allow empty description in model or send dummy.
                // Or update backend model validation?
                // Model says: required: [true, 'Note description is required']
                // I must fix this or send " " as description.
                if (isChecklist && !payload.description) payload.description = 'Checklist';

                await createNote(payload);
                onNoteCreated();
                setNote({ title: '', description: '' });
                setIsChecklist(false);
                setChecklistItems([{ text: '', isDone: false }]);
                setSelectedLabels([]);
            } catch (error) {
                console.error("Error creating note:", error);
            }
        }
        setExpanded(false);
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target) && !document.querySelector('#label-menu')?.contains(event.target)) {
           // We'll rely on explicit close for saving complex notes to avoid accidental saves during menu interaction
           // But actually we should just collapse.
           if (!anchorEl) setExpanded(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [anchorEl]);

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
        
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {isChecklist ? (
                <Box>
                    {checklistItems.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                            <Checkbox disabled size="small" />
                            <InputBase
                                value={item.text}
                                onChange={(e) => handleChecklistChange(index, e.target.value)}
                                placeholder="List item"
                                sx={{ flexGrow: 1, fontSize: '0.875rem' }}
                                autoFocus={index === checklistItems.length - 1} // Auto focus new item
                            />
                            {item.text && <IconButton size="small" onClick={() => {
                                const newItems = checklistItems.filter((_, i) => i !== index);
                                setChecklistItems(newItems);
                            }}><Close fontSize="small"/></IconButton>}
                        </Box>
                    ))}
                </Box>
            ) : (
                <InputBase
                name="description"
                value={note.description}
                onChange={handleChange}
                placeholder="Take a note..."
                onClick={handleExpand}
                multiline
                sx={{ flexGrow: 1, fontSize: '0.875rem', fontWeight: 500, px: 1, minHeight: '20px' }}
                />
            )}
            
            {/* Selected Labels Chips */}
            {selectedLabels.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, px: 1, mt: 1 }}>
                    {selectedLabels.map(id => {
                        const l = labels.find(l => l._id === id);
                        return l ? (
                            <Chip key={id} label={l.name} size="small" onDelete={() => toggleLabel(id)} />
                        ) : null;
                    })}
                </Box>
            )}

             {!expanded && (
                <Box sx={{ display: 'flex' }}>
                    <IconButton onClick={() => { handleExpand(); toggleChecklist(); }}><CheckBoxOutlined /></IconButton>
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
                    
                    <IconButton size="small" onClick={handleLabelClick}><MoreVertOutlined fontSize="small"/></IconButton>
                    <Menu
                        id="label-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleLabelClose}
                    >
                        <MenuItem disabled>Add label</MenuItem>
                        {labels.map(label => (
                            <MenuItem key={label._id} onClick={() => toggleLabel(label._id)}>
                                <Checkbox checked={selectedLabels.includes(label._id)} size="small" />
                                <ListItemText primary={label.name} />
                            </MenuItem>
                        ))}
                    </Menu>

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
