import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import * as Yup from 'yup';
import { MaterialIcons, Ionicons, FontAwesome, Feather } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const Register = () => {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      await RegisterSchema.validate(
        { name, email, phone, password, confirmPassword },
        { abortEarly: false }
      );
      setErrors({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      // Registration logic would go here
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors = {
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: ''
        };
        err.inner.forEach(error => {
          if (error.path) {
            newErrors[error.path as keyof typeof newErrors] = error.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-[#f8f9fa] justify-center">
        {/* Background Gradient */}
        <View className="absolute top-0 left-0 right-0 h-2/5 bg-gradient-to-b from-[#6366f1] to-[#8b5cf6] rounded-b-[40px]" />
        
        {/* Register Card */}
        <View className="mx-5 bg-white rounded-3xl p-8 shadow-lg shadow-[#6366f1]/20">
          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-3xl font-bold text-[#6366f1]">Create Account</Text>
            <Text className="text-base text-gray-600 mt-2">Join us to get started</Text>
          </View>
          
          {/* Form */}
          <View className="w-full">
            {/* Name Input */}
            <View className="mb-4">
              <View className={`flex-row items-center h-14 px-4 bg-gray-50 rounded-xl border ${errors.name ? 'border-red-400' : 'border-gray-200'}`}>
                <FontAwesome name="user" size={18} color="#9ca3af" style={styles.icon} />
                <TextInput
                  className="flex-1 text-gray-800 ml-2"
                  onChangeText={setName}
                  value={name}
                  placeholder="Full Name"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="words"
                />
              </View>
              {errors.name && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.name}</Text>
              )}
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <View className={`flex-row items-center h-14 px-4 bg-gray-50 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'}`}>
                <MaterialIcons name="email" size={20} color="#9ca3af" style={styles.icon} />
                <TextInput
                  className="flex-1 text-gray-800 ml-2"
                  onChangeText={setEmail}
                  value={email}
                  placeholder="Email Address"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email}</Text>
              )}
            </View>

            {/* Phone Input */}
            <View className="mb-4">
              <View className={`flex-row items-center h-14 px-4 bg-gray-50 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}>
                <Feather name="phone" size={20} color="#9ca3af" style={styles.icon} />
                <TextInput
                  className="flex-1 text-gray-800 ml-2"
                  onChangeText={setPhone}
                  value={phone}
                  placeholder="Phone Number"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</Text>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <View className={`flex-row items-center h-14 px-4 bg-gray-50 rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-200'}`}>
                <Ionicons name="lock-closed" size={20} color="#9ca3af" style={styles.icon} />
                <TextInput
                  className="flex-1 text-gray-800 ml-2"
                  onChangeText={setPassword}
                  value={password}
                  placeholder="Password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={toggleShowPassword}>
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <View className={`flex-row items-center h-14 px-4 bg-gray-50 rounded-xl border ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'}`}>
                <Ionicons name="lock-closed" size={20} color="#9ca3af" style={styles.icon} />
                <TextInput
                  className="flex-1 text-gray-800 ml-2"
                  onChangeText={setConfirmPassword}
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={toggleShowConfirmPassword}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              className="h-14 bg-[#6366f1] rounded-xl items-center justify-center shadow-md shadow-[#6366f1]/30 mt-2"
              onPress={handleSubmit}
            >
              <Text className="text-white text-lg font-bold">Sign Up</Text>
            </TouchableOpacity>

            {/* Footer Links */}
            <View className="mt-6 items-center">
              <View className="flex-row">
                <Text className="text-gray-600 text-sm">Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text className="text-[#6366f1] text-sm font-semibold">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 8,
  },
});

export default Register;