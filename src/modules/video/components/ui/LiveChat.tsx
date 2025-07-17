import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ColorValue,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isModerator?: boolean;
  isVerified?: boolean;
  avatar?: string;
}

interface LiveChatProps {
  messages: ChatMessage[];
  isVisible?: boolean;
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
  colors?: {
    primary?: ColorValue;
    secondary?: ColorValue;
    textColor?: ColorValue;
    backgroundColor?: ColorValue;
    inputBackground?: ColorValue;
    moderatorColor?: ColorValue;
    verifiedColor?: ColorValue;
  };
}

export const LiveChat: React.FC<LiveChatProps> = ({
  messages = [],
  isVisible = false,
  onSendMessage,
  onClose,
  colors = {
    primary: '#007AFF',
    secondary: '#FF4444',
    textColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    inputBackground: 'rgba(255, 255, 255, 0.1)',
    moderatorColor: '#FFD700',
    verifiedColor: '#051FF',
  },
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={styles.messageContainer}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Text style={styles.avatarText}>
            {item.username.charAt(0).toUpperCase()}
          </Text>
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.username.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      {/* Message Content */}
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={[styles.username, { color: colors.textColor }]}>
            {item.username}
          </Text>
          
          {/* Badges */}
          <View style={styles.badges}>
            {item.isModerator && (
              <Ionicons name="shield-checkmark" size={12} color={colors.moderatorColor} />
            )}
            {item.isVerified && (
              <Ionicons name="checkmark-circle" size={12} color={colors.verifiedColor} />
            )}
          </View>
          
          <Text style={[styles.timestamp, { color: colors.textColor }]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <Text style={[styles.messageText, { color: colors.textColor }]}>
          {item.message}
        </Text>
      </View>
    </View>
  );

  if (!isVisible) return null;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textColor }]}>
          Live Chat ({messages.length})
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.textColor} />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.textInput, { 
            backgroundColor: colors.inputBackground,
            color: colors.textColor,
          }]}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message..."
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={!inputMessage.trim()}
        >
          <Ionicons 
            name="send" 
            size={18} 
            color={inputMessage.trim() ? colors.textColor : 'rgba(255, 255, 255, 0.3)'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 300,
    zIndex: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  messagesList: {
    flex: 1
  },
  messagesContent: {
    padding: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 12,
    fontWeight: 600,
    marginRight: 6
  },
  badges: {
    flexDirection: 'row',
    marginRight: 6,
  },
  timestamp: {
    fontSize: 10,
    opacity: 0.7,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 80,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 