import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import * as Yup from 'yup';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      await LoginSchema.validate({ email, password }, { abortEarly: false });
      setErrors({ email: '', password: '' });
      // Login logic would go here
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors = { email: '', password: '' };
        err.inner.forEach(error => {
          if (error.path === 'email') newErrors.email = error.message;
          if (error.path === 'password') newErrors.password = error.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-[#f8f9fa] justify-center">
        {/* Background Gradient */}
        <View className="absolute top-0 left-0 right-0 h-2/5 bg-gradient-to-b from-[#6366f1] to-[#8b5cf6] rounded-b-[40px]" />
        
        {/* Login Card */}
        <View className="mx-5 bg-white rounded-3xl p-8 shadow-lg shadow-[#6366f1]/20">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-[#6366f1]">Welcome Back</Text>
            <Text className="text-base text-gray-600 mt-2">Sign in to access your account</Text>
          </View>
          
          {/* Form */}
          <View className="w-full">
            {/* Email Input */}
            <View className="mb-5">
              <View className={`flex-row items-center h-14 px-4 bg-gray-50 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'}`}>
                <MaterialIcons name="email" size={20} color="#9ca3af" style={styles.icon} />
                <TextInput
                  className="flex-1 text-gray-800 ml-2"
                  onChangeText={setEmail}
                  value={email}
                  placeholder="Enter Email"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <View className={`flex-row items-center h-14 px-4 bg-gray-50 rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-200'}`}>
                <Ionicons name="lock-closed" size={20} color="#9ca3af" style={styles.icon} />
                <TextInput
                  className="flex-1 text-gray-800 ml-2"
                  onChangeText={setPassword}
                  value={password}
                  placeholder="Enter Password"
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

            {/* Login Button */}
            <TouchableOpacity 
              className="h-14 bg-[#6366f1] rounded-xl items-center justify-center shadow-md shadow-[#6366f1]/30 mt-2"
              onPress={handleSubmit}
            >
              <Text className="text-white text-lg font-bold">Sign In</Text>
            </TouchableOpacity>

            {/* Footer Links */}
            <View className="mt-6 items-center">
              <TouchableOpacity className="mb-6">
                <Text className="text-[#6366f1] text-sm font-semibold">Forgot Password?</Text>
              </TouchableOpacity>
              
              <View className="flex-row">
                <Text className="text-gray-600 text-sm">Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text className="text-[#6366f1] text-sm font-semibold">Sign Up</Text>
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

export default Login;