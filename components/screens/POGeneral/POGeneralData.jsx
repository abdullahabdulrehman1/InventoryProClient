import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSelector } from "react-redux";
import { ROLES } from "../../auth/role";
import ServerUrl from "../../config/ServerUrl";

const POGeneralData = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
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
        const response = await axios.get(`${ServerUrl}/poGeneral/showPO`, {
          params: {
            page: pageNumber,
            limit: 2,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
      const response = await axios.delete(`${ServerUrl}/poGeneral/deletePO`, {
        data: {
          purchaseOrderId: id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
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
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: "POGeneral" },
          { name: "POGeneralEdit", params: { po } },
        ],
      })
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPO(null);
  };

  const closeConfirmModal = () => {
    setConfirmVisible(false);
    setDeleteId(null);
  };

  const renderItem = ({ item, index }) => (
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
      {userRole !== ROLES.VIEW_ONLY && (
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("POGeneral")}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>PO General Data</Text>
        </View>
      )}

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
            isFetching ? <ActivityIndicator size="small" color="#1b1f26" /> : null
          }
        />
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