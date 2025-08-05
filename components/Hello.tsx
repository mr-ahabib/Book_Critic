//make a component that says hello using native wind

import { Text, View } from 'react-native';

export function Hello() {
  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <Text className="text-3xl font-bold text-red-500 bg-blue-500">Hello!</Text>
    </View>
  );
}


