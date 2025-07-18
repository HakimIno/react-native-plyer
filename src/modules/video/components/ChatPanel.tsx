import React, { useCallback, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LiveChat } from './ui';
import { ChatItem, Gift } from '../utility/constants/chat';
import { useGiftPanel } from '../hooks/useGiftPanel';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';

// --- ตัวอย่างข้อมูลของขวัญ (ปกติควรดึงมาจาก API) ---
const availableGifts: Gift[] = [
  { id: 'g1', name: 'หัวใจ', imageUrl: 'https://media3.giphy.com/headers/eatmypaint/T5Qy0Z6VIMrA.gif', value: 10 },
  { id: 'g2', name: 'จรวด', imageUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ21yMHFtbGltMG44Mjlzdmt0MW52amh3ZXdxOW1oNzY1Y295b2VsMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/IZwQK0BL9LWUG0Xhia/giphy.gif', value: 100 },
  { id: 'g3', name: 'มงกุฎ', imageUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHF4b3lxbDVsemxybG5oOGNtdjBqMTRwNjZoNXJwMTNxdW51cHI2aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/plF8tgseOjxTxOibGs/giphy.gif', value: 500 },
  { id: 'g4', name: 'ดอกไม้', imageUrl: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDZraXo2MHJ4c2Z0a2FsbHg4MGFxempmMnMwaGwzcms4dW5lbTBzbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/SyQTBboqNGUqEgIrKZ/giphy.gif', value: 50 },
  { id: 'g5', name: 'เพชร', imageUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnYwanM4MXZyMmYwZGdrNjNvbGxmMjlxaHlrZTV4cGZwZDg2dWNoMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Vkz2jyr7CQ3YMF60d3/giphy.gif', value: 1000 },
  { id: 'g6', name: 'ดาว', imageUrl: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWltMzIzMzVhcmR5cGhpb3BjMTgxemlzeHI3aHd5d2JqemxtMnR2MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/BETpJXhdjwz7agqLfw/giphy.gif', value: 200 },
  { id: 'g7', name: 'ดาว', imageUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNW5kaTQ1NHRxNTZmcGQ0NzE0bmtudzU2ZWZ4ZW93Y2M3MHF0OXl3YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/CnQgDsivqWZHekeTlu/giphy.gif', value: 200 },
  { id: 'g8', name: 'ดาว', imageUrl: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGFucTBxczBueGlvdjh0ejE1Mzhtb3dteDllNDE2bTE3enRvMGxnMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/kDY7KMvj5pB875gmCY/giphy.gif', value: 200 },
];
// ----------------------------------------------------

interface ChatPanelProps {
  isVisible: boolean;
  messages: ChatItem[];
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onSendComment: () => void;
  // เพิ่ม Prop สำหรับส่งของขวัญ
  onSendGift: (gift: Gift) => void;
  safeAreaTop: number;
  animatedPanelStyle: any;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  isVisible,
  messages,
  commentText,
  onCommentTextChange,
  onSendComment,
  onSendGift, // รับ prop ใหม่
  safeAreaTop,
  animatedPanelStyle,
}) => {
  const [isGiftModalVisible, setGiftModalVisible] = useState(false);



  const renderChatItem = useCallback(({ item }: { item: ChatItem }) => {
    // Render ข้อความแชทปกติ
    if (item.type === 'text') {
      return (
        <View style={styles.chatItemContainer}>
          <View style={styles.userInfoContainer}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{item.user.name}</Text>
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.description}</Text>
          </View>
        </View>
      );
    }

    if (item.type === 'gift' && item.gift) {
      return (
        <View style={styles.giftItemContainer}>
          <View style={styles.userInfoContainer}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{item.user.name}</Text>
            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.giftActionText}>ส่งของขวัญ</Text>
              <Text style={styles.giftActionText}>{item.gift.value}</Text>
            </View>

          </View>
          <View style={styles.giftMessageContainer}>
            <Image source={{ uri: item.gift.imageUrl }} style={styles.giftImage} />
          </View>
        </View>
      );
    }

    return null; // หรือ fallback UI
  }, []);

  const { animatedGiftPanelStyle } = useGiftPanel(isGiftModalVisible);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.rightPanel}>
      <LiveChat data={messages} renderItem={renderChatItem} />

      {/* --- ส่วน Input ที่ปรับปรุงใหม่ --- */}
      <View style={[styles.inputContainer, { paddingBottom: safeAreaTop + 5 }]}>
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
        />
        {/* ปุ่มเปิด Modal ของขวัญ */}
        <TouchableOpacity onPress={() => setGiftModalVisible(true)}>
          <Ionicons name="gift-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* --- Modal สำหรับเลือกของขวัญ --- */}
      <Animated.View style={[animatedGiftPanelStyle, {
        backgroundColor: '#1a1a1a',
        overflow: 'hidden',
      }]}>
        <View style={styles.giftPanelContainer}>
          <View style={styles.headerGiftPanel}>
            <Text style={styles.headerGiftPanelText}>ส่งของขวัญ</Text>
            <TouchableOpacity onPress={() => setGiftModalVisible(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.giftListWrapper}>
            <FlashList
              data={availableGifts}
              numColumns={4}
              contentContainerStyle={styles.giftListContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.giftItem}
                  onPress={() => {
                    onSendGift(item);
                    setGiftModalVisible(false);
                  }}
                >
                  <View style={styles.giftImageContainer}>
                    <Image source={{ uri: item.imageUrl }} style={styles.giftItemImage} />
                    <View style={styles.giftPriceBadge}>
                      <Text style={styles.giftPriceText}>{item.value}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              estimatedItemSize={100}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

// --- ปรับปรุง StyleSheet ---
const styles = StyleSheet.create({
  rightPanel: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)', // เพิ่มพื้นหลังให้เห็นแชทง่ายขึ้น
  },
  // --- Styles สำหรับ Chat Item (Text) ---
  chatItemContainer: {
    gap: 4,
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userInfoContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  userName: {
    fontSize: 13,
    color: '#ccc',
    fontWeight: 'bold',
  },
  messageContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 30, // เยื้องเข้ามาเล็กน้อย
  },
  messageText: {
    fontSize: 13,
    color: '#fff',
  },
  // --- Styles สำหรับ Chat Item (Gift) ---
  giftItemContainer: {
    marginVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
    gap: 6,
  },
  giftActionText: {
    color: '#FFD700', // สีทอง
    fontSize: 11,
  },
  giftMessageContainer: {
    width: 100,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
  },
  giftImage: {
    width: "100%",
    height: "100%",
  },
  giftName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // --- Styles สำหรับ Input ---
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#101010',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10, // ใช้ paddingBottom จาก safeArea
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  textInput: {
    flex: 1, // ทำให้ TextInput ยืดเต็มพื้นที่ที่เหลือ
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
  },
  giftIcon: {
    width: 30,
    height: 30,
  },
  headerGiftPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerGiftPanelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  giftListContainer: {
    padding: 5,
    paddingRight: 15
  },
  giftItem: {
    alignItems: 'center',
    padding: 15,
  },
  giftImageContainer: {
    width: 60,
    height: 60,
    position: 'relative',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(243, 208, 8, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(243, 208, 8, 0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  giftItemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  giftPriceBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255,215,0,0.9)',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  giftPriceText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '600',
  },
  giftItemName: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  giftPanelContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  giftListWrapper: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
});