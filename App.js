import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './src/pages/Home';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#187fc4',
          },
          headerTitleStyle: {
            fontSize: 21,
            color: '#fff',
          },
        }}>
        <Stack.Screen
          name="UtaTrain"
          component={Home}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
