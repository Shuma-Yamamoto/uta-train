import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TextInput, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HTML from 'react-native-render-html';

const AddSong = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');
  const [lyric, setLyric] = useState('');
  const [preview, setPreview] = useState(false);

  const pattern = /(red|green|blue|yellow)\((.*?)\)/g;
  const lyricHTML = lyric
    .replace(/\n/g, '<br>')
    .replace(pattern, (match, color, text) =>
      `<span style="background-color: ${
        color === 'red' ? '#ef858c' : (color === 'green' ? '#69bd83' : (color === 'blue' ? '#54c3f1' : '#f2e55c'))
      };">${text}</span>`
    );
  const { width } = useWindowDimensions();

  const saveSong = async () => {
    const song = {
      title,
      artist,
      url,
      lyric,
    };

    try {
      const songsJson = await AsyncStorage.getItem('songs');
      const songs = songsJson ? JSON.parse(songsJson) : [];
      songs.push(song);
      await AsyncStorage.setItem('songs', JSON.stringify(songs));
      setTitle('');
      setArtist('');
      setUrl('');
      setLyric('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/back.png')}
        style={styles.back}
      />
      <View style={styles.addSongContainer}>
        <Text style={styles.addSong}>
          歌の追加
        </Text>
      </View>
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
          <View style={styles.previewButtonContainer}>
            <TouchableOpacity
              onPress={() => setPreview(!preview)}
              activeOpacity={0.8}
            >
              <View style={styles.previewButton}>
                <Text style={styles.storeButtonText}>{preview ? 'Edit' : 'Preview'}</Text>
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
                <HTML
                  baseStyle={{ fontSize: 20 }}
                  source={{ html: lyricHTML }}
                  contentWidth={width}
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
      <View style={styles.storeButtonContainer}>
        <TouchableOpacity
          onPress={saveSong}
          activeOpacity={0.8}
        >
          <View style={styles.storeButton}>
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
  back: {
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
  inputLyric: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    marginBottom: 300,
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
  descriptionContainer: {
    margin: 10,
  },
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
    fontSize: 10,
  },
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
  storeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddSong;