import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native'
import { useSelector } from 'react-redux'
import { ROLES } from '../../auth/role'
import ServerUrl from '../../config/ServerUrl'
import DataCard from '../../utils/DataCard'
import DetailModal from '../../utils/DetailModal'
import ConfirmationModal from '../../utils/ConfirmationModal'
import DetailHeader from '../../utils/DetailHeader'
import ItemDetailCard from '../../utils/ItemDetailCard'
import SearchBar from '../../utils/SearchBar'
import { format } from 'date-fns'

const formatDate = dateString => {
  const date = new Date(dateString)
  return format(date, 'dd-MM-yyyy')
}
const GRNReturnGeneralData = ({ navigation }) => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(8)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedGRNReturn, setSelectedGRNReturn] = useState(null)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const userRole = useSelector(state => state?.auth?.user?.role)

  const fetchData = async (pageNumber = 1, searchQuery = '') => {
    try {
      const token = await SecureStore.getItemAsync('token')
      if (!token) throw new Error('No token found')

      const endpoint = searchQuery
        ? '/grnReturnGeneral/searchGRNReturnGeneral'
        : '/grnReturnGeneral/get-grn-returns'

      const response = await axios.get(ServerUrl + endpoint, {
        params: {
          ...(searchQuery && { grnrNumber: searchQuery }),
          page: pageNumber,
          limit
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.message) {
        throw new Error(response.data.message)
      }

      return response.data.data || [] // Adjust to your server's response structure
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const loadInitial = async () => {
    setLoading(true)
    try {
      const initialData = await fetchData(1, searchQuery)
      setData(initialData)
      setHasMore(initialData.length >= limit)
      setErrorMessage('')
    } catch (error) {
      setData([])
      setErrorMessage(error.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = async () => {
    if (!hasMore || isFetchingMore) return
    setIsFetchingMore(true)

    try {
      const nextPage = page + 1
      const nextPageData = await fetchData(nextPage, searchQuery)
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
      const initialData = await fetchData(1, searchQuery)
      setData(initialData)
      setHasMore(initialData.length >= limit)
      setErrorMessage('')
    } catch (error) {
      setData([])
      setErrorMessage(error.message || 'Failed to load data')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadInitial()
  }, [searchQuery])

  const handleDelete = async () => {
    const token = await SecureStore.getItemAsync('token')
    try {
      await axios.delete(
        `${ServerUrl}/grnReturnGeneral/delete-grn-return-general`,
        {
          data: { id: deleteId },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      Alert.alert('Success', 'GRN Return deleted successfully.')
      fetchData()
    } catch (error) {
      console.error(
        'Error deleting GRN Return:',
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

  const closeConfirmModal = () => {
    setConfirmVisible(false)
    setDeleteId(null)
  }

  const handleEdit = grnReturn => {
    navigation.navigate('GRNReturnGeneralEdit', { grnReturn })
  }

  const handleShow = grnReturn => {
    setSelectedGRNReturn(grnReturn)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedGRNReturn(null)
  }

  const renderItem = ({ item, index }) => (
    <DataCard
      item={item}
      titleKey='grnrNumber'
      subtitleKey='grnrDate'
      fields={[
        { label: 'GRN Number', key: 'grnNumber' },
        { label: 'GRN Date', key: 'grnDate' },
        { label: 'Remarks', key: 'remarks' }
      ]}
      actions={
        userRole !== ROLES.VIEW_ONLY
          ? [
              {
                label: 'Show',
                handler: handleShow,
                style: { backgroundColor: '#3182ce' }
              },
              {
                label: 'Edit',
                handler: handleEdit,
                style: { backgroundColor: '#2b6cb0' }
              },
              {
                label: 'Delete',
                handler: confirmDelete,
                style: { backgroundColor: '#e53e3e' }
              }
            ]
          : []
      }
      onPress={() => handleShow(item)}
    />
  )

  return (
    <View style={styles.container}>
      {userRole !== ROLES.VIEW_ONLY && (
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('GRNReturnGeneral')}
          >
            <Ionicons name='arrow-back' size={24} color='black' />
          </TouchableOpacity>
          <Text style={styles.header}>GRN Return General Data</Text>
        </View>
      )}

      <SearchBar onSearch={setSearchQuery} />

      {loading ? (
        <ActivityIndicator size='large' color='#1b1f26' />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
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
                No GRN Returns found
              </Text>
            )
          }
        />
      )}

      {selectedGRNReturn && (
        <DetailModal
          visible={modalVisible}
          onClose={closeModal}
          title='GRN Return Details'
        >
          <DetailHeader
            title='GRNR Number'
            value={selectedGRNReturn.grnrNumber || 'N/A'}
          />
          <DetailHeader
            title='GRNR Date'
            value={selectedGRNReturn.grnrDate}
            formatValue={formatDate}
          />
          <DetailHeader
            title='GRN Number'
            value={selectedGRNReturn.grnNumber}
          />
          <DetailHeader
            title='GRN Date'
            value={selectedGRNReturn.grnDate}
            formatValue={formatDate}
          />
          <DetailHeader title='Remarks' value={selectedGRNReturn.remarks} />
          {selectedGRNReturn.rows.map((row, index) => (
            <ItemDetailCard
              key={index}
              title={`Row ${index + 1}`}
              fields={[
                { label: 'Action', value: row.action },
                { label: 'Serial No', value: row.serialNo },
                { label: 'Category', value: row.category },
                { label: 'Item Name', value: row.name },
                { label: 'Unit', value: row.unit },
                { label: 'GRN Qty', value: row.grnQty },
                { label: 'Previous Return Qty', value: row.previousReturnQty },
                { label: 'Balance GRN Qty', value: row.balanceGrnQty },
                { label: 'Return Qty', value: row.returnQty },
                { label: 'Row Remarks', value: row.rowRemarks }
              ]}
            />
          ))}
        </DetailModal>
      )}

      <ConfirmationModal
        visible={confirmVisible}
        onCancel={closeConfirmModal}
        onConfirm={handleDelete}
        title='Confirm Delete'
        message='Are you sure you want to delete this item?'
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
  }
})

export default GRNReturnGeneralData
