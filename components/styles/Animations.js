import { StyleSheet } from 'react-native';

export const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  line: {
    backgroundColor: '#edf2f7',
    borderRadius: 4,
    marginBottom: 8,
  },
});

export const animationStyles = StyleSheet.create({
  // Button Styles
  primaryButton: {
    backgroundColor: '#3182ce',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  secondaryButton: {
    backgroundColor: '#2b6cb0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  dangerButton: {
    backgroundColor: '#e53e3e',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  
  // Dot Loader Styles
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});