import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  row: {
    marginBottom: 15,
    position: "relative",
  },
  rowLabel: {
    fontWeight: "bold",
  },
  rowInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 20,
    marginTop: 5,
  },
  removeButton: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});