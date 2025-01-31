import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import ContainerStyles from "../styles/ContainerStyles";
import ButtonStyles from "../styles/ButtonStyles";
import FormStyles from "../styles/FormStyles";
import ModalStyles from "../styles/ModalStyles";

const HeaderBackArrow = ({ navigation, title, targetScreen }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate(targetScreen)}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>{title}</Text>
    </View>
  );
};

HeaderBackArrow.propTypes = {
  navigation: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  targetScreen: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
 
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default HeaderBackArrow;