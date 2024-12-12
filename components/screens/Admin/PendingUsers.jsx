import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
  RefreshControl,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ServerUrl from "../../config/ServerUrl";
import { Ionicons } from "@expo/vector-icons";
import { ROLES } from "../../auth/role";

const PendingUsers = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        `${ServerUrl}/users/pending-users?token=${token}`
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const handleChangeRole = async (role) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(`${ServerUrl}/users/assign-role`, {
        token,
        role,
        userId: selectedUser._id,
      });
      Alert.alert("Success", response.data.message);
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setSelectedUser(null);
    } catch (error) {
      console.error(
        "Error changing role:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setRoleModalVisible(false);
      setModalVisible(false);
    }
  };

  const showRoleOptions = () => {
    setRoleModalVisible(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.heading}>Pending Users</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#1b1f26" />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {users.length === 0 ? (
            <Text style={styles.noUsersText}>Pending users not found</Text>
          ) : (
            users.map((user) => (
              <TouchableOpacity
                key={user._id}
                style={styles.userTile}
                onPress={() => handleUserClick(user)}
              >
                <Image
                  source={{ uri: user.avatar.url }}
                  style={styles.avatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.emailAddress}</Text>
                  <Text style={styles.userContact}>{user.contactNumber}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {selectedUser && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
                <Text style={styles.closeIconText}>×</Text>
              </TouchableOpacity>
              <Text style={styles.modalHeader}>User Details</Text>
              <Image
                source={{ uri: selectedUser.avatar.url }}
                style={styles.modalAvatar}
              />
              <Text style={styles.modalText}>Name: {selectedUser.name}</Text>
              <Text style={styles.modalText}>
                Email: {selectedUser.emailAddress}
              </Text>
              <Text style={styles.modalText}>
                Contact: {selectedUser.contactNumber}
              </Text>
              <Text style={styles.modalText}>
                Address: {selectedUser.address}
              </Text>
              <Text style={styles.modalText}>
                Status: {selectedUser.status}
              </Text>
              <Text style={styles.modalText}>Role: {selectedUser.role}</Text>
              <Text style={styles.modalText}>
                Created At: {new Date(selectedUser.createdAt).toLocaleString()}
              </Text>
              <Text style={styles.modalText}>
                Updated At: {new Date(selectedUser.updatedAt).toLocaleString()}
              </Text>
              <TouchableOpacity
                style={styles.changeRoleButton}
                onPress={showRoleOptions}
              >
                <Text style={styles.buttonText}>Approve User</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {roleModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={roleModalVisible}
          onRequestClose={() => setRoleModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setRoleModalVisible(false)}
              >
                <Text style={styles.closeIconText}>×</Text>
              </TouchableOpacity>
              <Text style={styles.modalHeader}>Approve User As</Text>
              <Text style={styles.modalText}>
                Select a new role for the user:
              </Text>
              <TouchableOpacity
                style={styles.roleButton}
                onPress={() => handleChangeRole(ROLES.NORMAL)}
              >
                <Text style={styles.buttonText}>Normal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.roleButton}
                onPress={() => handleChangeRole(ROLES.ADMIN)}
              >
                <Text style={styles.buttonText}>Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.roleButton}
                onPress={() => handleChangeRole(ROLES.VIEW_ONLY)}
              >
                <Text style={styles.buttonText}>View Only</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setRoleModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
  },
  userTile: {
    flexDirection: "row",
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  userContact: {
    fontSize: 14,
    color: "#666",
  },
  noUsersText: {
    textAlign: "center",
    fontSize: 18,
    color: "#666",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeIconText: {
    fontSize: 24,
    color: "#1b1f26",
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  changeRoleButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#1b1f26",
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#1b1f26",
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  roleButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#1b1f26",
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default PendingUsers;
