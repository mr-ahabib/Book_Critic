// src/navigation/index.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../register/Login';
import Register from '../register/Register';
export type RootStackParamList = {
  Login: undefined;
 Register: undefined;
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

    </Stack.Navigator>
  );
}
