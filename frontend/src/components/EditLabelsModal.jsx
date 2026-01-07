import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, IconButton, Box } from '@mui/material';
import { Edit, Delete, Check, Close, Label as LabelIcon, Add } from '@mui/icons-material';
import { createLabel, updateLabel, deleteLabel } from '../services/label.service';

const EditLabelsModal = ({ open, onClose, labels, onUpdate }) => {
    const [newLabelName, setNewLabelName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');

    const handleCreate = async () => {
        if (!newLabelName.trim()) return;
        try {
            await createLabel({ name: newLabelName });
            setNewLabelName('');
            onUpdate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (id) => {
        if (!editingName.trim()) return;
        try {
            await updateLabel(id, { name: editingName });
            setEditingId(null);
            onUpdate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteLabel(id);
            onUpdate();
        } catch (error) {
            console.error(error);
        }
    };

    const startEditing = (label) => {
        setEditingId(label._id);
        setEditingName(label.name);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Edit labels</DialogTitle>
            <DialogContent>
                <List>
                    <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                         <IconButton onClick={() => setNewLabelName('')}>
                            <Close />
                        </IconButton>
                        <TextField
                            fullWidth
                            variant="standard"
                            placeholder="Create new label"
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                        />
                         <IconButton onClick={handleCreate} disabled={!newLabelName.trim()}>
                            <Check />
                        </IconButton>
                    </ListItem>
                    {labels.map((label) => (
                        <ListItem key={label._id} sx={{ display: 'flex', alignItems: 'center' }}>
                            {editingId === label._id ? (
                                <>
                                    <IconButton onClick={() => setEditingId(null)}>
                                        <Delete />
                                    </IconButton>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                    />
                                    <IconButton onClick={() => handleUpdate(label._id)}>
                                        <Check />
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <IconButton onClick={() => handleDelete(label._id)}>
                                        <LabelIcon />
                                    </IconButton>
                                    <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => startEditing(label)}>
                                        {label.name}
                                    </Box>
                                    <IconButton onClick={() => startEditing(label)}>
                                        <Edit />
                                    </IconButton>
                                </>
                            )}
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Done</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditLabelsModal;
