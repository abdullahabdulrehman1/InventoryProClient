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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import ServerUrl from "../../config/ServerUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const POGeneralData = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await axios.get(
          `${ServerUrl}/poGeneral/showPO?token=${token}`
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.delete(`${ServerUrl}/poGeneral/deletePO`, {
        data: {
          token: token,
          purchaseOrderId: id,
        },
      });
      console.log(response.data);
      setServerMessage(response.data.message);
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error(
        "Error deleting PO:",
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

  const handleShow = (po) => {
    setSelectedPO(po);
    setModalVisible(true);
  };

  const handleEdit = (po) => {
    navigation.navigate("POGeneralEdit",{po});
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPO(null);
  };

  const closeConfirmModal = () => {
    setConfirmVisible(false);
    setDeleteId(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>PO General Data</Text>
      </View>
      {serverMessage ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{serverMessage}</Text>
        </View>
      ) : null}
      {loading ? (
        <ActivityIndicator size="large" color="#1b1f26" />
      ) : (
        <ScrollView>
          {data.map((item, index) => (
            <View key={item._id} style={styles.dataRow}>
              <Text>
                S.No: <Text style={styles.boldText}>{index + 1}</Text>
              </Text>
              <Text>
                PO Number: <Text style={styles.boldText}>{item.poNumber}</Text>
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
          ))}
        </ScrollView>
      )}

      {selectedPO && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalHeader}>PO Details</Text>
                <View style={styles.modalFieldsContainer}>
                  <Text style={styles.modalText}>
                    PO Number:{" "}
                    <Text style={styles.boldText}>{selectedPO.poNumber}</Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Date:{" "}
                    <Text style={styles.boldText}>
                      {new Date(selectedPO.date).toLocaleDateString()}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    PO Delivery:{" "}
                    <Text style={styles.boldText}>
                      {new Date(selectedPO.poDelivery).toLocaleDateString()}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Requisition Type:{" "}
                    <Text style={styles.boldText}>
                      {selectedPO.requisitionType}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Supplier:{" "}
                    <Text style={styles.boldText}>{selectedPO.supplier}</Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Store:{" "}
                    <Text style={styles.boldText}>{selectedPO.store}</Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Payment:{" "}
                    <Text style={styles.boldText}>{selectedPO.payment}</Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Purchaser:{" "}
                    <Text style={styles.boldText}>{selectedPO.purchaser}</Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Remarks:{" "}
                    <Text style={styles.boldText}>{selectedPO.remarks}</Text>
                  </Text>
                  {selectedPO.rows.map((row, index) => (
                    <View key={index}>
                      <View style={styles.row}>
                        <Text style={styles.modalText}>
                          PR No: <Text style={styles.boldText}>{row.prNo}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Department:{" "}
                          <Text style={styles.boldText}>{row.department}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Level 3 Item Category:{" "}
                          <Text style={styles.boldText}>{row.category}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Item Name:{" "}
                          <Text style={styles.boldText}>{row.name}</Text>
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
                          Excluding Tax Amount:{" "}
                          <Text style={styles.boldText}>
                            {row.excludingTaxAmount}
                          </Text>
                        </Text>
                        <Text style={styles.modalText}>
                          GST %:{" "}
                          <Text style={styles.boldText}>{row.gstPercent}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          GST Amount:{" "}
                          <Text style={styles.boldText}>{row.gstAmount}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Discount Amount:{" "}
                          <Text style={styles.boldText}>
                            {row.discountAmount}
                          </Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Other Charges Amount:{" "}
                          <Text style={styles.boldText}>
                            {row.otherChargesAmount}
                          </Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Total Amount:{" "}
                          <Text style={styles.boldText}>{row.totalAmount}</Text>
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
              Are you sure you want to delete this PO?
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

export default POGeneralData;
