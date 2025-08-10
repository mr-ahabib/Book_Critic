import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { ReviewCard } from '../components/ReviewCard';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { myReview, deleteReviewById } from '../api/reviewApi';
import { getCommentCountByReviewId } from '../api/commentApi';  // Import comment count API
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

          return {
            id: item.id,
            cover: `http://192.168.0.109:8080${item.coverUrl}`,
            title: item.title,
            author: item.author,
            rating: item.rating,
            review: item.review,
            username: item.userName,
            date: new Date(item.createdAt).toLocaleDateString(),
            upvotes: 0,
            downvotes: 0,
            comments: commentCount,  // <-- comment count here
            upvoted: false,
            downvoted: false,
          };
        })
      );

      setMyReviews(prev => (page === 1 ? reviewsWithComments : [...prev, ...reviewsWithComments]));
      setHasMore(reviewsWithComments.length >= PAGE_LIMIT);
    } catch (error) {
      console.error('Failed to fetch my reviews:', error);
      Alert.alert('Error', 'Could not load your reviews.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!loading && hasMore) {
      loadMyReviews();
    }
  }, [page, loadMyReviews]);

  const handleVote = (id: number, type: 'up' | 'down') => {
    setMyReviews(myReviews.map(review => {
      if (review.id === id) {
        return type === 'up'
          ? {
              ...review,
              upvotes: review.upvoted ? (review.upvotes || 0) - 1 : (review.upvotes || 0) + 1,
              downvotes: review.downvoted ? (review.downvotes || 0) - 1 : (review.downvotes || 0),
              upvoted: !review.upvoted,
              downvoted: false,
            }
          : {
              ...review,
              downvotes: review.downvoted ? (review.downvotes || 0) - 1 : (review.downvotes || 0) + 1,
              upvotes: review.upvoted ? (review.upvotes || 0) - 1 : (review.upvotes || 0),
              downvoted: !review.downvoted,
              upvoted: false,
            };
      }
      return review;
    }));
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
