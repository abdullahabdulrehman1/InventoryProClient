import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { useSelector } from 'react-redux'
import { ROLES } from '../../auth/role'
import ServerUrl from '../../config/ServerUrl'
import { ScrollView } from 'react-native-gesture-handler'

const IssueGeneralData = ({ navigation }) => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(8)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const userRole = useSelector(state => state?.auth?.user?.role)

  const fetchIssues = async (page, limit) => {
    try {
      const token = await SecureStore.getItemAsync('token')
      if (!token) throw new Error('No token found')

      const response = await axios.get(
        `${ServerUrl}/issueGeneral/get-issue-general?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      return response.data.data || [] // Adjust to your server's response structure
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const loadInitial = async () => {
    setLoading(true)
    try {
      const initialData = await fetchIssues(1, limit)
      setData(initialData)
      setHasMore(initialData.length >= limit)
    } catch (error) {
      console.error(error)
      setData([])
      Alert.alert('Error', 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = async () => {
    if (!hasMore || isFetchingMore) return
    setIsFetchingMore(true)

    try {
      const nextPage = page + 1
      const nextPageData = await fetchIssues(nextPage, limit)
      setData(prev => [...prev, ...nextPageData])
      setPage(nextPage)
      setHasMore(nextPageData.length >= limit)
    } catch (error) {
      console.error(error)
    } finally {
      setIsFetchingMore(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    setPage(1)
    try {
      const initialData = await fetchIssues(1, limit)
      setData(initialData)
      setHasMore(initialData.length >= limit)
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadInitial()
  }, [])

  const handleDelete = async issueId => {
    try {
      const token = await SecureStore.getItemAsync('token')
      await axios.delete(`${ServerUrl}/issueGeneral/delete-issue-general`, {
        data: { id: issueId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      Alert.alert('Success', 'Issue deleted successfully')
      setData(prevData => prevData.filter(item => item._id !== issueId))
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to delete issue')
    } finally {
      setConfirmVisible(false)
    }
  }

  const confirmDelete = id => {
    setDeleteId(id)
    setConfirmVisible(true)
  }

  const closeConfirmModal = () => {
    setConfirmVisible(false)
    setDeleteId(null)
  }

  const handleEdit = issue => {
    navigation.navigate('IssueGeneralEdit', { issue })
  }

  const handleShow = issue => {
    setSelectedIssue(issue)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedIssue(null)
  }

  return (
    <View style={styles.container}>
      {userRole !== ROLES.VIEW_ONLY && (
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('IssueGeneral')}>
            <Ionicons name='arrow-back' size={24} color='black' />
          </TouchableOpacity>
          <Text style={styles.header}>Issue General Data</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size='large' color='#1b1f26' />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <View style={styles.dataRow}>
              <Text>
                S.No: <Text style={styles.boldText}>{index + 1}</Text>
              </Text>
              {item.grnNumber ? (
                <Text>
                  GRN Number:{' '}
                  <Text style={styles.boldText}>{item.grnNumber}</Text>
                </Text>
              ) : (
                <Text>
                  Issue Id: <Text style={styles.boldText}>{item._id}</Text>
                </Text>
              )}

              <Text>
                Issue Date:{' '}
                <Text style={styles.boldText}>
                  {new Date(item.issueDate).toLocaleDateString()}
                </Text>
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
          )}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={hasMore ? handleLoadMore : undefined}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            <ActivityIndicator
              style={{ marginVertical: 20 }}
              size='large'
              color='#1b1f26'
              animating={isFetchingMore}
            />
          )}
          ListEmptyComponent={
            !loading && (
              <Text style={{ textAlign: 'center', color: '#666' }}>
                No issues found
              </Text>
            )
          }
        />
      )}

      {selectedIssue && (
        <Modal
          animationType='slide'
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalHeader}>Issue Details</Text>
                <View style={styles.modalFieldsContainer}>
                  <Text style={styles.modalText}>
                    GRN Number:{' '}
                    <Text style={styles.boldText}>
                      {selectedIssue.grnNumber}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Issue Date:{' '}
                    <Text style={styles.boldText}>
                      {new Date(selectedIssue.issueDate).toLocaleDateString()}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Store:{' '}
                    <Text style={styles.boldText}>{selectedIssue.store}</Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Requisition Type:{' '}
                    <Text style={styles.boldText}>
                      {selectedIssue.requisitionType}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Issue To Unit:{' '}
                    <Text style={styles.boldText}>
                      {selectedIssue.issueToUnit}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Demand No:{' '}
                    <Text style={styles.boldText}>
                      {selectedIssue.demandNo}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Vehicle Type:{' '}
                    <Text style={styles.boldText}>
                      {selectedIssue.vehicleType}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Issue To Department:{' '}
                    <Text style={styles.boldText}>
                      {selectedIssue.issueToDepartment}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Vehicle No:{' '}
                    <Text style={styles.boldText}>
                      {selectedIssue.vehicleNo}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Driver:{' '}
                    <Text style={styles.boldText}>{selectedIssue.driver}</Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Remarks:{' '}
                    <Text style={styles.boldText}>{selectedIssue.remarks}</Text>
                  </Text>
                  {selectedIssue.rows.map((row, index) => (
                    <View key={index}>
                      <View style={styles.row}>
                        <Text style={styles.modalText}>
                          Action:{' '}
                          <Text style={styles.boldText}>{row.action}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Serial No:{' '}
                          <Text style={styles.boldText}>{row.serialNo}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Level 3 Item Category:{' '}
                          <Text style={styles.boldText}>
                            {row.level3ItemCategory}
                          </Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Item Name:{' '}
                          <Text style={styles.boldText}>{row.itemName}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          UOM: <Text style={styles.boldText}>{row.uom}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          GRN Qty:{' '}
                          <Text style={styles.boldText}>{row.grnQty}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Previous Issue Qty:{' '}
                          <Text style={styles.boldText}>
                            {row.previousIssueQty}
                          </Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Balance Qty:{' '}
                          <Text style={styles.boldText}>{row.balanceQty}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Issue Qty:{' '}
                          <Text style={styles.boldText}>{row.issueQty}</Text>
                        </Text>
                        <Text style={styles.modalText}>
                          Row Remarks:{' '}
                          <Text style={styles.boldText}>{row.rowRemarks}</Text>
                        </Text>
                      </View>
                      <View style={styles.separator} />
                    </View>
                  ))}
                </View>
              </ScrollView>
              <TouchableOpacity style={styles.button} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        animationType='slide'
        transparent={true}
        visible={confirmVisible}
        onRequestClose={closeConfirmModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Confirm Delete</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this issue?
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10
  },
  dataRow: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20
  },
  dataButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  actionButton: {
    backgroundColor: '#1b1f26',
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    flex: 1
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10
  },
  boldText: {
    fontWeight: 'bold'
  },
  scrollContentContainer: {
    paddingVertical: 15
  },
  modalFieldsContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20
  },
  rowContainer: {
    maxHeight: '50%'
  },
  listViewRow: {
    marginBottom: 15
  },
  listViewContent: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#f5f5f5'
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10
  },
  rowItem: {
    fontSize: 16,
    marginBottom: 10
  },
  closeButton: {
    backgroundColor: '#1b1f26',
    paddingVertical: 15,
    borderRadius: 20,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 15
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  button: {
    backgroundColor: '#1b1f26',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20
  }
})

export default IssueGeneralData
