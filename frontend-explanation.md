# Fundoo App - Frontend Architecture (In-Depth)

## Overview
A **React-based note-taking application** styled after Google Keep, built with Vite and Material-UI (MUI). The frontend implements a single-page application (SPA) with client-side routing, JWT authentication, and a component-based architecture for managing notes with CRUD operations.

---

## Tech Stack

### **Core Framework**
- **React 19.2.0**: Modern React with hooks for state management and side effects
- **Vite 7.2.4**: Lightning-fast build tool with Hot Module Replacement (HMR)
- **JavaScript (ES6+)**: No TypeScript - uses modern JS features

### **UI & Styling**
- **Material-UI (MUI) v7.3.6**: Complete component library with customizable theme
- **@emotion/react & @emotion/styled**: CSS-in-JS solution for styled components
- **@mui/icons-material v7.3.6**: Icon library for Material Design icons

### **Routing & HTTP**
- **React Router DOM v7.11.0**: Client-side routing with protected routes
- **Axios 1.13.2**: Promise-based HTTP client with interceptors

### **Development Tools**
- **ESLint**: Code linting with React-specific rules
- **Vite Plugin React**: Fast refresh and JSX transformation

---

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TakeNote.jsx
│   │   └── NoteCard.jsx
│   ├── pages/          # Route-based page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Dashboard.jsx
│   ├── services/       # API service layer
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   └── note.service.js
│   ├── App.jsx         # Main app with routing
│   ├── App.css         # Global app styles
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global base styles
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

---

## Architecture Patterns

### **1. Service Layer Pattern**
API calls are abstracted into service modules, separating business logic from UI components.

```javascript
// services/note.service.js
export const getNotes = async () => {
  const response = await api.get('/notes');
  return response.data;
};
```

### **2. Container/Presentational Pattern**
- **Pages** (Dashboard, Login) - Container components with state and logic
- **Components** (NoteCard, Header) - Presentational components receiving props

### **3. Centralized HTTP Client**
Single Axios instance with request/response interceptors in `api.js`:
- Auto-injects JWT token from localStorage
- Handles base URL configuration
- Provides consistent error handling

---

## Component Deep Dive

### **1. App.jsx - Application Router**

**Purpose**: Root component managing application routing

**Key Features**:
- Defines 4 routes: `/login`, `/signup`, `/dashboard`, `/` (redirects to login)
- Uses `BrowserRouter` for client-side navigation
- Wraps entire app in routing context

**Code Structure**:
```jsx
<Router>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/" element={<Navigate to="/login" replace />} />
  </Routes>
</Router>
```

**Missing Features**: No route protection (users can access dashboard without login)

---

### **2. Pages - Authentication Flow**

#### **Login.jsx**

