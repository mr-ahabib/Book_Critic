import API from './axiosInstance';  

export const fetchTopReviews = async (page = 1, limit = 10) => {
  const response = await API.get('/reviews/top', {
    params: { page, limit },
  });
  return response.data;
};