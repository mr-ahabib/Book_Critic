import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { ReviewCard } from '../components/ReviewCard';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { Review } from '../types/review';
import { fetchTopReviews, recentReview } from '../api/reviewApi';
import { getCommentCountByReviewId } from '../api/commentApi';
import { voteOnReview, getVoteCountByReviewId } from '../api/voteApi';

const PAGE_LIMIT = 10;

const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [popularReviews, setPopularReviews] = useState<Review[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);

  // Caches for counts
  const [commentCountsCache, setCommentCountsCache] = useState<Record<number, number>>({});
  const [voteCountsCache, setVoteCountsCache] = useState<Record<number, { upvotes: number; downvotes: number }>>({});

  // Reset page and data on tab change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    if (activeTab === 'popular') {
      setPopularReviews([]);
    } else {
      setRecentReviews([]);
    }
  }, [activeTab]);

  // Load reviews when page or tab changes
  useEffect(() => {
    const loadReviews = async () => {
      if (loading || !hasMore) return;

      setLoading(true);

      try {
        let data: any[] = [];
        if (activeTab === 'popular') {
          data = await fetchTopReviews(page, PAGE_LIMIT);
        } else {
          data = await recentReview(page, PAGE_LIMIT);
        }

        if (!data || data.length === 0) {
          setHasMore(false);
          if (page === 1) {
            activeTab === 'popular' ? setPopularReviews([]) : setRecentReviews([]);
          }
          setLoading(false);
          return;
        }

        // Identify reviews missing comment counts
        const commentIdsToFetch = data
          .map(r => r.id)
          .filter(id => commentCountsCache[id] === undefined);

        // Fetch missing comment counts in parallel
        const newCommentCounts: Record<number, number> = {};
        await Promise.all(
          commentIdsToFetch.map(async id => {
            try {
              const res = await getCommentCountByReviewId(id);
              newCommentCounts[id] = res.totalComments ?? 0;
            } catch {
              newCommentCounts[id] = 0;
            }
          })
        );

        // Update comment counts cache once
        if (Object.keys(newCommentCounts).length > 0) {
          setCommentCountsCache(prev => ({ ...prev, ...newCommentCounts }));
        }

        // Identify reviews missing vote counts
        const voteIdsToFetch = data
          .map(r => r.id)
          .filter(id => voteCountsCache[id] === undefined);

        const newVoteCounts: Record<number, { upvotes: number; downvotes: number }> = {};
        await Promise.all(
          voteIdsToFetch.map(async id => {
            try {
              const res = await getVoteCountByReviewId(id);
              newVoteCounts[id] = {
                upvotes: res.upvotes ?? 0,
                downvotes: res.downvotes ?? 0,
              };
            } catch {
              newVoteCounts[id] = { upvotes: 0, downvotes: 0 };
            }
          })
        );

        // Update vote counts cache once
        if (Object.keys(newVoteCounts).length > 0) {
          setVoteCountsCache(prev => ({ ...prev, ...newVoteCounts }));
        }

        // Map reviews with cached counts
        const reviewsWithCounts: Review[] = data.map(item => {
          const commentCount = commentCountsCache[item.id] ?? newCommentCounts[item.id] ?? 0;
          const votes = voteCountsCache[item.id] ?? newVoteCounts[item.id] ?? { upvotes: 0, downvotes: 0 };

          return {
            id: item.id,
            cover: `http://192.168.0.109:8080${item.coverUrl}`,
            title: item.title,
            author: item.author,
            rating: item.rating,
            review: item.review,
            username: item.userName,
            date: new Date(item.createdAt).toLocaleDateString(),

            upvotes: votes.upvotes,
            downvotes: votes.downvotes,

            comments: commentCount,
            upvoted: false,
            downvoted: false,

            coverUrl: item.coverUrl,
            userName: item.userName,
            createdAt: item.createdAt,
          };
        });

        if (activeTab === 'popular') {
          setPopularReviews(prev => (page === 1 ? reviewsWithCounts : [...prev, ...reviewsWithCounts]));
        } else {
          setRecentReviews(prev => (page === 1 ? reviewsWithCounts : [...prev, ...reviewsWithCounts]));
        }

        setHasMore(reviewsWithCounts.length === PAGE_LIMIT);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        if (error.response?.status === 404) { // Check if error has a response property
          setHasMore(false);
        }
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [activeTab, page]);

  // Vote handler stays mostly same but update caches on success to keep vote counts consistent
  const handleVote = async (id: number, type: 'up' | 'down') => {
    try {
      const voteType = type === 'up' ? 'upvote' : 'downvote';
      const response = await voteOnReview(id, voteType);

      const upvotes = response.upvotes ?? 0;
      const downvotes = response.downvotes ?? 0;

      setVoteCountsCache(prev => ({
        ...prev,
        [id]: { upvotes, downvotes },
      }));

      const updateVotes = (reviews: Review[]) =>
        reviews.map(review => {
          if (review.id === id) {
            let upvoted = review.upvoted;
            let downvoted = review.downvoted;

            if (type === 'up') {
              upvoted = !upvoted;
              downvoted = false;
            } else {
              downvoted = !downvoted;
              upvoted = false;
            }

            return {
              ...review,
              upvotes,
              downvotes,
              upvoted,
              downvoted,
            };
          }
          return review;
        });

      setPopularReviews(updateVotes);
      setRecentReviews(updateVotes);
    } catch (error) {
      console.error('Vote API failed:', error);
    }
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
      {!loading && currentReviews.length === 0 ? (
        <View className="flex-1 items-center justify-center mt-10">
          <Text className="text-gray-500 text-lg">No reviews yet.</Text>
        </View>
      ) : (
        <FlatList
          data={currentReviews}
          keyExtractor={item => item.id.toString()}
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
      )}
    </View>
  );
};

export default Home;
