import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { ReviewCard } from '../components/ReviewCard';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

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

const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
  
  // Initial data for both tabs
  const initialPopularReviews: Review[] = [
    {
      id: 1,
      cover: 'https://m.media-amazon.com/images/I/71tR2ZEQ2JL._AC_UF1000,1000_QL80_.jpg',
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      rating: 4,
      review: 'A psychological thriller that will keep you guessing until the very last page.',
      username: 'bookworm42',
      date: '2 days ago',
      upvotes: 24,
      downvotes: 3,
      comments: 8,
      upvoted: false,
      downvoted: false
    },
    {
      id: 2,
      cover: 'https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UF1000,1000_QL80_.jpg',
      title: 'Atomic Habits',
      author: 'James Clear',
      rating: 5,
      review: 'Transform your life with tiny changes in behavior that lead to remarkable results.',
      username: 'habitmaster',
      date: '1 week ago',
      upvotes: 56,
      downvotes: 2,
      comments: 12,
      upvoted: false,
      downvoted: false
    }
  ];

  const initialRecentReviews: Review[] = [
    {
      id: 3,
      cover: 'https://m.media-amazon.com/images/I/71PNGYHykrL._AC_UF1000,1000_QL80_.jpg',
      title: 'Educated',
      author: 'Tara Westover',
      rating: 4,
      review: 'A memoir about the transformative power of education and self-invention.',
      username: 'readerlove',
      date: '1 hour ago',
      upvotes: 8,
      downvotes: 0,
      comments: 3,
      upvoted: false,
      downvoted: false
    },
    {
      id: 4,
      cover: 'https://m.media-amazon.com/images/I/71X1p4TGlxL._AC_UF1000,1000_QL80_.jpg',
      title: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      rating: 4,
      review: 'A hauntingly beautiful novel about an isolated girl who becomes a murder suspect.',
      username: 'naturelover',
      date: '3 hours ago',
      upvotes: 15,
      downvotes: 1,
      comments: 5,
      upvoted: false,
      downvoted: false
    }
  ];

  // State for reviews
  const [popularReviews, setPopularReviews] = useState<Review[]>(initialPopularReviews);
  const [recentReviews, setRecentReviews] = useState<Review[]>(initialRecentReviews);

  const handleVote = (id: number, type: 'up' | 'down') => {
    const updateReviews = (reviews: Review[]) => 
      reviews.map(review => {
        if (review.id === id) {
          return type === 'up' 
            ? {
                ...review,
                upvotes: review.upvoted ? review.upvotes - 1 : review.upvotes + 1,
                downvotes: review.downvoted ? review.downvotes - 1 : review.downvotes,
                upvoted: !review.upvoted,
                downvoted: false
              }
            : {
                ...review,
                downvotes: review.downvoted ? review.downvotes - 1 : review.downvotes + 1,
                upvotes: review.upvoted ? review.upvotes - 1 : review.upvotes,
                downvoted: !review.downvoted,
                upvoted: false
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

  return (
    <View className="flex-1 bg-[#f0fdfa]">
      <Header />
      
      {/* Tabs */}
      <View className="flex-row px-4 mt-4 mb-2">
        <TouchableOpacity 
          className={`flex-1 items-center py-3 rounded-l-lg ${activeTab === 'popular' ? 'bg-[#0d9488]' : 'bg-white border border-[#0d9488]'}`}
          onPress={() => setActiveTab('popular')}
        >
          <View className="flex-row items-center">
            <Ionicons 
              name="trending-up" 
              size={20} 
              color={activeTab === 'popular' ? 'white' : '#0d9488'} 
            />
            <Text className={`ml-1.5 text-sm font-semibold ${activeTab === 'popular' ? 'text-white' : 'text-[#0d9488]'}`}>
              Popular
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-1 items-center py-3 rounded-r-lg ${activeTab === 'recent' ? 'bg-[#0d9488]' : 'bg-white border border-[#0d9488]'}`}
          onPress={() => setActiveTab('recent')}
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons 
              name="clock-outline" 
              size={20} 
              color={activeTab === 'recent' ? 'white' : '#0d9488'} 
            />
            <Text className={`ml-1.5 text-sm font-semibold ${activeTab === 'recent' ? 'text-white' : 'text-[#0d9488]'}`}>
              Recent
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 80 }}>
        {currentReviews.map((review) => (
          <ReviewCard 
            key={review.id} 
            review={review}
            onPress={() => handleReviewPress(review)}
            onUpvote={() => handleVote(review.id, 'up')}
            onDownvote={() => handleVote(review.id, 'down')}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;