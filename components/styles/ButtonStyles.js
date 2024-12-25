import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  buttonContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#1b1f26",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#a9a9a9",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});