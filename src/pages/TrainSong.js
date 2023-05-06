import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import YouTube from 'react-native-youtube-iframe';
import HTML from 'react-native-render-html';

const TrainSong = (props) => {
  const playerRef = useRef();

  const handleSeekBackward = () => {
    playerRef.current?.getCurrentTime().then(
      currentTime => playerRef.current?.seekTo({currentTime}['currentTime'] - 3)
  )};

  const pattern = /(red|green|blue|yellow)\((.*?)\)/g;
  const lyricHTML = props.lyric
    .replace(/\n/g, '<br>')
    .replace(pattern, (match, color, text) =>
      `<span style="background-color: ${
        color === 'red' ? '#ef858c' : (color === 'green' ? '#69bd83' : (color === 'blue' ? '#54c3f1' : '#f2e55c'))
      };">${text}</span>`
    );
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
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
      <View style={styles.youtubeContainer}>
        <YouTube
          videoId={props.url}
          height={300}
          ref={playerRef}
        />
      </View>
      <View style={styles.lyricContainer}>
        <ScrollView>
          <HTML
            baseStyle={{ fontSize: 20 }}
            source={{ html: lyricHTML }}
            contentWidth={width}
          />
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSeekBackward}
          activeOpacity={0.8}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>3sec.</Text>
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
