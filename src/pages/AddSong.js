import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHTML from 'react-native-render-html';

const AddSong = (props) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');
  const [lyric, setLyric] = useState('');
  const [preview, setPreview] = useState(false);

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
      const newSongsJsonObj = [...songsJsonObj, song];
      await AsyncStorage.setItem('songs', JSON.stringify(newSongsJsonObj));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
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

      {/* 歌情報の入力 */}
      <View style={styles.inputContainer}>
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
              activeOpacity={0.8}
            >
              <View style={styles.previewButton}>
                <Text style={styles.previewButtonText}>{preview ? 'Edit' : 'Preview'}</Text>
              </View>
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
      </View>

      {/* 保存 */}
      <View style={styles.storeButtonContainer}>
        <TouchableOpacity
          disabled={onPressDisabled}
          onPress={() => {
            saveSong();
            props.switchPage('home');
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.storeButton, onPressDisabled && styles.disabledButton]}>
            <Text style={styles.storeButtonText}>保存</Text>
          </View>
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
  backHome: {
    position: 'absolute',
    top: 71.5,
    left: 25,
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

  // 歌情報の入力
  inputContainer: {
    top: 150,
  },
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
    backgroundColor: '#235BC8',
    height: 30,
    width: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewButtonText: {
    color: 'white',
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

  // 保存
  storeButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  storeButton: {
    backgroundColor: '#235BC8',
    height: 100,
    width: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  storeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddSong;
