import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../register/Login';
import Register from '../register/Register';
import BottomTabs from '../components/BottomTabs';
import ReviewDetails from '../screens/ReviewDetails';
import { Review } from '../types/review';



export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  BottomTabs: undefined;
  ReviewDetails: {
    reviewId: number;
    reviewData: Review;
  };
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

    </Stack.Navigator>
  );
}