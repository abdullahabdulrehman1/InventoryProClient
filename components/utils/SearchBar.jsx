import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('')
  const spinAnim = useRef(new Animated.Value(0)).current
  const progressAnim = useRef(new Animated.Value(0)).current

  // Rotation animation interpolations
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  // Progress animation interpolation
  const progress = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  useEffect(() => {
    let debounceTimer

    if (searchText) {
      // Start animations
      Animated.parallel([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        Animated.loop(
          Animated.timing(spinAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true
          })
        )
      ]).start()

      debounceTimer = setTimeout(() => {
        onSearch(searchText)
        // Reset animations
        progressAnim.setValue(0)
        spinAnim.setValue(0)
      }, 1000)
    } else {
      // When search is empty, reset immediately
      onSearch('')
      progressAnim.setValue(0)
      spinAnim.setValue(0)
    }

    return () => {
      clearTimeout(debounceTimer)
      progressAnim.setValue(0)
      spinAnim.setValue(0)
    }
  }, [searchText])

  const handleClear = () => {
    setSearchText('')
    onSearch('')
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Search Here'
        placeholderTextColor='#90CAF9'
        value={searchText}
        onChangeText={setSearchText}
        selectionColor='#64B5F6'
      />

      <TouchableOpacity
        onPress={searchText ? handleClear : () => onSearch(searchText)}
        style={styles.iconContainer}
      >
        {searchText ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <MaterialCommunityIcons
              name={searchText ? 'clock-outline' : 'magnify'}
              size={24}
              color='#2196F3'
            />
          </Animated.View>
        ) : (
          <MaterialCommunityIcons name='magnify' size={24} color='#2196F3' />
        )}

        {/* Progress background */}
        {searchText && (
          <Animated.View
            style={[
              styles.progressRing,
              {
                transform: [{ rotate: progress }],
                borderLeftColor: 'transparent'
              }
            ]}
          />
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 25,
    padding: 8,
    margin: 16,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    color: '#1976D3',
    fontSize: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#64B5F6'
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  progressRing: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderLeftColor: 'transparent'
  }
})

export default SearchBar