**State Management**:
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: '',
});
```

**Authentication Process**:
1. User submits email/password
2. Calls `login()` from auth service
3. Stores JWT token in `localStorage`
4. Navigates to `/dashboard` using `useNavigate()`

**Google-Style Branding**:
- Multi-colored "Fundoo" logo mimicking Google's color scheme
- Clean, minimal design with Material-UI Paper component

**Error Handling**: Basic `alert()` on failure (no validation feedback)

#### **Signup.jsx**
Similar structure to Login with additional fields (name, confirm password)

---

### **3. Dashboard.jsx - Main Application Hub**

**State Management**:
```javascript
const [open, setOpen] = useState(true);        // Sidebar toggle
const [notes, setNotes] = useState([]);        // Notes array
const [view, setView] = useState('notes');     // Current view
```

**Component Lifecycle**:
1. **Mount**: `useEffect` fetches notes based on current view
2. **View Change**: Re-fetches notes when `view` state changes
3. **User Actions**: Calls API methods and triggers re-fetch

**View Logic**:
```javascript
const fetchNotes = async () => {
  let data;
  if (view === 'trash') {
    data = await getTrashNotes();
  } else if (view === 'archive') {
    data = await getArchivedNotes();
  } else {
    data = await getNotes();
  }
  setNotes(data.data || data || []);
};
```

**Layout Structure**:
- Fixed Header (64px height)
- Collapsible Sidebar
- Main content area with conditional rendering:
  - `TakeNote` only shows in 'notes' view
  - Informational text in 'trash' view
  - Flexbox grid for note cards

**Action Handlers**:
```javascript
const handleNoteAction = async (action, id) => {
  if (action === 'archive') await archiveNote(id);
  else if (action === 'trash') await trashNote(id);
  else if (action === 'deleteForever') await deleteForever(id);
  else if (action === 'recover') await restoreNote(id);
  
  fetchNotes(); // Refresh after action
};
```

---

### **4. Header.jsx - Navigation Bar**

**Key Features**:
- **Menu Button**: Toggles sidebar visibility
- **Branding**: Google Keep logo + "Fundoo" text
- **Search Bar**: Styled with MUI's custom theme (currently non-functional)
- **Action Icons**: Refresh, View Toggle, Settings, Apps
- **User Avatar**: Placeholder avatar (hardcoded "A")

**Styling Technique - Styled Components**:
```javascript
const Search = styled('div')(({ theme }) => ({
  backgroundColor: '#f1f3f4',
  borderRadius: 8,
  '&:hover': {
    backgroundColor: '#eceef0',
  },
  maxWidth: '720px',
  flexGrow: 1,
}));
```

**Design Details**:
- White background with subtle bottom border
- Fixed positioning (stays on top during scroll)
- z-index above drawer for layering

---

### **5. Sidebar.jsx - Navigation Menu**

**Menu Items Configuration**:
```javascript
const menuItems = [
  { text: 'Notes', icon: <LightbulbOutlined />, key: 'notes' },
  { text: 'Reminders', icon: <NotificationsNoneOutlined />, key: 'reminders' },
  { text: 'Edit labels', icon: <EditOutlined />, key: 'labels' },
  { text: 'Archive', icon: <ArchiveOutlined />, key: 'archive' },
  { text: 'Trash', icon: <DeleteOutline />, key: 'trash' },
];
```

**Responsive Behavior**:
- **Open**: 280px wide with text labels
- **Collapsed**: 70px wide, icons only
- Smooth width transition (0.2s)

**Active State Indicator**:
```javascript
<StyledListItem active={currentView === item.key ? 1 : 0}>
```
- Yellow background (`#feefc3`) when active
- Rounded right corners for Google Keep feel

**Props**:
- `open`: Boolean controlling width
- `onViewChange`: Callback to update parent view state
- `currentView`: Current active view for highlighting

---

### **6. TakeNote.jsx - Note Creation Widget**

**State Management**:
```javascript
const [expanded, setExpanded] = useState(false);
const [note, setNote] = useState({ title: '', description: '' });
```

**UX Flow**:
1. **Collapsed State**: Shows placeholder "Take a note..." with icons
2. **Click**: Expands to show title field and action toolbar
3. **Input**: User types title/description
4. **Close**: Saves note and collapses back

**Click-Outside Detection**:
```javascript
useEffect(() => {
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);
```

**Note Creation Logic**:
```javascript
const handleClose = async () => {
  if (note.title.trim() || note.description.trim()) {
    await createNote(note);
    onNoteCreated(); // Callback to refresh parent
    setNote({ title: '', description: '' });
  }
  setExpanded(false);
};
```

**Action Toolbar** (when expanded):
- Add reminder, collaborator, color, image
- Archive, more options, undo, redo
- Most are UI placeholders (not functional)

**Styling**:
- 600px fixed width, centered
- Elevated Paper with custom shadow
- Smooth expand/collapse animation via `<Collapse>`

---

### **7. NoteCard.jsx - Individual Note Display**

**State**:
```javascript
const [isHovered, setIsHovered] = useState(false);
```

**Hover Behavior**:
- Actions toolbar hidden by default (opacity: 0)
- Shows on hover with smooth transition
- Enhanced shadow on hover

