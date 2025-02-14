import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GenericDetailCard = ({ title, subtitle, details, remarks, style }) => {
  const renderValue = (value) => {
    if (value === undefined || value === null) return <Text style={styles.nullValue}>-</Text>;
    if (typeof value === 'object') {
      return (
        <View style={styles.nestedContainer}>
          {Object.entries(value).map(([k, v]) => (
            <View key={k} style={styles.nestedItem}>
              <Text style={styles.nestedLabel}>{k}:</Text>
              <Text style={styles.nestedValue}>{v}</Text>
            </View>
          ))}
        </View>
      );
    }
    return <Text style={styles.valueText}>{value}</Text>;
  };

  return (
    <View style={[styles.container, style]}>
      {/* Title Section */}
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      )}

      {/* Subtitle Section */}
      {subtitle && (
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleLabel}>{subtitle.label}</Text>
          <View style={styles.subtitleValue}>
            {renderValue(subtitle.value)}
          </View>
        </View>
      )}

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        {details?.map((detail, index) => (
          <View key={`detail-${index}`} style={styles.detailItem}>
            <Text style={styles.detailLabel}>{detail.label}</Text>
            <View style={styles.detailValue}>
              {renderValue(detail.value)}
            </View>
          </View>
        ))}
      </View>

      {/* Remarks Section */}
      {remarks && (
        <View style={styles.remarksContainer}>
          <Text style={styles.remarksLabel}>{remarks.label}</Text>
          <View style={styles.remarksValue}>
            {renderValue(remarks.value)}
          </View>
        </View>
      )}
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
  subtitleContainer: {
    marginBottom: 10,
  },
  subtitleLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  subtitleValue: {
    fontSize: 14,
    color: '#495057',
  },
  detailsContainer: {
    marginVertical: 8,
  },
  detailItem: {
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#495057',
  },
  nestedContainer: {
    marginLeft: 10,
    marginTop: 4,
  },
  nestedItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  nestedLabel: {
    fontSize: 12,
    color: '#868e96',
    marginRight: 4,
  },
  nestedValue: {
    fontSize: 12,
    color: '#495057',
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
  remarksValue: {
    fontSize: 14,
    color: '#495057',
    fontStyle: 'italic',
  },
});

export default GenericDetailCard;