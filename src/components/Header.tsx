import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const Header = ({ title = 'Book Critic', showSearch = true }) => {
  return (
    <LinearGradient
      colors={['#0d9488', '#0891b2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="pt-12 pb-5 px-4 rounded-b-3xl"
    >
      <View className="mt-2">
        <View className="flex-row items-center mb-4">
          <FontAwesome name="book" size={28} color="#fff" />
          <Text className="text-white text-2xl font-bold ml-2">{title}</Text>
        </View>
        
        {showSearch && (
          <View className="flex-row items-center bg-white rounded-xl px-3 h-12">
            <TextInput
              placeholder="Search reviews..."
              placeholderTextColor="#94a3b8"
              className="flex-1 h-full text-base"
            />
            <MaterialIcons name="filter-list" size={24} color="#64748b" className="ml-2" />
          </View>
        )}
      </View>
    </LinearGradient>
  );
};