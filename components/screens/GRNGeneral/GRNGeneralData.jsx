import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { ROLES } from "../../auth/role";
import ServerUrl from "../../config/ServerUrl";

const GRNGeneralData = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const userRole = useSelector((state) => state?.auth?.user?.role);

  const fetchData = async () => {
    setLoading(true);
    const token = await SecureStore.getItemAsync("token");

    try {
      const response = await axios.get(`${ServerUrl}/grnGeneral/get-grn`, {
        params: { token }, headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data.grn || []);
      setError(null);
      console.log(response.data.grn);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
      if (
        error.response &&
        error.response.data.message === "GRN returns not found"
      ) {
        setError("GRN returns not found");
      } else {
        setError("Something went wrong");
      }
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

  const handleDelete = async (grnId) => {
    const token = await SecureStore.getItemAsync("token");
    try {
      const response = await axios.delete(
        `${ServerUrl}/grnGeneral/delete-grn`,
        {
          data: { token, grnId },
        }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      console.log(response.data);
      setData(data.filter((item) => item._id !== grnId));
      Alert.alert("Success", "GRN deleted successfully.");
    } catch (error) {
      console.error(
        "Error deleting GRN:",
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

  const handleEdit = (grn) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: "GRNGeneral" },
          { name: "GRNGeneralEdit", params: { grn } },
        ],
      })
    );
  };

  const handleShow = (grn) => {
    setSelectedGRN(grn);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedGRN(null);
  };

  const closeConfirmModal = () => {
    setConfirmVisible(false);
    setDeleteId(null);
  };

  return (
    <View style={styles.container}>
      {userRole !== ROLES.VIEW_ONLY && (
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("GRNGeneral")}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>GRN General Data</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#1b1f26" />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : Array.isArray(data) && data.length > 0 ? (
            data.map((item, index) => (
              <View key={item._id} style={styles.dataRow}>
                <Text>
                  S.No: <Text style={styles.boldText}>{index + 1}</Text>
                </Text>
                <Text>
                  GRN Number:{" "}
                  <Text style={styles.boldText}>{item.grnNumber}</Text>
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
            ))
          ) : (
            <Text style={styles.noRecordText}>No record found</Text>
          )}
        </ScrollView>
      )}

      {selectedGRN && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalHeader}>GRN Details</Text>
                <View style={styles.modalFieldsContainer}>
                  <Text style={styles.modalText}>
                    GRN Number:{" "}
                    <Text style={styles.boldText}>{selectedGRN.grnNumber}</Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Date:{" "}
                    <Text style={styles.boldText}>{selectedGRN.date}</Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Supplier Challan Number:{" "}
                    <Text style={styles.boldText}>
                      {selectedGRN.supplierChallanNumber}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Supplier Challan Date:{" "}
                    <Text style={styles.boldText}>
                      {selectedGRN.supplierChallanDate}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Supplier:{" "}
                    <Text style={styles.boldText}>{selectedGRN.supplier}</Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Inward Number:{" "}
                    <Text style={styles.boldText}>
                      {selectedGRN.inwardNumber}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Inward Date:{" "}
                    <Text style={styles.boldText}>
                      {selectedGRN.inwardDate}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Remarks:{" "}
                    <Text style={styles.boldText}>{selectedGRN.remarks}</Text>
                  </Text>
                  {selectedGRN.rows.map((row, index) => (
                    <View key={index}>
                      <View style={styles.row}>
                        <Text style={styles.modalText}>
                          PO No: <Text style={styles.boldText}>{row.poNo}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Department:{" "}
                          <Text style={styles.boldText}>{row.department}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Category:{" "}
                          <Text style={styles.boldText}>{row.category}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Item Name:{" "}
                          <Text style={styles.boldText}>{row.name}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Unit: <Text style={styles.boldText}>{row.unit}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          PO Qty:{" "}
                          <Text style={styles.boldText}>{row.poQty}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Previous Qty:{" "}
                          <Text style={styles.boldText}>{row.previousQty}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Balance PO Qty:{" "}
                          <Text style={styles.boldText}>
                            {row.balancePoQty}
                          </Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Received Qty:{" "}
                          <Text style={styles.boldText}>{row.receivedQty}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Remarks:{" "}
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
              Are you sure you want to delete this GRN?
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
  noRecordText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#888",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "red",
  },
});

export default GRNGeneralData;
