import api from './api';

export const getLeaderboard = async () => {
  const response = await api.get('/gamification/leaderboard/');
  return response.data;
};

export const getMyBadges = async () => {
  const response = await api.get('/gamification/my_badges/');
  return response.data;
};

export const getStoreItems = async () => {
  const response = await api.get('/gamification/store_items/');
  return response.data;
};

export const getMyPurchases = async () => {
  const response = await api.get('/gamification/my_purchases/');
  return response.data;
};

export const buyItem = async (itemId) => {
  const response = await api.post(`/gamification/buy_item/${itemId}/`);
  return response.data;
};

export const toggleEquipItem = async (itemId) => {
  const response = await api.post(`/gamification/${itemId}/toggle_equip/`);
  return response.data;
};

// Quizzes & Desafios API
export const getQuizzes = async (params = {}) => {
  const response = await api.get('/gamification/quizzes/', { params });
  return response.data;
};

export const createQuiz = async (quizData) => {
  const response = await api.post('/gamification/quizzes/', quizData);
  return response.data;
};

export const submitQuiz = async (quizId, answers) => {
  const response = await api.post(`/gamification/quizzes/${quizId}/submit/`, { answers });
  return response.data;
};

// Solicitação de Cargo Docente / Professor
export const getTeacherRequestStatus = async () => {
  const response = await api.get('/accounts/teacher-request/');
  return response.data;
};

export const submitTeacherRequest = async (payload) => {
  const response = await api.post('/accounts/teacher-request/', payload);
  return response.data;
};
