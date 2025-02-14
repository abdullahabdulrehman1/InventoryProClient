import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';

const DataCard = ({ 
  item, 
  titleKey,
  subtitleKey,
  fields,
  actions,
  style,
  onPress 
}) => {
  // Add null checks and fallbacks
  const renderValue = (key, value) => {
    if (value === undefined || value === null) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    if (key.toLowerCase().includes('date')) {
      const date = new Date(value);
      return format(date, 'dd-MM-yyyy');
    }
    return value.toString();
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onPress}>
        {/* Title Section */}
        {titleKey && item[titleKey] && (
          <Text style={styles.title}>
            {renderValue(titleKey, item[titleKey])}
          </Text>
        )}

        {/* Subtitle Section */}
        {subtitleKey && item[subtitleKey] && (
          <Text style={styles.subtitle}>
            {renderValue(subtitleKey, item[subtitleKey])}
          </Text>
        )}

        {/* Fields Section */}
        {fields?.map((field, index) => (
          <Text key={`field-${index}`} style={styles.fieldText}>
            {field.label}: {field.format ? field.format(item[field.key]) : renderValue(field.key, item[field.key])}
          </Text>
        ))}

        {/* Actions Section */}
        {actions && (
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={`action-${index}`}
                style={[styles.button, action.style]}
                onPress={() => action.handler(item)}
              >
                <Text style={styles.buttonText}>
                  {action.label || 'Action'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 10,
  },
  fieldText: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 3,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    gap: 8,
  },
  button: {
    backgroundColor: '#2b6cb0',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default DataCard;