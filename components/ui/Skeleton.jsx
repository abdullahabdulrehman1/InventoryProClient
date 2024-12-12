import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonPlaceholder } from 'react-native-skeleton-placeholder';

const Skeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.header} />
        <View style={styles.content}>
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    width: '100%',
    height: 50,
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  item: {
    width: '100%',
    height: 100,
    marginBottom: 20,
  },
});

export default Skeleton;  