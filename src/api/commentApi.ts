import API from './axiosInstance'; 

export const createComment = async (reviewId: number, commentText: string) => {
  const response = await API.post(`/create-comment/${reviewId}`, { comment: commentText });
  return response.data;
};

export const getCommentsByReviewId = async (reviewId: number) => {
  const response = await API.get(`/comments/${reviewId}`);
  return response.data;
};



export const getCommentCountByReviewId = async (reviewId: number) => {
  const response = await API.get(`/count-comments/${reviewId}`);
  return response.data; 
};
