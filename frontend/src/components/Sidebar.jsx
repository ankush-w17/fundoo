import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import { LightbulbOutlined, NotificationsNoneOutlined, EditOutlined, ArchiveOutlined, DeleteOutline } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const drawerWidth = 280;

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
    borderRadius: '0 25px 25px 0',
    paddingLeft: theme.spacing(3),
    backgroundColor: active ? '#feefc3' : 'transparent',
    '&:hover': {
        backgroundColor: '#f1f3f4',
    },
    cursor: 'pointer',
    marginBottom: '2px'
}));

const Sidebar = ({ open, onViewChange, currentView, labels = [], onEditLabels }) => {
  const defaultItems = [
    { text: 'Notes', icon: <LightbulbOutlined />, key: 'notes' },
    { text: 'Reminders', icon: <NotificationsNoneOutlined />, key: 'reminders' },
  ];

  const bottomItems = [
    { text: 'Edit labels', icon: <EditOutlined />, key: 'editLabels', action: onEditLabels },
    { text: 'Archive', icon: <ArchiveOutlined />, key: 'archive' },
    { text: 'Trash', icon: <DeleteOutline />, key: 'trash' },
  ];

  return (
    <Drawer
      variant={open ? "permanent" : "temporary"}
      sx={{
        width: open ? drawerWidth : 70,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        [`& .MuiDrawer-paper`]: { 
            width: open ? drawerWidth : 70, 
            boxSizing: 'border-box', 
            borderRight: 'none',
            top: '64px',
            height: 'calc(100% - 64px)',
            transition: 'width 0.2s',
            overflowX: 'hidden',
        },
      }}
      open={open}
    >
      <Box sx={{ overflow: 'hidden' }}>
        <List>
          {defaultItems.map((item) => (
            <StyledListItem 
                key={item.key} 
                active={currentView === item.key ? 1 : 0}
                onClick={() => onViewChange && onViewChange(item.key)}
            >
              <ListItemIcon sx={{ minWidth: '40px', color: '#202124', ml: 1 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{fontSize: '0.875rem', fontWeight: 500, color: '#202124'}} sx={{opacity: open ? 1 : 0}} />
            </StyledListItem>
          ))}

          {labels.map(label => (
             <StyledListItem 
                key={label._id} 
                active={currentView === `label/${label._id}` ? 1 : 0}
                onClick={() => onViewChange && onViewChange(`label/${label._id}`)}
            >
              <ListItemIcon sx={{ minWidth: '40px', color: '#202124', ml: 1 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24"><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16zM16 17H5V7h11l3.55 5L16 17z"></path></svg>
              </ListItemIcon>
              <ListItemText primary={label.name} primaryTypographyProps={{fontSize: '0.875rem', fontWeight: 500, color: '#202124'}} sx={{opacity: open ? 1 : 0}} />
            </StyledListItem>
          ))}

          {bottomItems.map((item) => (
            <StyledListItem 
                key={item.key} 
                active={currentView === item.key ? 1 : 0}
                onClick={() => {
                    if (item.action) item.action();
                    else onViewChange && onViewChange(item.key);
                }}
            >
              <ListItemIcon sx={{ minWidth: '40px', color: '#202124', ml: 1 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{fontSize: '0.875rem', fontWeight: 500, color: '#202124'}} sx={{opacity: open ? 1 : 0}} />
            </StyledListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