**Conditional Actions**:
```javascript
{!note.isTrash && (
  <IconButton onClick={() => onAction('archive', note._id)}>
    <ArchiveOutlined />
  </IconButton>
)}

{note.isTrash && (
  <>
    <IconButton onClick={() => onAction('recover', note._id)}>
      <RestoreFromTrashOutlined />
    </IconButton>
    <IconButton onClick={() => onAction('deleteForever', note._id)}>
      <DeleteForeverOutlined />
    </IconButton>
  </>
)}
```

**Design**:
- 240px fixed width
- Rounded corners (8px border radius)
- Flexbox for content alignment
- Pre-wrapped text for multi-line descriptions

---

## Service Layer Architecture

### **api.js - HTTP Client Configuration**

**Axios Instance**:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Request Interceptor**:
```javascript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

**Benefits**:
- Every request automatically includes JWT token
- Centralized error handling
- Easy to add response interceptors for refresh tokens

---

### **auth.service.js - Authentication APIs**

```javascript
export const signup = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};
```

**Endpoints**:
- `POST /api/users/register` - Create new user
- `POST /api/users/login` - Authenticate user

---

### **note.service.js - Note Operations**

**CRUD Operations**:
```javascript
export const getNotes = async () => {
  const response = await api.get('/notes');
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await api.post('/notes', noteData);
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};
```

**Special Operations**:
```javascript
export const archiveNote = async (id) => {
  const response = await api.put(`/notes/${id}/archive`);
  return response.data;
};

export const trashNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

export const restoreNote = async (id) => {
  const response = await api.post(`/notes/${id}/restore`);
  return response.data;
};

export const deleteForever = async (id) => {
  const response = await api.delete(`/notes/${id}/permanent`);
  return response.data;
};
```

**View-Specific Fetchers**:
```javascript
export const getTrashNotes = async () => {
  const response = await api.get('/notes/trash');
  return response.data;
};

export const getArchivedNotes = async () => {
  const response = await api.get('/notes/archived');
  return response.data;
};
```

---

## Data Flow & State Management

### **Authentication Flow**

```
1. User enters credentials in Login.jsx
2. handleSubmit() calls auth.service.login()
3. Service sends POST to /api/users/login
4. Backend validates and returns JWT token
5. Token stored in localStorage.setItem('token', data)
6. useNavigate() redirects to /dashboard
7. Subsequent API calls use token via interceptor
```

### **Note Creation Flow**

```
1. User clicks "Take a note..." in TakeNote.jsx
2. Component expands (setExpanded(true))
3. User types title/description
4. User clicks "Close" button
5. handleClose() calls createNote(note)
6. Service sends POST to /api/notes
7. Backend saves to MongoDB and returns new note
8. onNoteCreated() callback triggers Dashboard.fetchNotes()
9. Dashboard re-fetches all notes
10. Notes state updates, triggering re-render
11. New note appears in grid
```

### **View Switching Flow**

```
1. User clicks "Archive" in Sidebar
2. onClick handler calls onViewChange('archive')
3. Dashboard state updates: setView('archive')
4. useEffect dependency [view] triggers
5. fetchNotes() calls getArchivedNotes()
6. Backend returns only archived notes
7. setNotes() updates state
8. UI re-renders showing only archived notes
9. TakeNote widget hidden (conditional rendering)
```

---

## Styling Architecture

### **Material-UI Theme Integration**

**sx Prop Pattern**:
```jsx
<Box sx={{
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
  p: 3,
  borderRadius: 2
}}>
```

**Benefits**:
- Type-safe styling with theme access
- Responsive breakpoints: `[theme.breakpoints.up('sm')]`
- Shorthand props: `p` (padding), `m` (margin), `mt` (marginTop)

### **Emotion Styled Components**

Used for complex, reusable styles:

```javascript
const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: '0 25px 25px 0',
  paddingLeft: theme.spacing(3),
  backgroundColor: active ? '#feefc3' : 'transparent',
  '&:hover': {
    backgroundColor: '#f1f3f4',
  },
  cursor: 'pointer',
}));
```

### **Google Keep Color Palette**

- **Primary Background**: `#ffffff` (white)
- **Secondary Background**: `#f1f3f4` (light gray)
- **Active Highlight**: `#feefc3` (light yellow)
- **Text Primary**: `#202124` (near black)
- **Text Secondary**: `#5f6368` (gray)
- **Accent**: `#1a73e8` (Google blue)

