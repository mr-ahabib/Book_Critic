import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { ReviewCard } from '../components/ReviewCard';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { Review } from '../types/review';
import { fetchTopReviews } from '../api/reviewApi';

const PAGE_LIMIT = 10;

const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');

  const [popularReviews, setPopularReviews] = useState<Review[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Reset pagination and reviews when tab changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    if (activeTab === 'popular') {
      setPopularReviews([]);
    } else {
      setRecentReviews([]);
    }
  }, [activeTab]);

  const loadReviews = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
    
      const data = await fetchTopReviews(page, PAGE_LIMIT);

      const mappedReviews = data.map((item: any) => ({
        id: item.id,
        cover: `http://192.168.0.109:8080${item.coverUrl}`, // update with your backend IP
        title: item.title,
        author: item.author,
        rating: item.rating,
        review: item.review,
        username: item.userName,
        date: new Date(item.createdAt).toLocaleDateString(),
        upvotes: 0,
        downvotes: 0,
        comments: 0,
        upvoted: false,
        downvoted: false,
      }));

      if (activeTab === 'popular') {
        setPopularReviews(prev => page === 1 ? mappedReviews : [...prev, ...mappedReviews]);
      } else {
        setRecentReviews(prev => page === 1 ? mappedReviews : [...prev, ...mappedReviews]);
      }

      // If fewer items than PAGE_LIMIT returned, no more pages
      if (mappedReviews.length < PAGE_LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, loading, hasMore]);

  // Load reviews when page or tab changes
  useEffect(() => {
    loadReviews();
  }, [page, activeTab, loadReviews]);

  const handleVote = (id: number, type: 'up' | 'down') => {
    const updateReviews = (reviews: Review[]) =>
      reviews.map(review => {
        if (review.id === id) {
          return type === 'up'
            ? {
                ...review,
                upvotes: review.upvoted ? review.upvotes! - 1 : review.upvotes! + 1,
                downvotes: review.downvoted ? review.downvotes! - 1 : review.downvotes!,
                upvoted: !review.upvoted,
                downvoted: false,
              }
            : {
                ...review,
                downvotes: review.downvoted ? review.downvotes! - 1 : review.downvotes! + 1,
                upvotes: review.upvoted ? review.upvotes! - 1 : review.upvotes!,
                downvoted: !review.downvoted,
                upvoted: false,
              };
        }
        return review;
      });

    setPopularReviews(updateReviews(popularReviews));
    setRecentReviews(updateReviews(recentReviews));
  };

  const handleReviewPress = (review: Review) => {
    navigation.navigate('ReviewDetails', {
      reviewId: review.id,
      reviewData: review,
    });
  };

  const currentReviews = activeTab === 'popular' ? popularReviews : recentReviews;

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <View className="flex-1 bg-[#f0fdfa]">
      <Header />

      {/* Tabs */}
      <View className="flex-row px-4 mt-4 mb-2">
        <TouchableOpacity
          className={`flex-1 items-center py-3 rounded-l-lg ${
            activeTab === 'popular' ? 'bg-[#0d9488]' : 'bg-white border border-[#0d9488]'
          }`}
          onPress={() => setActiveTab('popular')}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="trending-up"
              size={20}
              color={activeTab === 'popular' ? 'white' : '#0d9488'}
            />
            <Text
              className={`ml-1.5 text-sm font-semibold ${
                activeTab === 'popular' ? 'text-white' : 'text-[#0d9488]'
              }`}
            >
              Popular
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 items-center py-3 rounded-r-lg ${
            activeTab === 'recent' ? 'bg-[#0d9488]' : 'bg-white border border-[#0d9488]'
          }`}
          onPress={() => setActiveTab('recent')}
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color={activeTab === 'recent' ? 'white' : '#0d9488'}
            />
            <Text
              className={`ml-1.5 text-sm font-semibold ${
                activeTab === 'recent' ? 'text-white' : 'text-[#0d9488]'
              }`}
            >
              Recent
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      <FlatList
        data={currentReviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ReviewCard
            review={item}
            onPress={() => handleReviewPress(item)}
            onUpvote={() => handleVote(item.id, 'up')}
            onDownvote={() => handleVote(item.id, 'down')}
          />
        )}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="small" color="#0d9488" /> : null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;
