import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { format } from 'date-fns'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useSelector } from 'react-redux'
import { ROLES } from '../../auth/role'
import ServerUrl from '../../config/ServerUrl'
import { animationStyles, skeletonStyles } from '../../styles/Animations'
import SkeletonLoader from '../../ui/SkeletonLoader'
import AnimatedLoader from '../../utils/AnimatedLoader'
import ConfirmationModal from '../../utils/ConfirmationModal'
import DataCard from '../../utils/DataCard'
import DetailHeader from '../../utils/DetailHeader'
import DetailModal from '../../utils/DetailModal'
import ItemDetailCard from '../../utils/ItemDetailCard'
import SearchBar from '../../utils/SearchBar'

const RequisitionData = ({ navigation }) => {
  // State Management
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [isFetching, setIsFetching] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRequisition, setSelectedRequisition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Refs and Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const userRole = useSelector(state => state?.auth?.user?.role)

  // Data Fetching
  const fetchData = async (pageNumber = 1, searchQuery = '') => {
    try {
      const token = await SecureStore.getItemAsync('token')
      if (!token) return

      setIsFetching(true)
      const endpoint = searchQuery
        ? '/requisition/searchRequisitionByDrNumber'
        : '/requisition/showRequisition'

      const { data: response } = await axios.get(ServerUrl + endpoint, {
        params: {
          ...(searchQuery && { drNumber: searchQuery }),
          page: pageNumber,
          limit: 10
        },
        headers: { Authorization: `Bearer ${token}` }
      })

      setData(prev =>
        pageNumber === 1 ? response.data : [...prev, ...response.data]
      )
      setTotalPages(response.totalPages)
      setErrorMessage('')
    } catch (error) {
      handleFetchError(error)
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }

  const handleFetchError = error => {
    const message = error.response?.data?.message || 'Error fetching data'
    setErrorMessage(message)
    setData([])
    console.error('Fetch error:', error)
  }

  // Effects
  useEffect(() => {
    fetchData(1)
  }, [])

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start()
    }
  }, [loading])

  // Pagination
  const handleLoadMore = () => {
    if (page < totalPages && !isFetching) {
      setPage(prev => prev + 1)
      fetchData(page + 1, searchQuery)
    }
  }

  // Search Handling
  const handleSearch = searchText => {
    setSearchQuery(searchText)
    setPage(1)
    fetchData(1, searchText)
  }

  // Delete Handling
  const handleDelete = async id => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    try {
      const token = await SecureStore.getItemAsync('token')
      await axios.delete(`${ServerUrl}/requisition/deleteRequisition`, {
        data: { requisitionId: id },
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(prev => prev.filter(item => item._id !== id))
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message)
    } finally {
      setConfirmVisible(false)
    }
  }

  // Date Formatting
  const formatDate = dateString => format(new Date(dateString), 'dd-MM-yyyy')

  // Loading Skeletons
  const renderSkeletons = () =>
    [...Array(5)].map((_, i) => (
      <SkeletonLoader
        key={i}
        style={skeletonStyles.card}
        lines={[
          { width: '60%', height: 20 },
          { width: '40%', height: 16 },
          { width: '50%', height: 16 }
        ]}
      />
    ))

  return (
    <View style={styles.container}>
      {/* Header Section */}
      {userRole !== ROLES.VIEW_ONLY && (
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' size={24} color='#1a365d' />
          </TouchableOpacity>
          <Text style={styles.header}>Requisition Data</Text>
        </View>
      )}

      {/* Search Section */}
      <SearchBar onSearch={handleSearch} />

      {/* Content Section */}
      {loading ? (
        <View style={styles.loadingContainer}>{renderSkeletons()}</View>
      ) : (
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, index) => item._id || index.toString()}
              renderItem={({ item }) => (
                <DataCard
                  item={item}
                  titleKey='drNumber'
                  subtitleKey='department'
                  fields={[
                    { label: 'Date', key: 'date', format: formatDate },
                    { label: 'Type', key: 'requisitionType' }
                  ]}
                  actions={
                    userRole !== ROLES.VIEW_ONLY
                      ? [
                          {
                            label: 'Show',
                            handler: () => {
                              setSelectedRequisition(item)
                              setModalVisible(true)
                            },
                            style: animationStyles.primaryButton
                          },
                          {
                            label: 'Edit',
                            handler: () =>
                              navigation.navigate('RequisitionEdit', {
                                requisition: item
                              }),
                            style: animationStyles.secondaryButton
                          },
                          {
                            label: 'Delete',
                            handler: () => {
                              setDeleteId(item._id)
                              setConfirmVisible(true)
                            },
                            style: animationStyles.dangerButton
                          }
                        ]
                      : []
                  }
                  onPress={() => {
                    setSelectedRequisition(item)
                    setModalVisible(true)
                  }}
                  animation='fadeIn'
                  duration={300}
                />
              )}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isFetching && (
                  <View style={styles.loadingFooter}>
                    <AnimatedLoader color='#2b6cb0' />
                    <Text style={styles.loadingText}>Loading more...</Text>
                  </View>
                )
              }
            />
          )}
        </Animated.View>
      )}

      {/* Modals */}
      <DetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title='Requisition Details'
      >
        {selectedRequisition && (
          <>
            <DetailHeader
              title='DR Number'
              value={selectedRequisition.drNumber}
            />
            <DetailHeader
              title='Department'
              value={selectedRequisition.department}
            />
            <DetailHeader
              title='Date'
              value={formatDate(selectedRequisition.date)}
            />
            <DetailHeader
              title='Type'
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 12,
    color: '#1e3a8a'
  },
  loadingContainer: {
    flex: 1,
    padding: 16
  },
  errorMessage: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 20
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#2563eb'
  }
})

export default RequisitionData
