import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box, CardActions, Chip, Checkbox } from '@mui/material';
import {
  NotificationAddOutlined,
  PersonAddOutlined,
  PaletteOutlined,
  ImageOutlined,
  ArchiveOutlined,
  MoreVertOutlined,
  DeleteOutlineOutlined,
  RestoreFromTrashOutlined,
  DeleteForeverOutlined
} from '@mui/icons-material';

const NoteCard = ({ note, onAction, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      sx={{
        width: 240,
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        boxShadow: isHovered ? '0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)' : 'none',
        '&:hover': {
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)',
        },
        transition: 'box-shadow 0.2s',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent sx={{ pb: 0, cursor: 'default' }} onClick={() => onEdit && onEdit(note)}>
        {note.title && <Typography variant="h6" component="div" sx={{ fontSize: '1rem', fontWeight: 500, mb: 1 }}>
          {note.title}
        </Typography>}
        {note.checklist && note.checklist.length > 0 ? (
             <Box>
                {note.checklist.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                         <Checkbox checked={item.isDone} size="small" disabled sx={{ p: 0.5 }} />
                         <Typography variant="body2" sx={{ textDecoration: item.isDone ? 'line-through' : 'none', color: item.isDone ? 'text.secondary' : 'text.primary' }}>
                             {item.text}
                         </Typography>
                    </Box>
                ))}
             </Box>
        ) : (
             <Typography variant="body2" color="text.secondary" sx={{whiteSpace: 'pre-wrap'}}>
                {note.description}
             </Typography>
        )}
        {note.labels && note.labels.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {note.labels.map((label) => (
                    <Chip key={label._id} label={label.name} size="small" sx={{ backgroundColor: 'rgba(0,0,0,0.08)' }} />
                ))}
            </Box>
        )}
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <CardActions sx={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s', justifyContent: 'space-between' }}>
         <Box sx={{ display: 'flex', gap: 0 }}>
            <IconButton size="small"><NotificationAddOutlined fontSize="small" /></IconButton>
            <IconButton size="small"><PersonAddOutlined fontSize="small" /></IconButton>
            <IconButton size="small"><PaletteOutlined fontSize="small" /></IconButton>
            <IconButton size="small"><ImageOutlined fontSize="small" /></IconButton>
             {!note.isTrash && <IconButton size="small" onClick={() => onAction('archive', note._id)}><ArchiveOutlined fontSize="small" /></IconButton>}
             {note.isTrash && <IconButton size="small" onClick={() => onAction('recover', note._id)}><RestoreFromTrashOutlined fontSize="small" /></IconButton>}
             {note.isTrash && <IconButton size="small" onClick={() => onAction('deleteForever', note._id)}><DeleteForeverOutlined fontSize="small" /></IconButton>}
            <IconButton size="small"><MoreVertOutlined fontSize="small" /></IconButton>
            {!note.isTrash && <IconButton size="small" onClick={() => onAction('trash', note._id)}><DeleteOutlineOutlined fontSize="small" /></IconButton>}
         </Box>
      </CardActions>
    </Card>
  );
};

export default NoteCard;
