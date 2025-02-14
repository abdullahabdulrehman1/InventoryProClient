import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native';
import { useSelector } from 'react-redux';
import { ROLES } from '../../auth/role';
import ServerUrl from '../../config/ServerUrl';
import DataCard from '../../utils/DataCard';
import DetailModal from '../../utils/DetailModal';
import ConfirmationModal from '../../utils/ConfirmationModal';
import ItemDetailCard from '../../utils/ItemDetailCard';
import DetailHeader from '../../utils/DetailHeader';
import SearchBar from '../../utils/SearchBar';
import { format } from 'date-fns';

const formatDate = dateString => {
  const date = new Date(dateString);
  return format(date, 'dd-MM-yyyy');
};

const IssueReturnGeneralData = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIssueReturn, setSelectedIssueReturn] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const userRole = useSelector(state => state?.auth?.user?.role);

  const fetchData = async (pageNumber = 1, searchQuery = '') => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('No token found');

      const endpoint = searchQuery
        ? '/issueReturnGeneral/searchIssueReturnGeneral'
        : '/issueReturnGeneral/get-issue-return-general';

      const response = await axios.get(ServerUrl + endpoint, {
        params: {
          ...(searchQuery && { irNumber: searchQuery }),
          page: pageNumber,
          limit
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.message) {
        throw new Error(response.data.message);
      }

      return response.data.data || []; // Adjust to your server's response structure
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const loadInitial = async () => {
    setLoading(true);
    try {
      const initialData = await fetchData(1, searchQuery);
      setData(initialData);
      setHasMore(initialData.length >= limit);
      setErrorMessage('');
    } catch (error) {
      setData([]);
      setErrorMessage(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || isFetchingMore) return;
    setIsFetchingMore(true);

    try {
      const nextPage = page + 1;
      const nextPageData = await fetchData(nextPage, searchQuery);
      setData(prev => [...prev, ...nextPageData]);
      setPage(nextPage);
      setHasMore(nextPageData.length >= limit);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    try {
      const initialData = await fetchData(1, searchQuery);
      setData(initialData);
      setHasMore(initialData.length >= limit);
      setErrorMessage('');
    } catch (error) {
      setData([]);
      setErrorMessage(error.message || 'Failed to load data');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInitial();
  }, [searchQuery]);

  const handleDelete = async issueReturnId => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.delete(
        `${ServerUrl}/issueReturnGeneral/delete-issue-return-general`,
        {
          data: { id: issueReturnId },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      Alert.alert('Success', 'Issue Return deleted successfully.');
      fetchData(1);
    } catch (error) {
      console.error(
        'Error deleting issue return:',
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

  const confirmDelete = id => {
    setDeleteId(id);
    setConfirmVisible(true);
  };

  const closeConfirmModal = () => {
    setConfirmVisible(false);
    setDeleteId(null);
  };

  const handleEdit = issueReturn => {
    navigation.navigate('IssueReturnGeneralEdit', { issueReturn });
  };

  const handleShow = issueReturn => {
    setSelectedIssueReturn(issueReturn);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedIssueReturn(null);
  };

  const renderItem = ({ item, index }) => (
    <DataCard
      item={item}
      titleKey='irNumber'
      subtitleKey='irDate'
      fields={[
        { label: 'DR Number', key: 'drNumber' },
        { label: 'DR Date', key: 'drDate' }
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
  );

  return (
    <View style={styles.container}>
      {userRole !== ROLES.VIEW_ONLY && (
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('IssueReturnGeneral')}
          >
            <Ionicons name='arrow-back' size={24} color='black' />
          </TouchableOpacity>
          <Text style={styles.header}>Issue Return General Data</Text>
        </View>
      )}

      <SearchBar onSearch={setSearchQuery} />

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
            isFetchingMore ? (
              <ActivityIndicator size='small' color='#1b1f26' />
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <Text style={{ textAlign: 'center', color: '#666' }}>
                No issue returns found
              </Text>
            )
          }
        />
      )}

      <DetailModal
        visible={modalVisible}
        onClose={closeModal}
        title='Issue Return Details'
      >
        {selectedIssueReturn && (
          <>
            <DetailHeader
              title='IR Number'
              value={selectedIssueReturn.irNumber || 'N/A'}
            />
            <DetailHeader
              title='IR Date'
              formatValue={formatDate}
              value={selectedIssueReturn.irDate}
            />
            <DetailHeader
              title='DR Number'
              value={selectedIssueReturn.drNumber}
            />
            <DetailHeader
              title='DR Date'
              formatValue={formatDate}
              value={selectedIssueReturn.drDate}
            />
            <DetailHeader title='Remarks' value={selectedIssueReturn.remarks} />
            {selectedIssueReturn.rows.map((row, index) => (
              <ItemDetailCard
                key={index}
                title={`Row ${index + 1}`}
                fields={[
                  { label: 'Action', value: row.action },
                  { label: 'Serial No', value: row.serialNo },
                  {
                    label: 'Level 3 Item Category',
                    value: row.level3ItemCategory
                  },
                  { label: 'Item Name', value: row.itemName },
                  { label: 'Unit', value: row.unit },
                  { label: 'Issue Qty', value: row.issueQty },
                  {
                    label: 'Previous Return Qty',
                    value: row.previousReturnQty
                  },
                  { label: 'Balance Issue Qty', value: row.balanceIssueQty },
                  { label: 'Return Qty', value: row.returnQty },
                  { label: 'Row Remarks', value: row.rowRemarks }
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
        message='Are you sure you want to delete this issue return?'
      />
    </View>
  );
};

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
  }
});

export default IssueReturnGeneralData;