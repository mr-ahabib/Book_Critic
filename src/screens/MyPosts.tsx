import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { ReviewCard } from '../components/ReviewCard';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { myReview, deleteReviewById } from '../api/reviewApi';
import { getCommentCountByReviewId } from '../api/commentApi';
import { getVoteCountByReviewId, voteOnReview } from '../api/voteApi'; // Import vote count API here
import { Review } from '../types/review';

const PAGE_LIMIT = 10;

const MyPosts = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMyReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await myReview(page, PAGE_LIMIT);

      // Fetch comment counts in parallel
      const reviewsWithComments = await Promise.all(
        data.map(async (item: any) => {
          let commentCount = 0;
          try {
            const res = await getCommentCountByReviewId(item.id);
            commentCount = res.totalComments ?? 0;
          } catch (error) {
            console.error(`Failed to get comment count for review ${item.id}`, error);
          }

          // Also fetch vote counts and user vote status for each review
          let voteData;
          try {
            voteData = await getVoteCountByReviewId(item.id);
          } catch (error) {
            console.error(`Failed to get vote count for review ${item.id}`, error);
            voteData = { upvotes: 0, downvotes: 0, userVote: null };
          }

          return {
            id: item.id,
            cover: `http://192.168.0.109:8080${item.coverUrl}`,
            title: item.title,
            author: item.author,
            rating: item.rating,
            review: item.review,
            username: item.userName,
            date: new Date(item.createdAt).toLocaleDateString(),
            upvotes: voteData.upvotes ?? 0,
            downvotes: voteData.downvotes ?? 0,
            comments: commentCount,
            upvoted: voteData.userVote === 'upvote',
            downvoted: voteData.userVote === 'downvote',
          };
        })
      );

      setMyReviews(prev => (page === 1 ? reviewsWithComments : [...prev, ...reviewsWithComments]));
      setHasMore(reviewsWithComments.length >= PAGE_LIMIT);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!loading && hasMore) {
      loadMyReviews();
    }
  }, [page, loadMyReviews]);

  const handleVote = async (id: number, type: 'up' | 'down') => {
    try {
      const voteType = type === 'up' ? 'upvote' : 'downvote';

      // Register vote
      await voteOnReview(id, voteType);

      // Fetch updated vote counts and current user vote from backend
      const voteData = await getVoteCountByReviewId(id);

      setMyReviews(prevReviews =>
        prevReviews.map(review => {
          if (review.id === id) {
            return {
              ...review,
              upvotes: voteData.upvotes ?? review.upvotes,
              downvotes: voteData.downvotes ?? review.downvotes,
              upvoted: voteData.userVote === 'upvote',
              downvoted: voteData.userVote === 'downvote',
            };
          }
          return review;
        })
      );
    } catch (error) {
      console.error('Vote API failed:', error);
      Alert.alert('Error', 'Failed to register vote. Please try again.');
    }
  };

  const handleReviewPress = (review: Review) => {
    navigation.navigate('ReviewDetails', {
      reviewId: review.id,
      reviewData: review,
    });
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteReviewById(id);
              setMyReviews(prevReviews => prevReviews.filter(review => review.id !== id));
              Alert.alert('Success', 'Review deleted successfully.');
            } catch (error) {
              console.error('Failed to delete review:', error);
              Alert.alert('Error', 'Failed to delete review. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <View className="flex-1 bg-[#f0fdfa]">
      <Header title="My Posts" />

      {myReviews.length === 0 && !loading ? (
        <View className="flex-1 items-center justify-center mt-10">
          <Text className="text-gray-500 text-lg">You haven't posted any reviews yet</Text>
        </View>
      ) : (
        <FlatList
          data={myReviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mb-2">
              <ReviewCard
                review={item}
                onPress={() => handleReviewPress(item)}
                onUpvote={() => handleVote(item.id, 'up')}
                onDownvote={() => handleVote(item.id, 'down')}
              />
              <TouchableOpacity
                className="absolute top-2 right-2 bg-red-500 rounded-full p-2 z-10"
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator size="small" color="#0d9488" /> : null}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MyPosts;
