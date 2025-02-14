import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';

const DetailHeader = ({ title, value, style, formatValue }) => {
  const renderValue = (val) => {
    if (val === undefined || val === null) return 'Not available';
    if (typeof val === 'object') return JSON.stringify(val);
    return val.toString();
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{renderValue(title)}</Text>
      <Text style={styles.value}>{formatValue ? formatValue(value) : renderValue(value)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a365d',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#2d3748',
  },
});

export default DetailHeader;