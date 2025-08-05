import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

interface ReviewCardProps {
  review: Review;
  onPress: () => void;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onCommentPress?: () => void;
}

export const ReviewCard = ({ 
  review, 
  onPress, 
  onUpvote, 
  onDownvote,
  onCommentPress
}: ReviewCardProps) => {
  return (
    <TouchableOpacity 
      className="bg-white rounded-xl p-4 mb-4 flex-row shadow-sm shadow-black/5 active:opacity-90"
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View className="mr-4">
        <Image 
          source={{ uri: review.cover }} 
          className="w-20 h-28 rounded-lg"
          resizeMode="cover"
        />
      </View>
      
      <View className="flex-1">
        <Text className="text-lg font-bold text-[#1e293b]">{review.title}</Text>
        <Text className="text-sm text-[#64748b]">by {review.author}</Text>
        
        <View className="flex-row my-2">
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < review.rating ? 'star' : 'star-outline'}
              size={16}
              color="#f59e0b"
            />
          ))}
        </View>
        
        <Text 
          className="text-sm text-[#475569] leading-5 mb-3"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {review.review}
        </Text>
        
        <View className="flex-row mb-3">
          <Text className="text-xs text-[#0d9488] font-medium mr-2">@{review.username}</Text>
          <Text className="text-xs text-[#94a3b8]">{review.date}</Text>
        </View>
        
        <View className="flex-row pt-3 border-t border-[#e2e8f0]">
          <TouchableOpacity 
            className="flex-row items-center mr-6"
            onPress={(e) => {
              e.stopPropagation();
              onUpvote?.();
            }}
          >
            <Ionicons 
              name="arrow-up" 
              size={20} 
              color={review.upvoted ? '#ef4444' : '#64748b'} 
            />
            <Text className={`ml-1 text-sm ${review.upvoted ? 'text-[#ef4444]' : 'text-[#64748b]'}`}>
              {review.upvotes}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center mr-6"
            onPress={(e) => {
              e.stopPropagation();
              onDownvote?.();
            }}
          >
            <Ionicons 
              name="arrow-down" 
              size={20} 
              color={review.downvoted ? '#ef4444' : '#64748b'} 
            />
            <Text className={`ml-1 text-sm ${review.downvoted ? 'text-[#ef4444]' : 'text-[#64748b]'}`}>
              {review.downvotes}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center"
            onPress={(e) => {
              e.stopPropagation();
              onCommentPress?.();
            }}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#64748b" />
            <Text className="ml-1 text-sm text-[#64748b]">{review.comments}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};