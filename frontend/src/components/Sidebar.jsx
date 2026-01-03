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

const Sidebar = ({ open, onViewChange, currentView }) => {
  const menuItems = [
    { text: 'Notes', icon: <LightbulbOutlined />, key: 'notes' },
    { text: 'Reminders', icon: <NotificationsNoneOutlined />, key: 'reminders' },
    { text: 'Edit labels', icon: <EditOutlined />, key: 'labels' },
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
          {menuItems.map((item) => (
            <StyledListItem 
                key={item.text} 
                active={currentView === item.key ? 1 : 0}
                onClick={() => onViewChange && onViewChange(item.key)}
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
