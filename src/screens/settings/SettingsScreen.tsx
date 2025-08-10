import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen: React.FC = () => {
  const settingsItems = [
    {
      title: 'App Settings',
      icon: 'settings-outline',
      onPress: () => console.log('App Settings'),
    },
    {
      title: 'Video Quality',
      icon: 'videocam-outline',
      onPress: () => console.log('Video Quality'),
    },
    {
      title: 'Storage',
      icon: 'folder-outline',
      onPress: () => console.log('Storage'),
    },
    {
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => console.log('About'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            onPress={item.onPress}
          >
            <View style={styles.settingItemLeft}>
              <Ionicons name={item.icon as any} size={24} color="#fff" />
              <Text style={styles.settingItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 15,
  },
});

export default SettingsScreen; 