import { Ionicons } from '@expo/vector-icons'
import { CommonActions } from '@react-navigation/native'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useSelector } from 'react-redux'
import { ROLES } from '../../auth/role'
import ServerUrl from '../../config/ServerUrl'
import DataCard from '../../utils/DataCard'
import DetailModal from '../../utils/DetailModal'
import ConfirmationModal from '../../utils/ConfirmationModal'
import ItemDetailCard from '../../utils/ItemDetailCard'
import DetailHeader from '../../utils/DetailHeader'
import { format } from 'date-fns'

const GRNGeneralData = ({ navigation }) => {
  const formatDate = dateString => {
    const date = new Date(dateString)
    return format(date, 'dd-MM-yyyy')
  }
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [isFetching, setIsFetching] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedGRN, setSelectedGRN] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const userRole = useSelector(state => state?.auth?.user?.role)

  const fetchData = async (pageNumber = 1) => {
    try {
      const token = await SecureStore.getItemAsync('token')

      if (token) {
        setIsFetching(true)
        const response = await axios.get(`${ServerUrl}/grnGeneral/get-grn`, {
          params: {
            page: pageNumber,
            limit: 8
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const { data: newData, totalPages: fetchedTotalPages } = response.data

        setData(prevData =>
          pageNumber === 1 ? newData : [...prevData, ...newData]
        )
        setTotalPages(fetchedTotalPages)
      }
    } catch (error) {
      console.error(
        'Error fetching data:',
        error.response ? error.response.data : error.message
      )
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchData(1)
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData(1).then(() => setRefreshing(false))
  }, [])

  const handleLoadMore = () => {
    if (page < totalPages && !isFetching) {
      setPage(prevPage => prevPage + 1)
      fetchData(page + 1)
    }
  }

  const handleDelete = async grnId => {
    const token = await SecureStore.getItemAsync('token')
    try {
      const response = await axios.delete(
        `${ServerUrl}/grnGeneral/delete-grn/${grnId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(response.data)
      setData(data.filter(item => item._id !== grnId))
      Alert.alert('Success', 'GRN deleted successfully.')
    } catch (error) {
      console.error(
        'Error deleting GRN:',
        error.response ? error.response.data : error.message
      )
      Alert.alert(
        'Error',
        error.response ? error.response.data.message : 'Something went wrong.'
      )
    } finally {
      setConfirmVisible(false)
    }
  }

  const confirmDelete = id => {
    setDeleteId(id)
    setConfirmVisible(true)
  }

  const handleEdit = grn => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'GRNGeneral' },
          { name: 'GRNGeneralEdit', params: { grn } }
        ]
      })
    )
  }

  const handleShow = grn => {
    setSelectedGRN(grn)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedGRN(null)
  }

  const closeConfirmModal = () => {
    setConfirmVisible(false)
    setDeleteId(null)
  }

  const renderItem = ({ item, index }) => (
    <DataCard
      item={item}
      titleKey='grnNumber'
      subtitleKey='supplier'
      fields={[
        { label: 'Date', key: 'date' },
        { label: 'Inward Number', key: 'inwardNumber' },
        { label: 'Remarks', key: 'remarks' }
      ]}
      actions={
        userRole !== ROLES.VIEW_ONLY
          ? [
              {
                label: 'Show',
                handler: item => handleShow(item),
                style: { backgroundColor: '#3182ce' }
              },
              {
                label: 'Edit',
                handler: item => handleEdit(item),
                style: { backgroundColor: '#2b6cb0' }
              },
              {
                label: 'Delete',
                handler: item => confirmDelete(item._id),
                style: { backgroundColor: '#e53e3e' }
              }
            ]
          : []
      }
      style={styles.dataCard}
      onPress={() => handleShow(item)}
    />
  )

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('GRNGeneral')}>
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
        <Text style={styles.header}>GRN General Data</Text>
      </View>

      {loading ? (
        <ActivityIndicator size='large' color='#1b1f26' />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id || index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            isFetching ? (
              <ActivityIndicator size='small' color='#1b1f26' />
            ) : null
          }
        />
      )}

      <DetailModal
        visible={modalVisible}
        onClose={closeModal}
        title='GRN Details'
      >
        {selectedGRN && (
          <>
            <DetailHeader
              title='GRN Number'
              value={selectedGRN.grnNumber || 'N/A'}
            />
            <DetailHeader
              title='Date'
              formatValue={formatDate}
              value={selectedGRN.date}
            />
            <DetailHeader
              title='Supplier Challan Number'
              value={selectedGRN.supplierChallanNumber}
            />
            <DetailHeader
              formatValue={formatDate}
              title='Supplier Challan Date'
              value={selectedGRN.supplierChallanDate}
            />
            <DetailHeader title='Supplier' value={selectedGRN.supplier} />
            <DetailHeader
              title='Inward Number'
              value={selectedGRN.inwardNumber}
            />
            <DetailHeader title='Inward Date' value={selectedGRN.inwardDate} />
            <DetailHeader title='Remarks' value={selectedGRN.remarks} />
            {selectedGRN.rows.map((row, index) => (
              <ItemDetailCard
                key={index}
                title={row.name}
                fields={[
                  { label: 'PO No', value: row.poNo },
                  { label: 'Department', value: row.department },
                  { label: 'Category', value: row.category },
                  { label: 'Unit', value: row.unit },
                  { label: 'PO Quantity', value: row.poQty },
                  { label: 'Previous Quantity', value: row.previousQty },
                  { label: 'Balance PO Quantity', value: row.balancePoQty },
                  { label: 'Received Quantity', value: row.receivedQty },
                  { label: 'Remarks', value: row.rowRemarks }
                ]}
              />
            ))}
          </>
        )}
      </DetailModal>

      <ConfirmationModal
        visible={confirmVisible}
        onCancel={closeConfirmModal}
        onConfirm={() => handleDelete(deleteId)}
        title='Confirm Delete'
        message='Are you sure you want to delete this GRN?'
      />
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
  dataCard: {
    marginHorizontal: 10,
    marginBottom: 15
  },
  itemCard: {
    marginHorizontal: 5,
    marginVertical: 8
  },
  detailLabel: {
    fontSize: 12,
    color: '#718096'
  },
  detailValue: {
    fontSize: 14,
    color: '#2d3748'
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
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  modalFieldsContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10
  },
  boldText: {
    fontWeight: 'bold'
  },
  row: {
    marginBottom: 10
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10
  },
  button: {
    backgroundColor: '#1b1f26',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  noRecordText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888'
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'red'
  }
})

export default GRNGeneralData
