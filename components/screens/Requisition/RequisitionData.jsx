import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import ServerUrl from "../../config/ServerUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { ROLES } from "../../auth/role";
import * as SecureStore from "expo-secure-store";
const RequisitionData = ({ navigation }) => {
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const userRole = useSelector((state) => state?.auth?.user?.role);

  const fetchData = async (pageNumber = 1) => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (token) {
        setIsFetching(true);
        const response = await axios.get(
          `${ServerUrl}/requisition/showRequisition`,
          {
            params: {
              page: pageNumber,
              limit: 10,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { data: newData, totalPages: fetchedTotalPages } = response.data;

        setData((prevData) =>
          pageNumber === 1 ? newData : [...prevData, ...newData]
        );
        setTotalPages(fetchedTotalPages);
      }
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleLoadMore = () => {
    if (page < totalPages && !isFetching) {
      setPage((prevPage) => prevPage + 1);
      fetchData(page + 1);
    }
  };
  const handleDelete = async (id) => {
    const token = await SecureStore.getItemAsync("token");
    try {
      const response = await axios.delete(
        `${ServerUrl}/requisition/deleteRequisition`,
        {
          data: {
            requisitionId: id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setServerMessage(response.data.message);
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error(
        "Error deleting requisition:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setConfirmVisible(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmVisible(true);
  };

  const handleShow = (requisition) => {
    setSelectedRequisition(requisition);
    setModalVisible(true);
  };

  const handleEdit = (requisition) => {
    navigation.navigate("RequisitionEdit", { requisition });
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRequisition(null);
  };

  const closeConfirmModal = () => {
    setConfirmVisible(false);
    setDeleteId(null);
  };
  const renderItem = ({ item }) => (
    <View style={styles.dataRow}>
      <Text>
        DR #: <Text style={styles.boldText}>{item.drNumber}</Text>
      </Text>
      <Text>
        Department: <Text style={styles.boldText}>{item.department}</Text>
      </Text>
      <View style={styles.dataButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShow(item)}
        >
          <Text style={styles.actionButtonText}>Show</Text>
        </TouchableOpacity>
        {userRole !== ROLES.VIEW_ONLY && (
          <>
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
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {userRole !== ROLES.VIEW_ONLY && (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate("RequisitionGeneral")}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.header}>Requisition Data</Text>
          </>
        )}
      </View>
      {serverMessage ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{serverMessage}</Text>
        </View>
      ) : null}
      {loading ? (
        <ActivityIndicator size="large" color="#1b1f26" />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id || index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching ? (
              <ActivityIndicator size="small" color="#1b1f26" />
            ) : null
          }
        />
      )}

      {selectedRequisition && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalHeader}>Requisition Details</Text>
                <View style={styles.modalFieldsContainer}>
                  <Text style={styles.modalText}>
                    DR #:{" "}
                    <Text style={styles.boldText}>
                      {selectedRequisition.drNumber}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Department:{" "}
                    <Text style={styles.boldText}>
                      {selectedRequisition.department}
                    </Text>
                  </Text>
                  {selectedRequisition.items.map((row, index) => (
                    <View key={index}>
                      <View style={styles.row}>
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
                          UOM: <Text style={styles.boldText}>{row.uom}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Quantity:{" "}
                          <Text style={styles.boldText}>{row.quantity}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Rate: <Text style={styles.boldText}>{row.rate}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Amount:{" "}
                          <Text style={styles.boldText}>{row.amount}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Remarks:{" "}
                          <Text style={styles.boldText}>{row.remarks}</Text>
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
              Are you sure you want to delete this requisition?
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
    paddingTop: 10, // Add padding to the top
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 10,
  },
  messageContainer: {
    padding: 10,
    backgroundColor: "#d4edda",
    borderRadius: 5,
    marginBottom: 10,
  },
  messageText: {
    color: "#155724",
    fontSize: 16,
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

export default RequisitionData;
