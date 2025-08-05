// screens/ReviewDetails.tsx
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
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

type ReviewDetailsRouteProp = RouteProp<RootStackParamList, 'ReviewDetails'>;

const ReviewDetails = ({ route }: { route: ReviewDetailsRouteProp }) => {
  const { reviewData } = route.params as unknown as { reviewData: Review };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row mb-4">
        <Image 
          source={{ uri: reviewData.cover }} 
          className="w-24 h-36 rounded-lg"
          resizeMode="cover"
        />
        <View className="ml-4 flex-1">
          <Text className="text-2xl font-bold text-[#1e293b]">{reviewData.title}</Text>
          <Text className="text-lg text-[#64748b]">by {reviewData.author}</Text>
          <View className="flex-row mt-2">
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < reviewData.rating ? 'star' : 'star-outline'}
                size={20}
                color="#f59e0b"
              />
            ))}
          </View>
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-base text-[#475569] leading-6">
          {reviewData.review}
        </Text>
      </View>

      <View className="border-t border-[#e2e8f0] pt-4">
        <Text className="text-sm text-[#64748b]">
          Posted by @{reviewData.username} • {reviewData.date}
        </Text>
      </View>
    </ScrollView>
  );
};

export default ReviewDetails;