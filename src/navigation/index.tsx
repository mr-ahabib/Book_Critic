import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../register/Login';
import Register from '../register/Register';
import BottomTabs from '../components/BottomTabs';
import ReviewDetails from '../screens/ReviewDetails';
import RecentReviews from '../screens/RecentReviews';

// Define the Review type that matches your data structure
type Review = {
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
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  BottomTabs: undefined;
  ReviewDetails: { 
    reviewId: number;
    reviewData: Review;
  };
  RecentReviews: undefined;
  // Remove ReviewCard from here - it's a component, not a screen
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="ReviewDetails" component={ReviewDetails} />
      <Stack.Screen name="RecentReviews" component={RecentReviews} />
    </Stack.Navigator>
  );
}