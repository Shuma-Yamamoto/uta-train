import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import AddSong from './src/pages/AddSong';
import TrainSong from './src/pages/TrainSong';

const App = () => {
  return (
    <View style={styles.container}>
      <AddSong />
      {/* <TrainSong /> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default App;