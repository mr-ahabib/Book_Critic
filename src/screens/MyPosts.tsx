import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

const MyPosts = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  // Initial data for user's posts
  const [myReviews, setMyReviews] = useState<Review[]>([
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
  ]);

  const handleVote = (id: number, type: 'up' | 'down') => {
    setMyReviews(myReviews.map(review => {
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
      reviewData: review,
    });
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setMyReviews(myReviews.filter(review => review.id !== id));
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#f0fdfa]">
      <Header title="My Posts" />
      
      {/* Reviews List */}
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 80 }}>
        {myReviews.map((review) => (
          <View key={review.id} className="mb-2">
            <ReviewCard 
              review={review}
              onPress={() => handleReviewPress(review)}
              onUpvote={() => handleVote(review.id, 'up')}
              onDownvote={() => handleVote(review.id, 'down')}
            />
            <TouchableOpacity 
              className="absolute top-2 right-2 bg-red-500 rounded-full p-2 z-10"
              onPress={() => handleDelete(review.id)}
            >
              <Ionicons name="trash-outline" size={18} color="white" />
            </TouchableOpacity>
          </View>
        ))}
        
        {myReviews.length === 0 && (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-gray-500 text-lg">You haven't posted any reviews yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MyPosts;