import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ServerUrl from "../../config/ServerUrl";
import { ROLES } from "../../auth/role";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

const AdminPanel = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const AdminUser = useSelector((state) => state?.auth?.user);

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        `${ServerUrl}/users/get-users?token=${token}`
      );
      const sortedUsers = response.data.users.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setUsers(sortedUsers);
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

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

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
      setSelectedUser({ ...selectedUser, role });
    } catch (error) {
      console.error(
        "Error changing role:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setRoleModalVisible(false);
    }
  };

  const showRoleOptions = () => {
    setRoleModalVisible(true);
  };

  const deleteUser = async () => {
    const userId = selectedUser._id;
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.delete(`${ServerUrl}/users/delete-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          token,
          userId: userId,
        },
      });
      Alert.alert("Success", "User deleted successfully");
      setUsers(users.filter((user) => user._id !== userId));
      closeModal();
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pendingUsersButton}
        onPress={() => navigation.navigate("PendingUsers")}
      >
        <Text style={styles.buttonText}>Pending Users</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Approved Users</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1b1f26" />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {users.map((user) => (
            <TouchableOpacity
              key={user._id}
              style={styles.userTile}
              onPress={() => handleUserClick(user)}
            >
              <Image source={{ uri: user.avatar.url }} style={styles.avatar} />
              <View style={styles.userInfo}>
                {AdminUser._id === user._id && (
                  <Text style={styles.youLabel}>You</Text>
                )}
                {user.role === 1 && user._id !== AdminUser._id && (
                  <Text style={styles.adminLabel}>Admin</Text>
                )}

                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.emailAddress}</Text>
                <Text style={styles.userContact}>{user.contactNumber}</Text>
                <Text style={styles.createdAt}>
                  {new Date(user.createdAt).toLocaleString([], {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
              <Text style={styles.modalText}>
                Name: <Text style={styles.boldText}>{selectedUser.name}</Text>
              </Text>
              <Text style={styles.modalText}>
                Email:{" "}
                <Text style={styles.boldText}>{selectedUser.emailAddress}</Text>
              </Text>
              <Text style={styles.modalText}>
                Contact:{" "}
                <Text style={styles.boldText}>
                  {selectedUser.contactNumber}
                </Text>
              </Text>
              <Text style={styles.modalText}>
                Address:{" "}
                <Text style={styles.boldText}>{selectedUser.address}</Text>
              </Text>
              <Text style={styles.modalText}>
                Status:{" "}
                <Text style={styles.boldText}>{selectedUser.status}</Text>
              </Text>
              <Text style={styles.modalText}>
                Role:{" "}
                <Text style={styles.boldText}>
                  {selectedUser.role === 1
                    ? "Admin"
                    : selectedUser.role === 2
                    ? "View Only"
                    : "Normal User"}
                </Text>
              </Text>
              <Text style={styles.modalText}>
                Created At:{" "}
                <Text style={styles.boldText}>
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </Text>
              </Text>
              <Text style={styles.modalText}>
                Updated At:{" "}
                <Text style={styles.boldText}>
                  {new Date(selectedUser.updatedAt).toLocaleString()}
                </Text>
              </Text>
              {AdminUser._id !== selectedUser._id &&
                selectedUser.role !== 1 && (
                  <>
                    <TouchableOpacity
                      style={styles.changeRoleButton}
                      onPress={showRoleOptions}
                    >
                      <Text style={styles.buttonText}>Change Role</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={deleteUser}
                    >
                      <Text style={styles.buttonText}>Delete User</Text>
                    </TouchableOpacity>
                  </>
                )}
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
              <Text style={styles.modalHeader}>Change Role</Text>
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
    backgroundColor: "#f0f0f0",
  },
  pendingUsersButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#1b1f26",
    borderRadius: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  createdAt: {
    fontSize: 12,
    color: "gray",
  },
  adminLabel: {
    color: "blue",
    fontWeight: "bold",
    marginBottom: 5,
  },
  youLabel: {
    color: "red",
    fontWeight: "bold",
    marginBottom: 5,
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
  boldText: {
    fontWeight: "bold",
  },
  changeRoleButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#1b1f26",
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "red",
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

export default AdminPanel;
