import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TouchableOpacity, Animated } from 'react-native';
import YouTube from 'react-native-youtube-iframe';

const TrainSong = () => {
  const playerRef = React.useRef();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handleSeekBackward = () => {
    playerRef.current?.getCurrentTime().then(
      currentTime => playerRef.current?.seekTo({currentTime}['currentTime'] - 3)
  )};

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require('../../assets/back.png')}
        style={styles.back}
      />
      <View style={styles.songContainer}>
        <Text style={styles.song}>
          心予報
        </Text>
      </View>
      <View style={styles.singerContainer}>
        <Text style={styles.singer}>
          Eve
        </Text>
      </View>
      <View style={styles.youtubeContainer}>
        <YouTube
          videoId='dJf4wCdLU18'
          height={300}
          ref={playerRef}
        />
      </View>
      <View style={styles.lyricContainer}>
        <ScrollView>
          <Text style={styles.lyric}>
          浮つく甘い街の喧騒{'\n'}
          故に感情線は渋滞{'\n'}
          「僕に関係ない」とか言って{'\n'}
          心模様 白く染まって{'\n'}{'\n'}

          だけどどうやったって釣り合わない{'\n'}
          いたずらに笑う横顔に乾杯{'\n'}
          酸いも甘いもわからないの{'\n'}
          きっと君の前では迷子{'\n'}{'\n'}

          溶かしてはランデブー{'\n'}
          プラトニックになってく{'\n'}
          ほろ苦い期待 張り裂けてしまいそう{'\n'}{'\n'}

          だから{'\n'}{'\n'}

          夢惑う 想いならば{'\n'}
          聞かせて その声を{'\n'}{'\n'}

          君に{'\n'}
          染まってしまえば 染まってしまえば{'\n'}
          心遊ばせ 余所見してないで{'\n'}
          想っていたいな 想っていたいな{'\n'}
          桃色の心予報{'\n'}{'\n'}

          今{'\n'}
          混ざってしまえば 混ざってしまえば{'\n'}
          君と重なって 視線が愛 相まって{'\n'}
          ロマンスは止まらない{'\n'}
          失敗したらグッバイステップ{'\n'}
          神さまどうか今日は味方して
          </Text>
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSeekBackward}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <Animated.View style={[styles.button, { transform: [{ scale: scaleValue }] }]}>
            <Text style={styles.buttonText}>3sec.</Text>

          </Animated.View>
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
  songContainer: {
    position: 'absolute',
    top: 70,
    left: 65,
  },
  song: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  singerContainer: {
    position: 'absolute',
    top: 110,
    left: 70,
  },
  singer: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  youtubeContainer: {
    top: 150,
  },
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
    borderRadius: 60,
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
