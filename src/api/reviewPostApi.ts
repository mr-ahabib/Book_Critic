import API from './axiosInstance';

export const createReviewPost = async (formData: FormData) => {
  try {
    const response = await API.post('/create-review-post', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating review post:', error);
    throw error;
  }
};