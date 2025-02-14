import { Ionicons } from '@expo/vector-icons'
import { CommonActions } from '@react-navigation/native'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
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

const formatDate = dateString => {
  const date = new Date(dateString)
  return format(date, 'dd-MM-yyyy')
}
const POGeneralData = ({ navigation }) => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [isFetching, setIsFetching] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedPO, setSelectedPO] = useState(null)
  const [serverMessage, setServerMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const userRole = useSelector(state => state?.auth?.user?.role)

  const fetchData = async (pageNumber = 1) => {
    try {
      const token = await SecureStore.getItemAsync('token')

      if (token) {
        setIsFetching(true)
        const response = await axios.get(`${ServerUrl}/poGeneral/showPO`, {
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

  const handleLoadMore = () => {
    if (page < totalPages && !isFetching) {
      setPage(prevPage => prevPage + 1)
      fetchData(page + 1)
    }
  }

  const handleDelete = async id => {
    const token = await SecureStore.getItemAsync('token')
    try {
      const response = await axios.delete(`${ServerUrl}/poGeneral/deletePO`, {
        data: {
          purchaseOrderId: id
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data)
      setServerMessage(response.data.message)
      setData(data.filter(item => item._id !== id))
    } catch (error) {
      console.error(
        'Error deleting PO:',
        error.response ? error.response.data : error.message
      )
    } finally {
      setConfirmVisible(false)
    }
  }

  const confirmDelete = id => {
    setDeleteId(id)
    setConfirmVisible(true)
  }

  const handleShow = po => {
    setSelectedPO(po)
    setModalVisible(true)
  }

  const handleEdit = po => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'POGeneral' },
          { name: 'POGeneralEdit', params: { po } }
        ]
      })
    )
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedPO(null)
  }

  const closeConfirmModal = () => {
    setConfirmVisible(false)
    setDeleteId(null)
  }

  const renderItem = ({ item, index }) => (
    <DataCard
      item={item}
      titleKey='poNumber'
      subtitleKey='supplierName'
      fields={[
        { label: 'Date', key: 'date', format: formatDate },
        { label: 'Purchaser', key: 'purchaser' },
        { label: 'Supplier', key: 'supplier' },
        { label: 'Po Delivery', key: 'poDelivery', format: formatDate }
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
      {userRole !== ROLES.VIEW_ONLY && (
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('POGeneral')}>
            <Ionicons name='arrow-back' size={24} color='black' />
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
        <ActivityIndicator size='large' color='#1b1f26' />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id || index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
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
        title='PO Details'
      >
        {selectedPO && (
          <>
            <DetailHeader
              title='PO Number'
              value={selectedPO.poNumber || 'N/A'}
            />
            <DetailHeader
              title='Date'
              formatValue={formatDate}
              value={selectedPO.date}
            />
            <DetailHeader
              title='PO Delivery'
              formatValue={formatDate}
              value={selectedPO.poDelivery}
            />
            <DetailHeader
              title='Requisition Type'
              value={selectedPO.requisitionType}
            />
            <DetailHeader title='Supplier' value={selectedPO.supplier} />
            <DetailHeader title='Store' value={selectedPO.store} />
            <DetailHeader title='Payment' value={selectedPO.payment} />
            <DetailHeader title='Purchaser' value={selectedPO.purchaser} />
            <DetailHeader title='Remarks' value={selectedPO.remarks} />
            {selectedPO.rows.map((row, index) => (
              <ItemDetailCard
                key={index}
                title={row.name}
                fields={[
                  { label: 'PR No', value: row.prNo },
                  { label: 'Department', value: row.department },
                  { label: 'Level 3 Item Category', value: row.category },
                  { label: 'UOM', value: row.uom },
                  { label: 'Quantity', value: row.quantity },
                  { label: 'Rate', value: row.rate },
                  {
                    label: 'Excluding Tax Amount',
                    value: row.excludingTaxAmount
                  },
                  { label: 'GST %', value: row.gstPercent },
                  { label: 'GST Amount', value: row.gstAmount },
                  { label: 'Discount Amount', value: row.discountAmount },
                  {
                    label: 'Other Charges Amount',
                    value: row.otherChargesAmount
                  },
                  { label: 'Total Amount', value: row.totalAmount },
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
        message='Are you sure you want to delete this PO?'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10 // Add padding to the top
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
  messageContainer: {
    padding: 10,
    backgroundColor: '#d4edda',
    borderRadius: 5,
    marginBottom: 10
  },
  messageText: {
    color: '#155724',
    fontSize: 16
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
  }
})

export default POGeneralData
