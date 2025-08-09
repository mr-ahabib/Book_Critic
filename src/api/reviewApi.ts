import API from './axiosInstance';  

export const fetchTopReviews = async (page = 1, limit = 10) => {
  const response = await API.get('/reviews/top', {
    params: { page, limit },
  });
  return response.data;
};

export const recentReview = async (page = 1, limit = 10) => {
  const response = await API.get('/reviews/recent', {
    params: { page, limit },
  });
  return response.data;
};

export const myReview = async (page = 1, limit = 10) => {
  const response = await API.get('/reviews/my', {
    params: { page, limit },
  });
  return response.data;
};


export const deleteReviewById  = async (id: number) => {
  const response = await API.delete(`/reviews/${id}`);
  return response.data;
};
