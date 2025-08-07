import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, StyleSheet, Animated, Easing , Alert} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import * as Yup from 'yup';
import { MaterialIcons, Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import { signup } from '../api/authApi';
import { useDispatch } from 'react-redux';
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
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const spinValue = new Animated.Value(0);
  const scaleValue = new Animated.Value(1);
  const floatAnim = new Animated.Value(0);

  // All animations
  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(spinValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    spinAnimation.start();
    pulseAnimation.start();
    floatAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
      floatAnimation.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const float = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

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

    const response = await signup({ name, email, phone, password });
    Alert.alert('Registration successful', 'Please login to continue.');
    navigation.navigate('Login');

  } catch (err: any) {
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
    } else if (err.response) {
      Alert.alert('Registration Failed', err.response.data.message || 'Try again');
    } else {
      Alert.alert('Registration Failed', 'Something went wrong. Please try again.');
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
      <View className="flex-1 bg-[#f0fdfa] justify-center">
        {/* Background with multiple visual elements */}
        <View className="absolute top-0 left-0 right-0 h-2/5 bg-gradient-to-b from-[#0d9488] to-[#0891b2] rounded-b-[50px] overflow-hidden">
          {/* Floating book stack */}
          <Animated.View 
            className="absolute top-1/4 left-8 w-16 h-16 opacity-30"
            style={{ transform: [{ translateY: float }] }}
          >
            <FontAwesome name="book" size={64} color="#fff" />
          </Animated.View>
          
          {/* Floating quill pen */}
          <Animated.View 
            className="absolute top-1/3 right-10 w-12 h-12 opacity-40"
            style={{ transform: [{ translateY: Animated.multiply(float, -1) }] }}
          >
            <Feather name="feather" size={48} color="#fff" />
          </Animated.View>
          
          {/* Decorative elements */}
          <View className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#0f766e] opacity-20 rounded-full"></View>
          <View className="absolute -top-10 -left-10 w-36 h-36 bg-[#06b6d4] opacity-20 rounded-full"></View>
          
          {/* Small floating books */}
          <View className="absolute top-1/5 right-1/4 w-8 h-8 opacity-30">
            <FontAwesome name="book" size={32} color="#fff" />
          </View>
          <View className="absolute bottom-1/4 left-1/3 w-6 h-6 opacity-25">
            <FontAwesome name="book" size={24} color="#fff" />
          </View>
        </View>
        
        {/* Large Animated Book Logo */}
        <View className="absolute top-32 self-center z-10">
          <Animated.View style={{ transform: [{ rotateY: spin }, { scale: scaleValue }] }}>
            <FontAwesome name="book" size={90} color="#fff" />
          </Animated.View>
        </View>
        
        {/* Register Card */}
        <View className="mx-5 bg-white rounded-3xl p-8 shadow-lg shadow-[#0d9488]/30" style={styles.card}>
          {/* Header with decorative elements */}
          <View className="items-center mb-6 relative">
            <View className="absolute -top-6 -right-6 w-12 h-12">
              <FontAwesome name="bookmark" size={16} color="#0d9488" />
            </View>
            <View className="absolute -bottom-6 -left-6 w-12 h-12">
              <FontAwesome name="quote-left" size={16} color="#0d9488" />
            </View>
            <Text className="text-3xl font-bold text-[#0d9488]">Book Critic</Text>
            <Text className="text-base text-gray-600 mt-2">Start your reading adventure</Text>
          </View>
          
          {/* Form */}
          <View className="w-full">
            {/* Name Input */}
            <View className="mb-4">
              <View className={`flex-row items-center h-14 px-4 bg-gray-50 rounded-xl border ${errors.name ? 'border-red-400' : 'border-gray-200'}`}>
                <FontAwesome name="user" size={18} color="#64748b" style={styles.icon} />
                <TextInput
                  className="flex-1 text-gray-800 ml-2 font-medium"
                  onChangeText={setName}
                  value={name}
                  placeholder="Full Name"
                  placeholderTextColor="#94a3b8"
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
                <MaterialIcons name="email" size={20} color="#64748b" style={styles.icon} />
                <TextInput
                  className="flex-1 text-gray-800 ml-2 font-medium"
                  onChangeText={setEmail}
                  value={email}
                  placeholder="Reader@example.com"
                  placeholderTextColor="#94a3b8"
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
                <Feather name="phone" size={20} color="#64748b" style={styles.icon} />
                <TextInput
                  className="flex-1 text-gray-800 ml-2 font-medium"
                  onChangeText={setPhone}
                  value={phone}
                  placeholder="Phone Number"
                  placeholderTextColor="#94a3b8"
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
                <Ionicons name="lock-closed" size={20} color="#64748b" style={styles.icon} />
                <TextInput
                  className="flex-1 text-gray-800 ml-2 font-medium"
                  onChangeText={setPassword}
                  value={password}
                  placeholder="Your reading passphrase"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={toggleShowPassword}>
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#64748b" 
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
                <Ionicons name="lock-closed" size={20} color="#64748b" style={styles.icon} />
                <TextInput
                  className="flex-1 text-gray-800 ml-2 font-medium"
                  onChangeText={setConfirmPassword}
                  value={confirmPassword}
                  placeholder="Confirm your passphrase"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={toggleShowConfirmPassword}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#64748b" 
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              className="h-14 bg-[#0d9488] rounded-xl items-center justify-center shadow-md shadow-[#0d9488]/30 mt-2 flex-row"
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <Text className="text-white text-lg font-bold mr-2">Begin Journey</Text>
              <FontAwesome name="compass" size={16} color="#fff" />
            </TouchableOpacity>

            {/* Footer Links */}
            <View className="mt-6 items-center">
              <View className="flex-row">
                <Text className="text-gray-600 text-sm">Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text className="text-[#0d9488] text-sm font-semibold">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        
        {/* Bottom decorative elements */}
        <View className="absolute bottom-10 left-0 right-0 items-center">
          <View className="flex-row justify-center space-x-8 mb-2">
            <FontAwesome name="book" size={16} color="#a8a29e" />
            <FontAwesome name="pencil" size={16} color="#a8a29e" />
            <FontAwesome name="bookmark" size={16} color="#a8a29e" />
            <Feather name="feather" size={16} color="#a8a29e" />
          </View>
          <Text className="text-gray-400 text-xs">Read • Review • Explore</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 8,
  },
  card: {
    elevation: 12,
    shadowColor: '#0d9488',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
});

export default Register;