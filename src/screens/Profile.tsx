import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [errors, setErrors] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const userData = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'March 22, 2022',
    membership: 'Premium'
  };

  const validatePassword = () => {
    let valid = true;
    const newErrors = { current: '', new: '', confirm: '' };

    if (!passwordData.current) {
      newErrors.current = 'Current password is required';
      valid = false;
    }

    if (passwordData.new.length < 8) {
      newErrors.new = 'Password must be at least 8 characters';
      valid = false;
    } else if (!/\d/.test(passwordData.new)) {
      newErrors.new = 'Password requires a number';
      valid = false;
    } else if (!/[A-Z]/.test(passwordData.new)) {
      newErrors.new = 'Password requires an uppercase letter';
      valid = false;
    }

    if (passwordData.new !== passwordData.confirm) {
      newErrors.confirm = 'Passwords must match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handlePasswordChange = () => {
    if (validatePassword()) {
      console.log('Password changed:', passwordData);
      setModalVisible(false);
      setPasswordData({ current: '', new: '', confirm: '' });
    }
  };

  return (
    <View className="flex-1 bg-[#f0fdfa]">
      {/* Header with Linear Gradient */}
      <LinearGradient
        colors={['#0d9488', '#0891b2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-16 pb-5 px-6"
      >
        <View className="flex-row items-center">
          <FontAwesome name="user" size={24} color="white" />
          <Text className="text-white text-2xl font-bold ml-3">My Profile</Text>
        </View>
      </LinearGradient>

      {/* Profile Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Realistic User Card */}
        <View className="mx-5 mt-6 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <View className="bg-white p-5 items-center border-b border-gray-100">
            <View className="bg-[#0d9488]/10 p-4 rounded-full border-2 border-[#0d9488]/20">
              <Feather name="user" size={32} color="#0d9488" />
            </View>
            <Text className="text-gray-900 text-xl font-bold mt-3">{userData.name}</Text>
            <Text className="text-[#0d9488] text-sm font-medium mt-1">
              {userData.membership} Member
            </Text>
          </View>

          {/* Information Sections */}
          <View className="p-5 divide-y divide-gray-100">
            <View className="py-4 flex-row items-start">
              <View className="bg-[#0d9488]/10 p-2 rounded-lg mr-4">
                <Feather name="user" size={18} color="#0d9488" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs">FULL NAME</Text>
                <Text className="text-gray-900 text-base mt-1">{userData.name}</Text>
              </View>
            </View>

            <View className="py-4 flex-row items-start">
              <View className="bg-[#0d9488]/10 p-2 rounded-lg mr-4">
                <Feather name="mail" size={18} color="#0d9488" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs">EMAIL ADDRESS</Text>
                <Text className="text-gray-900 text-base mt-1">{userData.email}</Text>
              </View>
            </View>

            <View className="py-4 flex-row items-start">
              <View className="bg-[#0d9488]/10 p-2 rounded-lg mr-4">
                <Feather name="phone" size={18} color="#0d9488" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs">PHONE NUMBER</Text>
                <Text className="text-gray-900 text-base mt-1">{userData.phone}</Text>
              </View>
            </View>

            <View className="py-4 flex-row items-start">
              <View className="bg-[#0d9488]/10 p-2 rounded-lg mr-4">
                <MaterialCommunityIcons name="calendar-account" size={18} color="#0d9488" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs">MEMBER SINCE</Text>
                <Text className="text-gray-900 text-base mt-1">{userData.joinDate}</Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <View className="px-5 pb-5">
            <TouchableOpacity
              className="flex-row items-center justify-center py-3 bg-[#0d9488] rounded-lg"
              onPress={() => setModalVisible(true)}
            >
              <Feather name="lock" size={18} color="white" />
              <Text className="text-white font-medium ml-2">Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Password Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl w-11/12 max-w-md overflow-hidden">
            {/* Modal Header with Gradient */}
            <LinearGradient
              colors={['#0d9488', '#0891b2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-5"
            >
              <Text className="text-white text-lg font-semibold">Change Password</Text>
            </LinearGradient>

            {/* Modal Content */}
            <View className="p-5">
              <View className="mb-4">
                <Text className="text-gray-600 text-sm mb-1">Current Password</Text>
                <TextInput
                  className={`border ${errors.current ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3`}
                  secureTextEntry
                  value={passwordData.current}
                  onChangeText={(text) => setPasswordData({...passwordData, current: text})}
                  placeholder="Enter current password"
                />
                {errors.current && <Text className="text-red-500 text-xs mt-1">{errors.current}</Text>}
              </View>

              <View className="mb-4">
                <Text className="text-gray-600 text-sm mb-1">New Password</Text>
                <TextInput
                  className={`border ${errors.new ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3`}
                  secureTextEntry
                  value={passwordData.new}
                  onChangeText={(text) => setPasswordData({...passwordData, new: text})}
                  placeholder="Enter new password"
                />
                {errors.new && <Text className="text-red-500 text-xs mt-1">{errors.new}</Text>}
              </View>

              <View className="mb-6">
                <Text className="text-gray-600 text-sm mb-1">Confirm Password</Text>
                <TextInput
                  className={`border ${errors.confirm ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3`}
                  secureTextEntry
                  value={passwordData.confirm}
                  onChangeText={(text) => setPasswordData({...passwordData, confirm: text})}
                  placeholder="Confirm new password"
                />
                {errors.confirm && <Text className="text-red-500 text-xs mt-1">{errors.confirm}</Text>}
              </View>

              <View className="flex-row justify-end space-x-3">
                <Pressable
                  className="px-4 py-2 rounded-lg border border-gray-300"
                  onPress={() => {
                    setModalVisible(false);
                    setErrors({ current: '', new: '', confirm: '' });
                  }}
                >
                  <Text className="text-gray-700">Cancel</Text>
                </Pressable>
                <Pressable
                  className="bg-[#0d9488] px-4 py-2 rounded-lg"
                  onPress={handlePasswordChange}
                >
                  <Text className="text-white">Update</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;