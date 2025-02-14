// components/SkeletonLoader.js
import React from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

export const SkeletonLoader = ({ lines = [], style }) => {
  const shimmerAnim = new Animated.Value(0);

  Animated.loop(
    Animated.timing(shimmerAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true
    })
  ).start();

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200]
  });

  return (
    <View style={[styles.container, style]}>
      {lines.map((line, index) => (
        <View key={index} style={[styles.line, { width: line.width, height: line.height }]} />
      ))}
      <View style={styles.shimmerOverlay}>
        <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    overflow: 'hidden',
  },
  line: {
    backgroundColor: '#edf2f7',
    borderRadius: 4,
    marginBottom: 8,
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});

export default SkeletonLoader;