---

## Key Features Explained

### **1. Collapsible Sidebar**

**MUI Drawer Configuration**:
```jsx
<Drawer
  variant={open ? "permanent" : "temporary"}
  sx={{
    width: open ? drawerWidth : 70,
    [`& .MuiDrawer-paper`]: {
      top: '64px',
      height: 'calc(100% - 64px)',
      transition: 'width 0.2s',
    },
  }}
>
```

- Permanent drawer when open (always visible)
- Temporary drawer when collapsed (can overlay)
- Smooth width animation
- Positioned below fixed header

### **2. Dynamic Note Grid**

**Flexbox Layout**:
```jsx
<Box sx={{
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,
  justifyContent: 'center',
  alignItems: 'flex-start'
}}>
  {notes.map((note) => (
    <NoteCard key={note._id} note={note} onAction={handleNoteAction} />
  ))}
</Box>
```

- Responsive wrapping
- Centered alignment
- Consistent 16px gaps (gap: 2 = 2 * 8px)

### **3. Search Bar Styling**

Custom styled component with theme integration:
```javascript
backgroundColor: '#f1f3f4',
'&:hover': {
  backgroundColor: '#eceef0',
},
```

- Subtle hover state change
- Integrated search icon
- Max-width on larger screens

---

## Missing Features & Limitations

### **Not Implemented**:
1. **Search Functionality** - UI exists but no filtering logic
2. **Reminders** - Menu item exists, no backend integration
3. **Labels/Tags** - No implementation
4. **Collaborators** - Backend may support, frontend doesn't
5. **Color Customization** - Icons present, no functionality
6. **Image Upload** - No file handling
7. **Note Editing** - Can only create/delete, not edit existing
8. **Route Protection** - Dashboard accessible without auth

### **Security Concerns**:
1. Token stored in localStorage (vulnerable to XSS)
2. No token expiration handling
3. No refresh token mechanism
4. Basic error handling (no validation feedback)

### **UX Improvements Needed**:
1. Loading states (no spinners during API calls)
2. Error messages (using `alert()` instead of toast/snackbar)
3. Optimistic UI updates (waits for server response)
4. Confirmation dialogs (delete without warning)

---

## Performance Considerations

### **Current Optimizations**:
1. **Vite HMR**: Fast development rebuild
2. **Code Splitting**: React Router lazy loading (not implemented)
3. **Conditional Rendering**: Components mount only when needed

### **Potential Improvements**:
1. **React.memo()** on NoteCard to prevent unnecessary re-renders
2. **Pagination** - Currently loads all notes at once
3. **Lazy Loading** - Load notes as user scrolls
4. **Debounced Search** - Throttle search input
5. **Service Worker** - Offline support with caching

---

## Development Workflow

### **Running the App**:
```bash
npm run dev      # Start Vite dev server on port 5173
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### **Environment Variables**:
Currently hardcoded in `api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

Should use `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Summary

The Fundoo frontend is a **well-structured React SPA** that successfully replicates Google Keep's core UI/UX. It demonstrates:

✅ **Strengths**:
- Clean component architecture
- Material-UI integration
- Service layer abstraction
- Responsive design
- Google Keep visual fidelity

⚠️ **Areas for Improvement**:
- Complete missing features (search, edit, reminders)
- Add route protection
- Implement proper error handling
- Add loading states
- Optimize performance with pagination
- Improve security (HttpOnly cookies for tokens)

The codebase provides a solid foundation for a production note-taking app with room for feature expansion and refinement.
