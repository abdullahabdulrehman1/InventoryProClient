import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { format } from 'date-fns';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { ROLES } from '../../auth/role';
import ServerUrl from '../../config/ServerUrl';
import { animationStyles, skeletonStyles } from '../../styles/Animations';
import SkeletonLoader from '../../ui/SkeletonLoader';
import ConfirmationModal from '../../utils/ConfirmationModal';
import DataCard from '../../utils/DataCard';
import DetailHeader from '../../utils/DetailHeader';
import DetailModal from '../../utils/DetailModal';
import ItemDetailCard from '../../utils/ItemDetailCard';
import SearchBar from '../../utils/SearchBar';

const GRNGeneralData = ({ navigation }) => {
  // State Management
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const userRole = useSelector(state => state?.auth?.user?.role);

  // Data Fetching
  const fetchData = async (pageNumber = 1, searchQuery = '') => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) return;

      setIsFetching(true);
      const endpoint = searchQuery
        ? '/grnGeneral/searchGRN'
        : '/grnGeneral/get-grn';

      const { data: response } = await axios.get(ServerUrl + endpoint, {
        params: {
          ...(searchQuery && { grnNumber: searchQuery }),
          page: pageNumber,
          limit: 10
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      setData(prev =>
        pageNumber === 1 ? response.data : [...prev, ...response.data]
      );
      setTotalPages(response.totalPages);
      setErrorMessage('');
    } catch (error) {
      handleFetchError(error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const handleFetchError = error => {
    const message = error.response?.data?.message || 'Error fetching data';
    setErrorMessage(message);
    setData([]);
    console.error('Fetch error:', error);
    Alert.alert('Error', message);
  };

  // Effects
  useEffect(() => {
    fetchData(1);
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    }
  }, [loading]);

  // Pagination
  const handleLoadMore = () => {
    if (page < totalPages && !isFetching) {
      setPage(prev => prev + 1);
      fetchData(page + 1, searchQuery);
    }
  };

  // Search Handling
  const handleSearch = searchText => {
    setSearchQuery(searchText);
    setPage(1);
    fetchData(1, searchText);
  };

  // Refresh Handling
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(1).then(() => setRefreshing(false));
  }, []);

  // Delete Handling
  const handleDelete = async grnId => {
    const token = await SecureStore.getItemAsync('token');
    try {
      const response = await axios.delete(
        `${ServerUrl}/grnGeneral/delete-grn/${grnId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      setData(data.filter(item => item._id !== grnId));
      Alert.alert('Success', 'GRN deleted successfully.');
    } catch (error) {
      console.error(
        'Error deleting GRN:',
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        'Error',
        error.response ? error.response.data.message : 'Something went wrong.'
      );
    } finally {
      setConfirmVisible(false);
    }
  };

  // Date Formatting
  const formatDate = dateString => format(new Date(dateString), 'dd-MM-yyyy');

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
    ));

  // Render Item
  const renderItem = ({ item }) => (
    <DataCard
      item={item}
      titleKey='grnNumber'
      subtitleKey='supplier'
      fields={[
        { label: 'Date', key: 'date', format: formatDate },
        { label: 'Inward Number', key: 'inwardNumber' },
        { label: 'Remarks', key: 'remarks' }
      ]}
      actions={
        userRole !== ROLES.VIEW_ONLY
          ? [
              {
                label: 'Show',
                handler: () => {
                  setSelectedGRN(item);
                  setModalVisible(true);
                },
                style: animationStyles.primaryButton
              },
              {
                label: 'Edit',
                handler: () =>
                  navigation.navigate('GRNGeneralEdit', {
                    grn: item
                  }),
                style: animationStyles.secondaryButton
              },
              {
                label: 'Delete',
                handler: () => {
                  setDeleteId(item._id);
                  setConfirmVisible(true);
                },
                style: animationStyles.dangerButton
              }
            ]
          : []
      }
      onPress={() => {
        setSelectedGRN(item);
        setModalVisible(true);
      }}
      animation='fadeIn'
      duration={300}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('GRNGeneral')}>
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
        <Text style={styles.header}>GRN General Data</Text>
      </View>

      {/* Search Section */}
      <SearchBar onSearch={handleSearch} />

      {/* Content Section */}
      {loading ? (
        <View style={styles.loadingContainer}>{renderSkeletons()}</View>
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
        onClose={() => setModalVisible(false)}
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
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => handleDelete(deleteId)}
        title='Confirm Delete'
        message='Are you sure you want to delete this GRN?'
      />
    </View>
  );
};

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
});

export default GRNGeneralData;