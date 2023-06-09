import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableOpacity, useWindowDimensions, BackHandler } from 'react-native';
import YouTube from 'react-native-youtube-iframe';
import RenderHTML from 'react-native-render-html';

const TrainSong = (props) => {
  // Androidにおける戻る操作の制御
  BackHandler.addEventListener('hardwareBackPress', () => {
    props.switchPage('home');
    return true;
  });

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
  const lyric = props.lyric
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
        <ScrollView
          style={styles.titleContainer}
          horizontal={true}
        >
          <Text style={styles.title}>
            {props.title}
          </Text>
        </ScrollView>
      </View>
      <ScrollView
        style={styles.artistContainer}
        horizontal={true}
      >
        <Text style={styles.artist}>
          {props.artist}
        </Text>
      </ScrollView>

      <ScrollView>
        {/* YouTube */}
        <YouTube
          ref={playerRef}
          height={250}
          videoId={props.url}
        />

        {/* 歌詞 */}
        <View style={styles.lyricContainer}>
          <ScrollView nestedScrollEnabled={true}>
            <RenderHTML
              source={source}
              contentWidth={width}
              baseStyle={baseStyle}
            />
          </ScrollView>
        </View>
      </ScrollView>

      {/* 再生位置を３秒戻す */}
      <View style={styles.seekButtonContainer}>
        <TouchableOpacity
          onPress={seekBackward}
          style={styles.seekButton}
          activeOpacity={0.8}
        >
          <Text style={styles.seekButtonText}>3&nbsp;sec.</Text>
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
    marginTop: 15,
    marginLeft: 10,
  },
  backHome: {
    marginTop: 1.5,
  },
  titleContainer: {
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2.5,
  },
  artistContainer: {
    marginLeft: 45,
    marginBottom: 10,
    height: 35,
  },
  artist: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  // 歌詞
  lyricContainer: {
    width: '90%',
    aspectRatio: 1,
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 100,
  },
  lyric: {
    fontSize: 20,
  },

  // 再生位置を３秒戻す
  seekButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  seekButton: {
    backgroundColor: '#187fc4',
    height: 80,
    width: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seekButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default TrainSong;
