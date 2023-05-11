import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddSong from './AddSong';
import EditSong from './EditSong';
import TrainSong from './TrainSong';

const Home = () => {
  // ページの切り替え
  const [page, setPage] = useState('home');
  const switchPage = (newPage) => {
    setPage(newPage);
  };

  // 歌情報を読み込む
  const [songs, setSongs] = useState([]);
  const loadSongs = async () => {
    try {
      const songsJsonStr = await AsyncStorage.getItem('songs');
      const songsJsonObj = songsJsonStr ? JSON.parse(songsJsonStr) : [];
      setSongs(songsJsonObj);
    } catch (error) {
      console.error(error);
    }
  };

  // 初回のみ自動で読み込み
  useEffect(() => {
    loadSongs();
  }, []);

  // ２回目以降はスワイプで読み込み
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await loadSongs();
    setRefreshing(false);
  };

  // propsの設定
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');
  const [lyric, setLyric] = useState('');

  const songProps = (indexProp, titleProp, artistProp, urlProp, lyricProp) => {
    setIndex(indexProp);
    setTitle(titleProp);
    setArtist(artistProp);
    setUrl(urlProp);
    setLyric(lyricProp);
  };

  // 歌情報を削除する
  const deleteSong = async () => {
    try {
      const newSongsJsonObj = songs.filter((_, i) => i !== index);
      await AsyncStorage.setItem('songs', JSON.stringify(newSongsJsonObj));
      setSongs(newSongsJsonObj);
    } catch (error) {
    console.error(error);
    }
  };

  // 本当に削除しますか？
  const [confirmation, setConfirmation] = useState(false);

  const onPressConfirm = () => {
    setConfirmation(true);
  };

  const confirmDelete = () => {
    deleteSong();
    setConfirmation(false);
  };

  const cancelDelete = () => {
    setConfirmation(false);
  };

  switch (page) {
    case 'home':
      return (
        <View style={styles.container}>
          {/* ヘッダー */}
          <View style={styles.songIndexContainer}>
            <Text style={styles.songIndex}>
              歌一覧
            </Text>
          </View>

          {/* 歌情報一覧 */}
          <View style={styles.cardContainer}>
            {/* スワイプで読み込み */}
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            >

              {songs.map((item, index) => (
                <View key={index}>
                  {/* 歌練習画面へ遷移 */}
                  <TouchableOpacity
                    onPress={() => {
                      songProps(index, item.title, item.artist, item.url.slice(-11), item.lyric);
                      switchPage('train');
                    }}
                    style={styles.songContainer}
                    activeOpacity={0.8}
                  >
                    <View>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.artist}>{item.artist}</Text>
                    </View>

                    {/* 歌情報を編集・削除する */}
                    <View style={styles.optionsContainer}>
                      {/* 歌編集画面へ遷移 */}
                      <TouchableOpacity onPress={() => {
                        songProps(index, item.title, item.artist, item.url, item.lyric);
                        switchPage('edit');
                      }}>
                        <Ionicons name="create-outline" size={24} color="#fff" marginRight={0.25} />
                      </TouchableOpacity>
                      {/* 歌情報を削除する */}
                      <TouchableOpacity onPress={() => {
                        setIndex(index)
                        onPressConfirm()
                      }}>
                        <Ionicons name="trash-outline" size={24} color="#fff" marginLeft={0.25} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 歌追加画面へ遷移 */}
          <View style={styles.addButtonContainer}>
            <TouchableOpacity
              onPress={() => switchPage('add')}
              style={styles.addButton}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>歌の追加</Text>
            </TouchableOpacity>
          </View>

          {/* 本当に削除しますか？ */}
          <Modal visible={confirmation} animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.confirmContainer}>
                <Text style={styles.confirmText}>本当に削除しますか？</Text>
                <View style={styles.confirmButtonContainer}>
                  <TouchableOpacity
                    onPress={confirmDelete}
                    style={styles.confirmButton}
                  >
                    <Text style={styles.confirmButtonText}>はい</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={cancelDelete}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>いいえ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )
    case 'add':
      return (
        <AddSong switchPage={switchPage} />
      )
    case 'edit':
      return (
        <EditSong switchPage={switchPage}
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
  // ヘッダー
  songIndexContainer: {
    position: 'absolute',
    top: 70,
    left: 20,
  },
  songIndex: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  // 歌情報一覧
  cardContainer: {
    top: 125,
    width: '100%',
    height: '65%',
  },

  // 歌練習画面へ遷移
  songContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1.25,
    borderBottomWidth: 1.25,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
    color: '#888',
  },

  // 歌情報を編集・削除する
  optionsContainer: {
    flexDirection: 'row',
    backgroundColor: '#187fc4',
    padding: 10,
    borderRadius: 5,
  },

  // 歌追加画面へ遷移
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#187fc4',
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

  // 本当に削除しますか？
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  confirmContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 18,
    marginBottom: 20,
  },
  confirmButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmButton: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  confirmButtonText: {
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#e60012',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
