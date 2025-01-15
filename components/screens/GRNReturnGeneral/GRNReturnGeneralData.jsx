import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
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

const GRNReturnGeneralData = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGRNReturn, setSelectedGRNReturn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const userRole = useSelector((state) => state?.auth?.user?.role);

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        `${ServerUrl}/grnReturnGeneral/get-grn-returns`,
        {
          params: { token },
        }
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

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const handleDelete = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.delete(
        `${ServerUrl}/grnReturnGeneral/delete-grn-return-general`,
        {
          params: { token },
          data: { id: deleteId },
        }
      );

      Alert.alert("Success", "GRN Return deleted successfully.");
      fetchData();
    } catch (error) {
      console.error(
        "Error deleting GRN Return:",
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

  const handleEdit = (grnReturn) => {
    navigation.navigate("GRNReturnGeneralEdit", { grnReturn });
  };

  const handleShow = (grnReturn) => {
    setSelectedGRNReturn(grnReturn);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedGRNReturn(null);
  };

  return (
    <View style={styles.container}>
      {userRole !== ROLES.VIEW_ONLY && (
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("GRNReturnGeneral")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>GRN Return General Data</Text>
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
          {data.map((item, index) => (
            <View key={item._id} style={styles.dataRow}>
              <Text>
                S.No: <Text style={styles.boldText}>{index + 1}</Text>
              </Text>
              <Text>
                GRNR Number:{" "}
                <Text style={styles.boldText}>{item.grnrNumber}</Text>
              </Text>
              <Text>
                GRNR Date: <Text style={styles.boldText}>{item.grnrDate}</Text>
              </Text>
              <Text>
                GRN Number:{" "}
                <Text style={styles.boldText}>{item.grnNumber}</Text>
              </Text>
              <Text>
                GRN Date: <Text style={styles.boldText}>{item.grnDate}</Text>
              </Text>
              <Text>
                Remarks: <Text style={styles.boldText}>{item.remarks}</Text>
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
          ))}
        </ScrollView>
      )}

      {selectedGRNReturn && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalHeader}>GRN Return Details</Text>
                <View style={styles.modalFieldsContainer}>
                  <Text style={styles.modalText}>
                    GRNR Number:{" "}
                    <Text style={styles.boldText}>
                      {selectedGRNReturn.grnrNumber}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    GRNR Date:{" "}
                    <Text style={styles.boldText}>
                      {selectedGRNReturn.grnrDate}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    GRN Number:{" "}
                    <Text style={styles.boldText}>
                      {selectedGRNReturn.grnNumber}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    GRN Date:{" "}
                    <Text style={styles.boldText}>
                      {selectedGRNReturn.grnDate}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Remarks:{" "}
                    <Text style={styles.boldText}>
                      {selectedGRNReturn.remarks}
                    </Text>
                  </Text>
                  {selectedGRNReturn.rows.map((row, index) => (
                    <View key={index}>
                      <View style={styles.row}>
                        <Text style={styles.modalText}>
                          Action:{" "}
                          <Text style={styles.boldText}>{row.action}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          S.No:{" "}
                          <Text style={styles.boldText}>{row.serialNo}</Text>
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
                          GRN Qty:{" "}
                          <Text style={styles.boldText}>{row.grnQty}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Previous Return Qty:{" "}
                          <Text style={styles.boldText}>
                            {row.previousReturnQty}
                          </Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Balance GRN Qty:{" "}
                          <Text style={styles.boldText}>
                            {row.balanceGrnQty}
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
              Are you sure you want to delete this item?
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
                onPress={handleDelete}
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
  cancelButton: {
    backgroundColor: "#ccc",
  },
  deleteButton: {
    backgroundColor: "red",
  },
});

export default GRNReturnGeneralData;
