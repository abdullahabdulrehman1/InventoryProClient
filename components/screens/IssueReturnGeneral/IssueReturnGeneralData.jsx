import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import ServerUrl from "../../config/ServerUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const IssueReturnGeneralData = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIssueReturn, setSelectedIssueReturn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        `${ServerUrl}/issueReturnGeneral/get-issue-return-general`,
        {
          params: { token },
        }
      );
      console.log("Fetched data:", response.data); // Debugging log
      setData(response.data);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const handleDelete = async (issueReturnId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(
        `${ServerUrl}/issueReturnGeneral/delete-issue-return-general`,
        {
          data: { token, id: issueReturnId },
        }
      );
      Alert.alert("Success", "Issue Return deleted successfully.");
      fetchData();
    } catch (error) {
      console.error(
        "Error deleting issue return:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Error",
        error.response ? error.response.data.message : "Something went wrong."
      );
    } finally {
      setConfirmVisible(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmVisible(true);
  };

  const closeConfirmModal = () => {
    setConfirmVisible(false);
    setDeleteId(null);
  };

  const handleEdit = (issueReturn) => {
    navigation.navigate("IssueReturnGeneralEdit", { issueReturn });
  };

  const handleShow = (issueReturn) => {
    setSelectedIssueReturn(issueReturn);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedIssueReturn(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("IssueReturnGeneral")}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Issue Return General Data</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#1b1f26" />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <View key={item._id} style={styles.dataRow}>
                <Text>
                  S.No: <Text style={styles.boldText}>{index + 1}</Text>
                </Text>
                <Text>
                  IR Number:{" "}
                  <Text style={styles.boldText}>{item.irNumber}</Text>
                </Text>
                <Text>
                  IR Date:{" "}
                  <Text style={styles.boldText}>
                    {new Date(item.irDate).toLocaleDateString()}
                  </Text>
                </Text>
                <Text>
                  DR Number:{" "}
                  <Text style={styles.boldText}>{item.drNumber}</Text>
                </Text>
                <Text>
                  DR Date:{" "}
                  <Text style={styles.boldText}>
                    {new Date(item.drDate).toLocaleDateString()}
                  </Text>
                </Text>
                <View style={styles.dataButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleShow(item)}
                  >
                    <Text style={styles.actionButtonText}>Show</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => confirmDelete(item._id)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text>No data available</Text>
          )}
        </ScrollView>
      )}

      {selectedIssueReturn && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalHeader}>Issue Return Details</Text>
                <View style={styles.modalFieldsContainer}>
                  <Text style={styles.modalText}>
                    IR Number:{" "}
                    <Text style={styles.boldText}>
                      {selectedIssueReturn.irNumber}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    IR Date:{" "}
                    <Text style={styles.boldText}>
                      {new Date(
                        selectedIssueReturn.irDate
                      ).toLocaleDateString()}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    DR Number:{" "}
                    <Text style={styles.boldText}>
                      {selectedIssueReturn.drNumber}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    DR Date:{" "}
                    <Text style={styles.boldText}>
                      {new Date(
                        selectedIssueReturn.drDate
                      ).toLocaleDateString()}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Remarks:{" "}
                    <Text style={styles.boldText}>
                      {selectedIssueReturn.remarks}
                    </Text>
                  </Text>
                  {selectedIssueReturn.rows.map((row, index) => (
                    <View key={index}>
                      <View style={styles.row}>
                        <Text style={styles.modalText}>
                          Action:{" "}
                          <Text style={styles.boldText}>{row.action}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Serial No:{" "}
                          <Text style={styles.boldText}>{row.serialNo}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Level 3 Item Category:{" "}
                          <Text style={styles.boldText}>
                            {row.level3ItemCategory}
                          </Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Item Name:{" "}
                          <Text style={styles.boldText}>{row.itemName}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Unit: <Text style={styles.boldText}>{row.unit}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Issue Qty:{" "}
                          <Text style={styles.boldText}>{row.issueQty}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Previous Return Qty:{" "}
                          <Text style={styles.boldText}>
                            {row.previousReturnQty}
                          </Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Balance Issue Qty:{" "}
                          <Text style={styles.boldText}>
                            {row.balanceIssueQty}
                          </Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Return Qty:{" "}
                          <Text style={styles.boldText}>{row.returnQty}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Row Remarks:{" "}
                          <Text style={styles.boldText}>{row.rowRemarks}</Text>
                        </Text>
                      </View>
                      <View style={styles.separator} />
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.button} onPress={closeModal}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmVisible}
        onRequestClose={closeConfirmModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Confirm Delete</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this issue return?
            </Text>
            <View style={styles.dataButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={closeConfirmModal}
              >
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(deleteId)}
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  dataRow: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
  },
  dataButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: "#1b1f26",
    padding: 5,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 5,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#1b1f26",
  },
  deleteButton: {
    backgroundColor: "#1b1f26",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
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
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalFieldsContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  row: {
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#1b1f26",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default IssueReturnGeneralData;
