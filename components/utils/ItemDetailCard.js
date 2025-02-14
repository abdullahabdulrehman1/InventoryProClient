import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ItemDetailCard = ({ title, fields, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {fields.map((field, index) => (
        <View key={index} style={styles.detailItem}>
          <Text style={styles.label}>{field.label}:</Text>
          <Text style={styles.value}>{field.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
  },
  detailItem: {
    marginBottom: 6,
  },
  total: {
    fontWeight: '600',
    color: '#2b8a3e',
  },
  remarksContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  remarksLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  remarksText: {
    fontSize: 14,
    color: '#495057',
    fontStyle: 'italic',
  },
});

export default ItemDetailCard;