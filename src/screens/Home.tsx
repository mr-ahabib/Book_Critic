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
  const [activeTab, setActiveTab] = useState('popular');
  
  const [reviews, setReviews] = useState<Review[]>([
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
      id: 3,
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
      id: 4,
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
  ]);

  const handleVote = (id: number, type: 'up' | 'down') => {
    setReviews(reviews.map(review => {
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
    }));
  };

  const handleReviewPress = (review: Review) => {
    navigation.navigate('ReviewDetails', { 
      reviewId: review.id,
      reviewData: review 
    });
  };

  const navigateToRecent = () => {
    navigation.navigate('RecentReviews');
  };

  return (
    <View className="flex-1 bg-[#f0fdfa]">
      <Header />
      
      <View className="flex-row px-4 mt-4 mb-2">
        <TouchableOpacity 
          className={`flex-row items-center py-2 px-4 rounded-full mr-2 ${activeTab === 'popular' ? 'bg-[#5eead4]/20' : ''}`}
          onPress={() => setActiveTab('popular')}
        >
          <Ionicons name="trending-up" size={20} color="#0d9488" />
          <Text className="ml-1.5 text-sm text-[#0d9488] font-semibold">
            Popular
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-row items-center py-2 px-4 rounded-full ${activeTab === 'recent' ? 'bg-[#5eead4]/20' : ''}`}
          onPress={navigateToRecent}
        >
          <MaterialCommunityIcons name="clock-outline" size={20} color="#0d9488" />
          <Text className="ml-1.5 text-sm text-[#0d9488] font-semibold">
            Recent
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 80 }}>
        {reviews.map((review) => (
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