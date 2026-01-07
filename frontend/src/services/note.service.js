import api from './api';

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

export const archiveNote = async (id) => {
    // Assuming backend has an archive endpoint or uses update
    // Checking backend code would confirm, but usually it's an update isArchived: true
    const response = await api.put(`/notes/${id}/archive`); 
    return response.data;
};

export const trashNote = async (id) => {
    // Soft delete (move to trash)
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

export const getTrashNotes = async () => {
    const response = await api.get('/notes/trash');
    return response.data;
};

export const getArchivedNotes = async () => {
    const response = await api.get('/notes/archived');
    return response.data;
};

export const addLabelToNote = async (noteId, labelId) => {
    const response = await api.post(`/notes/${noteId}/labels`, { labelId });
    return response.data;
};

export const removeLabelFromNote = async (noteId, labelId) => {
    const response = await api.delete(`/notes/${noteId}/labels/${labelId}`);
    return response.data;
};

export const getNotesByLabel = async (labelId) => {
    const response = await api.get(`/notes/label/${labelId}`);
    return response.data;
};

