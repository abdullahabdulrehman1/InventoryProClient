import axios from 'axios';
import { format } from 'date-fns';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { ROLES } from '../../auth/role';
import ServerUrl from '../../config/ServerUrl';
import ConfirmationModal from '../../utils/ConfirmationModal';
import DataCard from '../../utils/DataCard';
import DetailHeader from '../../utils/DetailHeader';
import DetailModal from '../../utils/DetailModal';
import ItemDetailCard from '../../utils/ItemDetailCard';
import SearchBar from '../../utils/SearchBar';

const formatDate = dateString => {
  const date = new Date(dateString);
  return format(date, 'dd-MM-yyyy');
};

const IssueGeneralData = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const userRole = useSelector(state => state?.auth?.user?.role);

  const fetchIssues = async (pageNumber = 1, searchQuery = '') => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('No token found');

      const endpoint = searchQuery
        ? '/issueGeneral/searchIssueGeneral'
        : '/issueGeneral/get-issue-general';

      const response = await axios.get(ServerUrl + endpoint, {
        params: {
          ...(searchQuery && { issueNumber: searchQuery }),
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
      const initialData = await fetchIssues(1, searchQuery);
      setData(initialData);
      setHasMore(initialData.length >= limit);
      setErrorMessage('');
    } catch (error) {
      setData([]);
      setErrorMessage('No Entry Found');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || isFetchingMore) return;
    setIsFetchingMore(true);

    try {
      const nextPage = page + 1;
      const nextPageData = await fetchIssues(nextPage, searchQuery);
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
      const initialData = await fetchIssues(1, searchQuery);
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

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    }
  }, [loading]);

  const handleDelete = async issueId => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.delete(`${ServerUrl}/issueGeneral/delete-issue-general`, {
        data: { id: issueId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      Alert.alert('Success', 'Issue deleted successfully');
      setData(prevData => prevData.filter(item => item._id !== issueId));
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete issue');
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

  const handleEdit = issue => {
    navigation.navigate('IssueGeneralEdit', { issue });
  };

  const handleShow = issue => {
    setSelectedIssue(issue);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedIssue(null);
  };

  const renderItem = ({ item }) => (
    <DataCard
      item={item}
      titleKey={'issueNumber' }
      subtitleKey='issueDate'
      fields={[
        { label: 'Store', key: 'store' },
        { label: 'Driver', key: 'driver' },
        { label: 'Vehicle', key: 'vehicleType' }
      ]}
      actions={
        userRole !== ROLES.VIEW_ONLY
          ? [
              {
                label: 'Show',
                handler: () => handleShow(item),
                style: { backgroundColor: '#3182ce' }
              },
              {
                label: 'Edit',
                handler: () => handleEdit(item),
                style: { backgroundColor: '#2b6cb0' }
              },
              {
                label: 'Delete',
                handler: () => confirmDelete(item._id),
                style: { backgroundColor: '#e53e3e' }
              }
            ]
          : []
      }
      onPress={() => handleShow(item)}
    />
  );

  return (
    <View style={styles.container}>
      

      <SearchBar onSearch={setSearchQuery} />

      {loading ? (
        <ActivityIndicator size='large' color='#1b1f26' />
      ) : (
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
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
                    No issues found
                  </Text>
                )
              }
            />
          )}
        </Animated.View>
      )}

      {selectedIssue && (
        <DetailModal
          visible={modalVisible}
          onClose={closeModal}
          title='Issue Details'
        >{selectedIssue.grnNumber && (  <DetailHeader
          title={'GRN Number'}
          value={selectedIssue.grnNumber}
        />)}
          <DetailHeader
            title={'Issue Number'}
            value={selectedIssue.issueNumber}
          />
          <DetailHeader
            title='Issue Date'
            formatValue={formatDate}
            value={selectedIssue.issueDate}
          />
          <DetailHeader title='Store' value={selectedIssue.store} />
          <DetailHeader
            title='Requisition Type'
            value={selectedIssue.requisitionType}
          />
          <DetailHeader
            title='Issue To Unit'
            value={selectedIssue.issueToUnit}
          />
          <DetailHeader title='Demand No' value={selectedIssue.demandNo} />
          <DetailHeader
            title='Vehicle Type'
            value={selectedIssue.vehicleType}
          />
          <DetailHeader
            title='Issue To Department'
            value={selectedIssue.issueToDepartment}
          />
          <DetailHeader title='Vehicle No' value={selectedIssue.vehicleNo} />
          <DetailHeader title='Driver' value={selectedIssue.driver} />
          <DetailHeader title='Remarks' value={selectedIssue.remarks} />
          {selectedIssue.rows.map((row, index) => (
            <ItemDetailCard
              key={index}
              title={`Row ${index + 1}`}
              fields={[
                { label: 'Action', value: row.action },
                { label: 'Serial No', value: row.serialNo },
                {
                  label: 'Item Category',
                  value: row.level3ItemCategory
                },
                { label: 'Item Name', value: row.itemName },
                { label: 'UOM', value: row.uom },
                { label: 'GRN Qty', value: row.grnQty },
                { label: 'Previous Issue Qty', value: row.previousIssueQty },
                { label: 'Balance Qty', value: row.balanceQty },
                { label: 'Issue Qty', value: row.issueQty },
                { label: 'Row Remarks', value: row.rowRemarks }
              ]}
            />
          ))}
        </DetailModal>
      )}

      <ConfirmationModal
        visible={confirmVisible}
        onCancel={closeConfirmModal}
        onConfirm={() => handleDelete(deleteId)}
        title='Confirm Delete'
        message='Are you sure you want to delete this issue?'
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
  errorMessage: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 20
  }
});

export default IssueGeneralData;