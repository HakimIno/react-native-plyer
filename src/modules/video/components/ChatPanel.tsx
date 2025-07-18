import React, { useCallback } from 'react';
import { View, TextInput, StyleSheet, Text, Image } from 'react-native';
import { LiveChat } from './ui';
import { ChatItem } from '../utility/constants/chat';

interface ChatPanelProps {
  isVisible: boolean;
  messages: ChatItem[];
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onSendComment: () => void;
  safeAreaTop: number;
  animatedPanelStyle: any;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  isVisible,
  messages,
  commentText,
  onCommentTextChange,
  onSendComment,
  safeAreaTop,
  animatedPanelStyle,
}) => {
  const renderChatItem = useCallback(({ item }: { item: ChatItem }) => {
    return (
      <View style={styles.chatItemContainer}>
        <View style={styles.userInfoContainer}>
          <Image
            source={{ uri: item.user.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{item.user.name}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{item.description}</Text>
        </View>
      </View>
    );
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.rightPanel}>
      <LiveChat
        data={messages}
        renderItem={renderChatItem}
      />

      <View style={[styles.inputContainer, { height: safeAreaTop + 60 }]}>
        <TextInput
          style={styles.textInput}
          placeholder="พิมพ์ความคิดเห็น..."
          placeholderTextColor="#888"
          value={commentText}
          onChangeText={onCommentTextChange}
          multiline={false}
          maxLength={200}
          returnKeyType="send"
          onSubmitEditing={onSendComment}
          blurOnSubmit={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rightPanel: {
    height: '100%',
    width: '100%',
  },
  chatItemContainer: {
    gap: 4,
    alignItems: 'flex-start',
    padding: 8,
    borderRadius: 12,
  },
  userInfoContainer: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatar: {
    width: 20,
    aspectRatio: 1,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  userName: {
    fontSize: 12,
    color: '#fff',
  },
  messageContainer: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 13,
    color: '#fff',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#101010',
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: '#333',
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#fff',
  },
}); 