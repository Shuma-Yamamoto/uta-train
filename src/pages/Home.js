import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddSong from './AddSong';
import EditSong from './EditSong';
import TrainSong from './TrainSong';

const Home = () => {
  const [page, setPage] = useState('home');
  const switchPage = (newPage) => {
    setPage(newPage);
  };

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDeletePress = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmed = () => {
    deleteSong(index);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteCancelled = () => {
    setShowDeleteConfirmation(false);
  };

  const deleteConfirmationPopup = (
    <View style={{ flex: 1, top: 100 }}>
      <Text>本当に削除しますか？</Text>
      <TouchableOpacity onPress={handleDeleteConfirmed}>
        <Text>はい</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDeleteCancelled}>
        <Text>いいえ</Text>
      </TouchableOpacity>
    </View>
  );

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
      reloadSongs().then(() => setRefreshing(false));
    });
  });

  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');
  const [lyric, setLyric] = useState('');
  const trainSong = (trainIndex, trainTitle, trainArtist, trainUrl, trainLyric) => {
    setIndex(trainIndex);
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
          {showDeleteConfirmation && deleteConfirmationPopup}
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
                      trainSong(index, item.title, item.artist, item.url.slice(-11), item.lyric);
                      switchPage('train');
                    }}
                    style={styles.songContainer}
                  >
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.artist}>&nbsp;{item.artist}</Text>
                  </TouchableOpacity>
                  <View style={styles.optionContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        trainSong(index, item.title, item.artist, item.url, item.lyric);
                        switchPage('edit');
                      }}
                    >
                        <Text>Edit</Text>
                    </TouchableOpacity>
                    <Text>&nbsp;|&nbsp;</Text>
                    <TouchableOpacity onPress={handleDeletePress}>
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
    case 'edit':
      return (
        <EditSong switchPage={switchPage}
          songsJson={songsJson}
          index={index}
          title={title}
          artist={artist}
          url={url}
          lyric={lyric}
        />
      )
    case 'train':
      return (
        <TrainSong switchPage={switchPage}
          title={title}
          artist={artist}
          url={url}
          lyric={lyric}
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
