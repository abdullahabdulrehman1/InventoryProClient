import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from 'react-native'
import { useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { format } from 'date-fns'
import ServerUrl from '../../config/ServerUrl'
import DataCard from '../../utils/DataCard'
import DetailModal from '../../utils/DetailModal'
import ConfirmationModal from '../../utils/ConfirmationModal'
import { ROLES } from '../../auth/role'
import ItemDetailCard from '../../utils/ItemDetailCard'
import DetailHeader from '../../utils/DetailHeader'

const RequisitionData = ({ navigation }) => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [isFetching, setIsFetching] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRequisition, setSelectedRequisition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const userRole = useSelector(state => state?.auth?.user?.role)

  const fetchData = async (pageNumber = 1) => {
    try {
      const token = await SecureStore.getItemAsync('token')
      if (token) {
        setIsFetching(true)
        const response = await axios.get(
          `${ServerUrl}/requisition/showRequisition`,
          {
            params: { page: pageNumber, limit: 10 },
            headers: { Authorization: `Bearer ${token}` }
          }
        )

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
      setPage(prev => prev + 1)
      fetchData(page + 1)
    }
  }

  const handleDelete = async id => {
    const token = await SecureStore.getItemAsync('token')
    try {
      await axios.delete(`${ServerUrl}/requisition/deleteRequisition`, {
        data: { requisitionId: id },
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(data.filter(item => item._id !== id))
      setConfirmVisible(false)
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message)
    }
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    return format(date, 'dd-MM-yyyy')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name='arrow-back'
          size={24}
          color='#fff'
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Requisition Data</Text>
      </View>

      {loading ? (
        <ActivityIndicator size='large' color='#2b6cb0' />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <DataCard
              item={item}
              titleKey='drNumber'
              subtitleKey='department'
              fields={[
                { label: 'Date', key: 'date', format: formatDate }, // Add any additional fields
                { label: 'Requisition Type', key: 'requisitionType' }
              ]}
              actions={
                userRole !== ROLES.VIEW_ONLY
                  ? [
                      {
                        label: 'Show',
                        handler: item => {
                          setSelectedRequisition(item)
                          setModalVisible(true)
                        },
                        style: { backgroundColor: '#3182ce' }
                      },
                      {
                        label: 'Edit',
                        handler: item =>
                          navigation.navigate('RequisitionEdit', {
                            requisition: item
                          }),
                        style: { backgroundColor: '#2b6cb0' }
                      },
                      {
                        label: 'Delete',
                        handler: item => {
                          setDeleteId(item._id)
                          setConfirmVisible(true)
                        },
                        style: { backgroundColor: '#e53e3e' }
                      }
                    ]
                  : []
              }
              style={styles.dataCard}
              onPress={() => {
                setSelectedRequisition(item)
                setModalVisible(true)
              }}
            />
          )}
          keyExtractor={(item, index) => item._id || index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching && <ActivityIndicator size='small' color='#2b6cb0' />
          }
        />
      )}

      <DetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title='Requisition Details'
      >
        {selectedRequisition && (
          <>
            <DetailHeader
              title='DR Number'
              value={selectedRequisition.drNumber || 'N/A'}
            />

            <DetailHeader
              title='Department'
              value={
                selectedRequisition.department || 'No department specified'
              }
            />

            <DetailHeader
              title='Date'
              value={selectedRequisition.date}
              formatValue={formatDate}
            />
            <DetailHeader
              title='Requisition Type'
              value={selectedRequisition.requisitionType}
            />

            {selectedRequisition.items?.map((item, index) => (
              <ItemDetailCard
                key={index}
                title={item.itemName}
                fields={[
                  { label: 'Category', value: item.level3ItemCategory },
                  { label: 'Quantity', value: `${item.quantity} ${item.uom}` },
                  { label: 'Rate', value: `Rs.${item.rate}` },
                  { label: 'Total', value: `Rs.${item.amount}` },
                  { label: 'Remarks', value: item.remarks }
                ]}
              />
            ))}
          </>
        )}
      </DetailModal>

      <ConfirmationModal
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => handleDelete(deleteId)}
        title='Confirm Delete'
        message='Are you sure you want to delete this requisition?'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f7fafc'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b6cb0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 15
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
  }
})

export default RequisitionData
