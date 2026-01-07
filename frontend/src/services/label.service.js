import api from './api';

export const getLabels = async () => {
  const response = await api.get('/labels');
  return response.data;
};

export const createLabel = async (labelData) => {
  const response = await api.post('/labels', labelData);
  return response.data;
};

export const updateLabel = async (id, labelData) => {
  const response = await api.put(`/labels/${id}`, labelData);
  return response.data;
};

export const deleteLabel = async (id) => {
  const response = await api.delete(`/labels/${id}`);
  return response.data;
};
