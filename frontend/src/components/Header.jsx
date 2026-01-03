import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, InputBase, Avatar } from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon, Refresh, ViewStream, Settings, Apps } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 8,
  backgroundColor: '#f1f3f4',
  '&:hover': {
    backgroundColor: '#eceef0',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
    maxWidth: '720px',
    flexGrow: 1,
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#5f6368',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    color: '#3c4043',
  },
}));

const Header = ({ handleDrawerToggle }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#ffffff', color: '#5f6368', boxShadow: 'inset 0 -1px 0 0 #dadce0' }} elevation={0}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ display: 'flex', alignItems: 'center', width: '230px' }}>
          <img src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" alt="logo" style={{height: '40px', marginRight: '8px'}} />
          <span style={{color: '#5f6368', fontSize: '22px', fontWeight: 400}}>Fundoo</span>
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
         <Box sx={{ flexGrow: 1 }} />
         <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="large" color="inherit">
                <Refresh />
            </IconButton>
            <IconButton size="large" color="inherit">
                <ViewStream />
            </IconButton>
            <IconButton size="large" color="inherit">
                <Settings />
            </IconButton>
         </Box>
         <Box sx={{ ml: 2, mr: 1 }}>
            <IconButton size="large" color="inherit">
                <Apps />
            </IconButton>
         </Box>
         <Avatar sx={{ bgcolor: '#ffa500', width: 32, height: 32 }}>A</Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
