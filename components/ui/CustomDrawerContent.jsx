import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { userNotExist } from "../redux/reducers/auth";
import { useNavigation } from "@react-navigation/native";

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state?.auth?.user);

  const handleSignOut = async () => {
    try {
      // Delete the inventoryPro token
      await AsyncStorage.removeItem("token");

      console.log("Sign out successful");
      dispatch(userNotExist());
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatName = (name) => {
    return name?.slice(0, 10)?.toUpperCase();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.userInfo}>
        <Text style={styles.username}>{formatName(user?.name)}</Text>
        <Image source={{ uri: user?.avatar?.url }} style={styles.avatar} />
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutLabel}>Sign Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfo: {
    padding: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 40,
  },
  signOutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#888",
    borderRadius: 5,
    alignItems: "center",
  },
  signOutLabel: {
    color: "#fff",
    fontSize: 16,
  },
});
