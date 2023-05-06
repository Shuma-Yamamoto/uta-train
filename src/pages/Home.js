import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TextInput, Text, Image, TouchableOpacity, useWindowDimensions, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddSong from './AddSong';
import TrainSong from './TrainSong';

const Home = () => {
  const [page, setPage] = useState('home');
  const switchPage = (newPage) => {
    setPage(newPage);
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
      reloadSongs().then(() => setRefreshing(false));
    });
  });

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');
  const [lyric, setLyric] = useState('');
  const trainSong = (trainTitle, trainArtist, trainUrl, trainLyric) => {
    setTitle(trainTitle);
    setArtist(trainArtist);
    setUrl(trainUrl);
    setLyric(trainLyric);
  }

  const [songsJson, setSongsJson] = useState([]);
  const loadSongs = async () => {
    try {
      const songsString = await AsyncStorage.getItem('songs');
      return songsString ? JSON.parse(songsString) : [];
    } catch (error) {
      console.error(error);
    }
  };

  const reloadSongs = async () => {
    const storedSongs = await loadSongs();
    setSongsJson(storedSongs);
  };

  useEffect(() => {
    reloadSongs();
  }, []);

  const deleteSong = async (index) => {
    try {
      const newSongsJson = songsJson.filter((_, i) => i !== index);
      setSongsJson(newSongsJson);
      AsyncStorage.setItem('songs', JSON.stringify(newSongsJson));
    } catch (error) {
    console.log(error);
    }
  };

  switch (page) {
    case 'home':
      return (
        <View style={styles.container}>
          <View style={styles.songIndexContainer}>
            <Text style={styles.songIndex}>
              歌一覧
            </Text>
          </View>
          <View style={styles.cardContainer}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
              {songsJson.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => {
                      trainSong(item.title, item.artist, item.url.slice(-11), item.lyric);
                      switchPage('train');
                    }}
                    style={styles.songContainer}
                  >
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.artist}>&nbsp;{item.artist}</Text>
                  </TouchableOpacity>
                  <View style={styles.optionContainer}>
                    <TouchableOpacity onPress={() => deleteSong(index)}>
                        <Text>Edit</Text>
                    </TouchableOpacity>
                    <Text>&nbsp;|&nbsp;</Text>
                    <TouchableOpacity onPress={() => deleteSong(index)}>
                        <Text style={{ color: 'red' }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.addButtonContainer}>
            <TouchableOpacity
              onPress={() => switchPage('add')}
              activeOpacity={0.8}
            >
              <View style={styles.addButton}>
                <Text style={styles.addButtonText}>歌の追加</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    case 'add':
      return (
        <AddSong switchPage={switchPage} />
      )
    case 'train':
      return (
        <TrainSong switchPage={switchPage}
          title={title}
          artist={artist}
          url={url}
          lyric={lyric}
          reloadSongs={reloadSongs}
        />
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  addSongContainer: {
    position: 'absolute',
    top: 70,
    left: 65,
  },
  addSong: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  songIndexContainer: {
    position: 'absolute',
    top: 70,
    left: 20,
  },
  songIndex: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardContainer: {
    top: 125,
    width: '100%',
    height: '65%',
  },
  songContainer: {
    width: '100%',
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: 'gray',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
  },
  optionContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 5,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#235BC8',
    height: 100,
    width: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
