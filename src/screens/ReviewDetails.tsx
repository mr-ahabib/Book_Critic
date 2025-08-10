import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { LinearGradient } from 'expo-linear-gradient';

import { createComment, getCommentsByReviewId } from '../api/commentApi';

interface Review {
  id: number;
  cover: string;
  title: string;
  author: string;
  rating: number;
  review: string;
  username: string;
  date: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  upvoted?: boolean;
  downvoted?: boolean;
}

interface Comment {
  id: number;
  userName: string;
  comment: string;
  createdAt: string;
}

type ReviewDetailsRouteProp = RouteProp<RootStackParamList, 'ReviewDetails'>;

const ReviewDetails = () => {
  const route = useRoute<ReviewDetailsRouteProp>();
  const { reviewData } = route.params;

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [currentReview, setCurrentReview] = useState<Review>(reviewData as Review);

  // Load all comments without pagination
  const loadComments = async () => {
  setLoadingComments(true);
  try {
    const res = await getCommentsByReviewId(reviewData.id);
    if (Array.isArray(res.data)) {
      setComments(res.data);
    } else {
      setComments([]);
      console.warn('Expected array for comments but got:', res.data);
    }
  } catch (error) {
    console.error('Failed to load comments:', error);
  } finally {
    setLoadingComments(false);
  }
};


  useEffect(() => {
    loadComments();
  }, [reviewData.id]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await createComment(reviewData.id, comment.trim());
      setComment('');
      Keyboard.dismiss();
      await loadComments(); // reload fresh after posting new comment
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleVote = (type: 'up' | 'down') => {
    setCurrentReview((prev) => {
      if (type === 'up') {
        return {
          ...prev,
          upvotes: prev.upvoted ? prev.upvotes - 1 : prev.upvotes + 1,
          downvotes: prev.downvoted ? prev.downvotes - 1 : prev.downvotes,
          upvoted: !prev.upvoted,
          downvoted: false,
        };
      } else {
        return {
          ...prev,
          downvotes: prev.downvoted ? prev.downvotes - 1 : prev.downvotes + 1,
          upvotes: prev.upvoted ? prev.upvotes - 1 : prev.upvotes,
          downvoted: !prev.downvoted,
          upvoted: false,
        };
      }
    });
  };

  return (
    <View className="flex-1 bg-[#f0fdfa]">
      {/* Header with App Title */}
      <LinearGradient
        colors={['#0d9488', '#0891b2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-4 px-4"
      >
        <View className="flex-row items-center justify-center">
          <FontAwesome name="book" size={24} color="#fff" />
          <Text className="text-white text-xl font-bold ml-2">Book Critic</Text>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: keyboardHeight > 0 ? keyboardHeight + 70 : 70,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Review Card */}
          <View className="bg-white rounded-2xl p-6 mx-4 my-4 shadow-lg shadow-[#0d9488]/20">
            <View className="flex-row mb-5">
              <Image
                source={{ uri: currentReview.cover }}
                className="w-28 h-40 rounded-xl shadow-md"
                resizeMode="cover"
              />
              <View className="ml-5 flex-1">
                <Text className="text-2xl font-bold text-[#1e293b] mb-1">{currentReview.title}</Text>
                <Text className="text-base text-[#64748b] mb-3">by {currentReview.author}</Text>
                <View className="flex-row">
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < currentReview.rating ? 'star' : 'star-outline'}
                      size={20}
                      color="#f59e0b"
                      style={{ marginRight: 2 }}
                    />
                  ))}
                </View>
              </View>
            </View>

            <Text className="text-base text-[#475569] leading-6 mb-6">{currentReview.review}</Text>

            {/* Voting Actions */}
            <View className="flex-row justify-between items-center border-t border-[#e2e8f0] pt-4">
              <View className="flex-row">
                <TouchableOpacity
                  className="flex-row items-center mr-6"
                  onPress={() => handleVote('up')}
                >
                  <Ionicons
                    name="arrow-up"
                    size={24}
                    color={currentReview.upvoted ? '#ef4444' : '#64748b'}
                  />
                  <Text
                    className={`ml-1 text-base ${
                      currentReview.upvoted ? 'text-[#ef4444] font-semibold' : 'text-[#64748b]'
                    }`}
                  >
                    {currentReview.upvotes}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => handleVote('down')}
                >
                  <Ionicons
                    name="arrow-down"
                    size={24}
                    color={currentReview.downvoted ? '#ef4444' : '#64748b'}
                  />
                  <Text
                    className={`ml-1 text-base ${
                      currentReview.downvoted ? 'text-[#ef4444] font-semibold' : 'text-[#64748b]'
                    }`}
                  >
                    {currentReview.downvotes}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text className="text-sm text-[#64748b]">
                Posted by @{currentReview.username} • {currentReview.date}
              </Text>
            </View>
          </View>

          {/* Comments Section */}
          <View className="bg-white rounded-2xl p-6 mx-4 my-2 shadow-md shadow-[#0d9488]/10">
            <Text className="text-xl font-bold text-[#1e293b] mb-5">Comments ({comments.length})</Text>

            {loadingComments && <ActivityIndicator size="small" color="#0d9488" />}
            {!loadingComments && comments.length === 0 && (
              <Text className="text-[#64748b] text-center">No comments yet.</Text>
            )}

            {comments.map((c) => (
              <View key={c.id} className="pb-4 border-b border-[#e2e8f0] mb-4">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-sm font-semibold text-[#0d9488]">@{c.userName}</Text>
                  <Text className="text-xs text-[#94a3b8]">
                    {new Date(c.createdAt).toLocaleString()}
                  </Text>
                </View>
                <Text className="text-sm text-[#475569] leading-5">{c.comment}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Comment Input - Fixed at bottom */}
        <View
          className="px-4 pb-4 bg-white border-t border-[#e2e8f0]"
          style={{
            position: 'absolute',
            bottom: keyboardHeight > 0 ? keyboardHeight : 0,
            left: 0,
            right: 0,
          }}
        >
          <View className="bg-white rounded-full p-1 shadow-lg shadow-black/20 flex-row items-center">
            <TextInput
              className="flex-1 h-12 px-4 text-base"
              placeholder="Write a comment..."
              value={comment}
              onChangeText={setComment}
              onSubmitEditing={handleAddComment}
              returnKeyType="send"
            />
            <TouchableOpacity className="bg-[#0d9488] p-3 rounded-full" onPress={handleAddComment}>
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReviewDetails;
