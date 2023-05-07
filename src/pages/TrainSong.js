import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import YouTube from 'react-native-youtube-iframe';
import RenderHTML from 'react-native-render-html';

const TrainSong = (props) => {
  // 再生位置を３秒戻す
  const playerRef = useRef();

  const seekBackward = async () => {
    try {
      const currentTime = await playerRef.current?.getCurrentTime();
      playerRef.current?.seekTo(currentTime - 3);
    } catch (error) {
      console.error(error);
    }
  };

  // 色付きの歌詞を表示する
  const colorPattern = /(red|green|blue|yellow)\((.*?)\)/g;
  const colorMap = {
    red: '#ef858c',
    green: '#69bd83',
    blue: '#54c3f1',
    yellow: '#f2e55c',
  };

  const source = {
    html: props.lyric
    .replace(/\n/g, '<br>')
    .replace(colorPattern, (match, color, text) => {
      const backgroundColor = colorMap[color]
      return `<span style="background-color: ${backgroundColor};">${text}</span>`
    })
  };

  const { width } = useWindowDimensions();
  const baseStyle = { fontSize: 20 };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <TouchableOpacity
        onPress={() => props.switchPage('home')}
        style={styles.backHome}
      >
        <Image source={require('../../assets/back.png')} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {props.title}
        </Text>
      </View>
      <View style={styles.artistContainer}>
        <Text style={styles.artist}>
          {props.artist}
        </Text>
      </View>

      {/* YouTube */}
      <View style={styles.youtubeContainer}>
        <YouTube
          ref={playerRef}
          height={300}
          videoId={props.url}
        />
      </View>

      {/* 歌詞 */}
      <View style={styles.lyricContainer}>
        <ScrollView>
          <RenderHTML
            source={source}
            contentWidth={width}
            baseStyle={baseStyle}
          />
        </ScrollView>
      </View>

      {/* ボタン */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={seekBackward}
          activeOpacity={0.8}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>3&nbsp;sec.</Text>
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
  titleContainer: {
    position: 'absolute',
    top: 70,
    left: 65,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  artistContainer: {
    position: 'absolute',
    top: 110,
    left: 70,
  },
  artist: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  // YouTube
  youtubeContainer: {
    top: 150,
  },

  // 歌詞
  lyricContainer: {
    top: 95,
    width: '90%',
    aspectRatio: 1,
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
  },
  lyric: {
    fontSize: 20,
  },

  // ボタン
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#235BC8',
    height: 100,
    width: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TrainSong;
