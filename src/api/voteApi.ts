import API from './axiosInstance';

export const voteOnReview = async (reviewId: number, voteType: 'upvote' | 'downvote') => {
  const response = await API.post(`/vote/${reviewId}`, { voteType });
  return response.data;
};


export const getVoteCountByReviewId = async (reviewId: number) => {
  const response = await API.get(`/vote/count/${reviewId}`);
  return response.data; 
};