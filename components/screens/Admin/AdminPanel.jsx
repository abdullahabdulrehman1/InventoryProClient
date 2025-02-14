import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSelector } from "react-redux";
import { ROLES } from "../../auth/role";
import ServerUrl from "../../config/ServerUrl";

const { height, width } = Dimensions.get('window');

const AdminPanel = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const AdminUser = useSelector((state) => state?.auth?.user);

  const fetchUsers = async () => {
    const token = await SecureStore.getItemAsync("token");
    try {
      const response = await axios.get(`${ServerUrl}/users/get-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sortedUsers = response.data.users.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);
  useFocusEffect(useCallback(() => { fetchUsers(); }, []));

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
    const token = await SecureStore.getItemAsync("token");
    try {
      await axios.post(`${ServerUrl}/users/assign-role`, {
        role,
        userId: selectedUser._id
      }, { headers: { Authorization: `Bearer ${token}` } });
      Alert.alert("Success", "Role updated successfully");
      setSelectedUser(prev => ({ ...prev, role }));
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to update role");
    } finally {
      setRoleModalVisible(false);
    }
  };

  const deleteUser = async () => {
    const token = await SecureStore.getItemAsync("token");
    try {
      await axios.delete(`${ServerUrl}/users/delete-users`, {
        data: { userId: selectedUser._id },
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prev => prev.filter(user => user._id !== selectedUser._id));
      closeModal();
      Alert.alert("Success", "User deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pendingButton}
        onPress={() => navigation.navigate("PendingUsers")}
      >
        <Ionicons name="time-outline" size={20} color="white" />
        <Text style={styles.pendingButtonText}>Pending Users</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Approved Users</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.scrollContent}
        >
          {users.map((user) => (
            <TouchableOpacity
              key={user._id}
              style={styles.userCard}
              onPress={() => handleUserClick(user)}
            >
              <Image source={{ uri: user.avatar.url }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <View style={styles.labelContainer}>
                  {AdminUser._id === user._id && <Text style={styles.youLabel}>YOU</Text>}
                  {user.role === 1 && <Text style={styles.adminLabel}>ADMIN</Text>}
                </View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.emailAddress}</Text>
                <Text style={styles.userContact}>{user.contactNumber}</Text>
                <Text style={styles.timestamp}>
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* User Detail Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.detailModal}>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>User Details</Text>
              
              <Image source={{ uri: selectedUser?.avatar.url }} style={styles.modalAvatar} />

              <View style={styles.detailSection}>
                <DetailRow label="Name" value={selectedUser?.name} />
                <DetailRow label="Email" value={selectedUser?.emailAddress} />
                <DetailRow label="Contact" value={selectedUser?.contactNumber} />
                <DetailRow label="Address" value={selectedUser?.address} />
                <DetailRow label="Status" value={selectedUser?.status} />
                <DetailRow 
                  label="Role" 
                  value={
                    selectedUser?.role === 1 ? 'Admin' :
                    selectedUser?.role === 2 ? 'View Only' : 'Normal User'
                  }
                />
                <DetailRow 
                  label="Created At" 
                  value={new Date(selectedUser?.createdAt).toLocaleString()} 
                />
                <DetailRow 
                  label="Updated At" 
                  value={new Date(selectedUser?.updatedAt).toLocaleString()} 
                />
              </View>
            </ScrollView>

            {selectedUser?._id !== AdminUser._id && (
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.roleButton]}
                  onPress={() => setRoleModalVisible(true)}
                >
                  <Ionicons name="people-outline" size={18} color="white" />
                  <Text style={styles.actionButtonText}>Change Role</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={deleteUser}
                >
                  <Ionicons name="trash-outline" size={18} color="white" />
                  <Text style={styles.actionButtonText}>Delete User</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Role Change Modal */}
      <Modal visible={roleModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.roleModal}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setRoleModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Change User Role</Text>
            <Text style={styles.modalSubtitle}>Select new role for {selectedUser?.name}</Text>

            <View style={styles.roleOptions}>
              <RoleOption
                icon="person-outline"
                label="Normal User"
                color="#3b82f6"
                onPress={() => handleChangeRole(ROLES.NORMAL)}
              />
              <RoleOption
                icon="shield-checkmark-outline"
                label="Admin"
                color="#6366f1"
                onPress={() => handleChangeRole(ROLES.ADMIN)}
              />
              <RoleOption
                icon="eye-outline"
                label="View Only"
                color="#10b981"
                onPress={() => handleChangeRole(ROLES.VIEW_ONLY)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Reusable Components
const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value || 'N/A'}</Text>
  </View>
);

const RoleOption = ({ icon, label, color, onPress }) => (
  <TouchableOpacity
    style={[styles.roleOption, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Ionicons name={icon} size={22} color="white" />
    <Text style={styles.roleOptionText}>{label}</Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  pendingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  pendingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  userInfo: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  adminLabel: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  youLabel: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  userContact: {
    fontSize: 14,
    color: '#64748b',
  },
  timestamp: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxHeight: height * 0.8,
  },
  modalScrollContent: {
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#e2e8f0',
  },
  detailSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  roleButton: {
    backgroundColor: '#2563eb',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  roleModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  roleOptions: {
    gap: 12,
    marginBottom: 24,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  roleOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 40,
  },
});

export default AdminPanel;