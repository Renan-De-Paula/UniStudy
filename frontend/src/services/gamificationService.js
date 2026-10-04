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

export const buyItem = async (itemId) => {
  const response = await api.post(`/gamification/buy_item/${itemId}/`);
  return response.data;
};
