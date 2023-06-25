import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, Image, TouchableOpacity, useWindowDimensions, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHTML from 'react-native-render-html';

const AddSong = (props) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');
  const [lyric, setLyric] = useState('');
  const [preview, setPreview] = useState(false);

  // Androidにおける戻る操作の制御
  BackHandler.addEventListener('hardwareBackPress', () => {
    props.switchPage('home');
    return true;
  });

  // 色付きの歌詞を表示する
  const colorPattern = /(red|green|blue|yellow)\((.*?)\)/g;
  const colorMap = {
    red: '#ef858c',
    green: '#69bd83',
    blue: '#54c3f1',
    yellow: '#f2e55c',
  };

  const source = {
    html: lyric
    .replace(/\n/g, '<br>')
    .replace(colorPattern, (match, color, text) => {
      const backgroundColor = colorMap[color]
      return `<span style="background-color: ${backgroundColor};">${text}</span>`
    })
  };

  const { width } = useWindowDimensions();
  const baseStyle = { fontSize: 20 };

  // 歌情報を保存する
  const onPressDisabled = !(title && artist && url && lyric);

  const saveSong = async () => {
    const song = { title, artist, url, lyric, };

    try {
      const songsJsonStr = await AsyncStorage.getItem('songs');
      const songsJsonObj = songsJsonStr ? JSON.parse(songsJsonStr) : [];
      const newSongsJsonObj = [song, ...songsJsonObj];
      await AsyncStorage.setItem('songs', JSON.stringify(newSongsJsonObj));
      await props.loadSongs();
      props.switchPage('home');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.nobr}>
        <TouchableOpacity
          onPress={() => props.switchPage('home')}
          style={styles.backHome}
        >
          <Image source={require('../../assets/back.png')} />
        </TouchableOpacity>
        <View style={styles.addSongContainer}>
          <Text style={styles.addSong}>
            歌の追加
          </Text>
        </View>
      </View>

      {/* 歌情報を入力する */}
      <ScrollView>
        <TextInput
          style={styles.input}
          placeholder="曲名"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="歌手"
          value={artist}
          onChangeText={setArtist}
        />
        <TextInput
          style={styles.input}
          placeholder="URL"
          value={url}
          onChangeText={setUrl}
        />

        {/* プレビュー */}
        <View style={styles.previewButtonContainer}>
          <TouchableOpacity
            onPress={() => setPreview(!preview)}
            style={styles.previewButton}
            activeOpacity={0.8}
          >
            <Text style={styles.previewButtonText}>{preview ? 'Edit' : 'Preview'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.descriptionContainer}>
          <Text>
            red(<Text style={{ backgroundColor: '#ef858c' }}>赤</Text>),
            green(<Text style={{ backgroundColor: '#69bd83' }}>緑</Text>),
            blue(<Text style={{ backgroundColor: '#54c3f1' }}>青</Text>),
            yellow(<Text style={{ backgroundColor: '#f2e55c' }}>黄</Text>)
          </Text>
        </View>
        {preview ? (
          <View style={styles.lyricContainer}>
            <ScrollView nestedScrollEnabled={true}>
              <RenderHTML
                source={source}
                contentWidth={width}
                baseStyle={baseStyle}
              />
            </ScrollView>
          </View>
        ) : (
          <TextInput
            style={styles.inputLyric}
            placeholder="歌詞"
            multiline={true}
            value={lyric}
            onChangeText={setLyric}
          />
        )}
      </ScrollView>

      {/* 歌情報を保存する */}
      <View style={styles.storeButtonContainer}>
        <TouchableOpacity
          onPress={() => saveSong()}
          style={[styles.storeButton, onPressDisabled && styles.disabledButton]}
          disabled={onPressDisabled}
          activeOpacity={0.8}
        >
          <Text style={styles.storeButtonText}>保存</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // ヘッダー
  nobr: {
    flexDirection: 'row',
    marginVertical: 15,
    marginLeft: 10,
  },
  backHome: {
    marginTop: 1.5,
  },
  addSongContainer: {
    marginLeft: 5,
  },
  addSong: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  // 歌情報を入力する
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },

  // プレビュー
  previewButtonContainer: {
    alignItems: 'center',
  },
  previewButton: {
    backgroundColor: '#187fc4',
    height: 30,
    width: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  descriptionContainer: {
    margin: 10,
  },
  lyricContainer: {
    width: '90%',
    aspectRatio: 1,
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 300,
  },
  inputLyric: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    marginBottom: 300,
  },

  // 歌情報を保存する
  storeButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  storeButton: {
    backgroundColor: '#187fc4',
    height: 80,
    width: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  storeButtonText: {
    color: '#fff',
    fontSize: 17,
  },
});

export default AddSong;
