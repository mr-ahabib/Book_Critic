import { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { createReviewPost } from '../api/reviewPostApi'; 
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '~/api/axiosInstance';
const CreatePost = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

const [coverImage, setCoverImage] = useState<ImagePicker.ImageInfo | null>(null);
  const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [3, 4],
    quality: 1,
  });

  if (!result.canceled) {
    setCoverImage(result.assets[0]); 
  }
};

const handleSubmit = async () => {
  if (!coverImage) {
    alert('Please select a cover image');
    return;
  }

  try {
    const formData = new FormData();

    // Append text fields
    formData.append('title', title);
    formData.append('author', author);
    formData.append('genre', genre);
    formData.append('review', review);
    formData.append('rating', rating.toString());

    // Prepare the file object
    const uri = Platform.OS === 'android' ? coverImage.uri : coverImage.uri.replace('file://', '');
    const file = {
      uri,
      name: coverImage.fileName || `photo_${Date.now()}.jpg`,
      type: getMimeType(coverImage.uri),
    };

    // Append the file
    formData.append('coverUrl', file as any);

    // Call the API
    await createReviewPost(formData);

    // Clear the form fields here:
    setTitle('');
    setAuthor('');
    setGenre('');
    setReview('');
    setRating(0);
    setCoverImage(null);

    navigation.goBack();
  } catch (error) {
    console.error('Submission error:', error);
    alert('Failed to create review. Please try again.');
  }
};


const getMimeType = (uri: string) => {
  const extension = uri.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'gif': return 'image/gif';
    default: return 'image/jpeg';
  }
};


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-[#f0fdfa]">
        {/* Fixed Header with Submit Button */}
        <View className="bg-[#0d9488] shadow-md">
          <View className="flex-row items-center justify-between px-4 pt-14 pb-3">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="p-2"
            >
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-white">Create Review</Text>
            <TouchableOpacity
              className={`p-2 rounded-lg ${
                !title || !author || !review || !coverImage 
                  ? 'bg-gray-400' 
                  : 'bg-emerald-700'
              }`}
              onPress={() => {
    console.log('Button pressed');
    handleSubmit();
  }}
            >
              <Text className="text-lg font-bold text-white">
                Publish
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Content Area - Will automatically fit remaining space */}
        <View className="flex-1 px-5 pt-3">
          {/* Cover Image Upload */}
          <View className="mb-4 bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-md font-semibold text-[#0d9488] mb-3">Book Cover*</Text>
            <TouchableOpacity 
              className="items-center justify-center h-40 rounded-lg bg-[#f0fdfa] border-2 border-dashed border-[#0d9488]"
              onPress={pickImage}
            >
              {coverImage ? (
  <Image 
    source={{ uri: coverImage.uri }} 
    className="w-full h-full rounded-lg"
    resizeMode="cover"
  />
) : (
  <View className="items-center p-4">
    <MaterialIcons name="add-a-photo" size={32} color="#0d9488" />
    <Text className="mt-2 text-[#0d9488] font-medium text-center">
      Tap to add book cover
    </Text>
    <Text className="text-xs text-[#0d9488]/70 mt-1">(3:4 aspect ratio recommended)</Text>
  </View>
)}

            </TouchableOpacity>
          </View>

          {/* Book Details */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-md font-semibold text-[#0d9488] mb-3">Book Details</Text>
            
            <View className="mb-3">
              <Text className="text-sm font-medium text-[#0d9488] mb-1">Title*</Text>
              <TextInput
                className="bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0]"
                placeholder="The Silent Patient"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View className="mb-3">
              <Text className="text-sm font-medium text-[#0d9488] mb-1">Author*</Text>
              <TextInput
                className="bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0]"
                placeholder="Alex Michaelides"
                value={author}
                onChangeText={setAuthor}
              />
            </View>

            <View className="mb-2">
              <Text className="text-sm font-medium text-[#0d9488] mb-1">Genre</Text>
              <TextInput
                className="bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0]"
                placeholder="Psychological Thriller"
                value={genre}
                onChangeText={setGenre}
              />
            </View>
          </View>

          {/* Rating */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-md font-semibold text-[#0d9488] mb-3">Your Rating*</Text>
            <View className="flex-row justify-center mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity 
                  key={star} 
                  onPress={() => setRating(star)}
                  onPressIn={() => setHoverRating(star)}
                  onPressOut={() => setHoverRating(0)}
                  activeOpacity={0.7}
                  className="mx-1"
                >
                  <Ionicons
                    name={star <= (hoverRating || rating) ? 'star' : 'star-outline'}
                    size={32}
                    color={star <= (hoverRating || rating) ? '#f59e0b' : '#cbd5e1'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-center text-sm text-[#64748b]">
              {rating > 0 ? `You rated this ${rating} star${rating > 1 ? 's' : ''}` : 'Tap to rate'}
            </Text>
          </View>

          {/* Review */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-md font-semibold text-[#0d9488] mb-3">Your Review*</Text>
            <TextInput
              className="bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0] h-32 text-align-top"
              placeholder="Share your thoughts about the book..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={review}
              onChangeText={setReview}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreatePost;