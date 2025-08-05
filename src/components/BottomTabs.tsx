import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Home from '../screens/Home';
import MyPosts from '../screens/MyPosts';
import Profile from '../screens/Profile';
import CreatePost from '../screens/CreatePost';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 80,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 12,
          borderRadius: 24,
        },
        tabBarItemStyle: {
          height: 60,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(233, 248, 240, 0.9)', 'rgba(255, 255, 255, 0.95)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, {
              borderRadius: 24,
              shadowColor: '#6dbe94',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 5,
            }]}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.label, focused ? styles.labelFocused : null]}>
              Home
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused ? styles.iconContainerFocused : null]}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={24}
                color={focused ? '#6dbe94' : '#888'}
              />
            </View>
          ),
        }}
      />
    
      <Tab.Screen
        name="CreatePost"
        component={CreatePost}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.label, focused ? styles.labelFocused : null]}>
              Create
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused ? styles.iconContainerFocused : null]}>
              <Ionicons
                name={focused ? 'add-circle' : 'add-circle-outline'}
                size={24}
                color={focused ? '#6dbe94' : '#888'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MyPosts"
        component={MyPosts}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.label, focused ? styles.labelFocused : null]}>
              My Posts
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused ? styles.iconContainerFocused : null]}>
              <MaterialCommunityIcons
                name={focused ? 'post' : 'post-outline'}
                size={24}
                color={focused ? '#6dbe94' : '#888'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.label, focused ? styles.labelFocused : null]}>
              Profile
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused ? styles.iconContainerFocused : null]}>
              <FontAwesome
                name={focused ? 'user' : 'user-o'}
                size={24}
                color={focused ? '#6dbe94' : '#888'}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
    fontFamily: 'Inter-Medium',
  },
  labelFocused: {
    color: '#6dbe94',
    fontFamily: 'Inter-SemiBold',
    
  },
  iconContainer: {
    padding: 8,
    borderRadius: 16,
    width: 70,  // Added fixed width
    height: 60, // Added fixed height
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  iconContainerFocused: {
    backgroundColor: 'rgba(109, 190, 148, 0.15)',
    marginTop: 24,

  },
});