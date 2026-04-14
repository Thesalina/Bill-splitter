import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getGroups = () => api.get('/groups');
export const createGroup = (name) => api.post('/groups', { name });
export const updateGroup = (id, name) => api.put(`/groups/${id}`, { name });
export const deleteGroup = (id) => api.delete(`/groups/${id}`);

export const getMembers = (groupId) => api.get(`/members/${groupId}`);
export const addMember = (groupId, name) => api.post(`/members/${groupId}`, { name });
export const updateMember = (memberId, name) => api.put(`/members/${memberId}`, { name });
export const deleteMember = (memberId) => api.delete(`/members/${memberId}`);

export const getExpenses = (groupId) => api.get(`/expenses/${groupId}`);
export const addExpense = (groupId, data) => api.post(`/expenses/${groupId}`, data);
export const updateExpense = (expenseId, data) => api.put(`/expenses/${expenseId}`, data);
export const deleteExpense = (expenseId) => api.delete(`/expenses/${expenseId}`);

export const getSplit = (groupId) => api.get(`/split/${groupId}`);

export default api;
