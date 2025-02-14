import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import { animationStyles } from '../styles/Animations';

const AnimatedLoader = ({ color = '#2b6cb0' }) => {
  const animValues = [
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ];

  useEffect(() => {
    const animate = (index) => {
      Animated.sequence([
        Animated.timing(animValues[index], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animValues[index], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => animate((index + 1) % 3));
    };
    animate(0);
  }, []);

  return (
    <Animated.View style={animationStyles.dotContainer}>
      {animValues.map((value, index) => (
        <Animated.View
          key={index}
          style={[
            animationStyles.dot,
            {
              backgroundColor: color,
              transform: [{
                scale: value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.5]
                })
              }],
              opacity: value.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1]
              })
            }
          ]}
        />
      ))}
    </Animated.View>
  );
};

export default AnimatedLoader;