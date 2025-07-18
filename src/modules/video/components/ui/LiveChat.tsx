import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

// (interface และ props อื่นๆ เหมือนเดิม)
interface LiveChatProps<T> {
  data: T[] | null | undefined;
  renderItem: ListRenderItem<T>;
  estimatedItemSize?: number;
  style?: any;
  showSafeArea?: boolean;
  onLoadOlder?: () => Promise<void>;
}

const SCROLL_OFFSET_THRESHOLD = 100;

export const LiveChat = <T extends Record<string, any>>({
  renderItem,
  estimatedItemSize = 60,
  data,
  showSafeArea = true,
  onLoadOlder,
  ...rest
}: LiveChatProps<T>) => {
  const listRef = useRef<FlashList<T>>(null);
  const isScrolledUpRef = useRef(false);
  const lastDataLength = useRef(0);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  const insets = useSafeAreaInsets();

  const memoizedRenderItem = useCallback<ListRenderItem<T>>(
    (props) => renderItem(props),
    [renderItem]
  );

  const keyExtractor = useCallback(
    (item: T, index: number) => `chat-item-${item?.id || index}`,
    []
  );

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > SCROLL_OFFSET_THRESHOLD) {
      isScrolledUpRef.current = true;
    } else {
      isScrolledUpRef.current = false;
      if (showNewMessageButton) {
        setShowNewMessageButton(false);
      }
    }
  }, [showNewMessageButton]);

  useEffect(() => {
    if (!data || data.length === 0 || isLoadingOlder) return;

    const currentDataLength = data.length;
    const hasNewMessage = currentDataLength > lastDataLength.current;

    if (hasNewMessage && isScrolledUpRef.current) {
      setShowNewMessageButton(true);
    }

    lastDataLength.current = currentDataLength;
  }, [data, isLoadingOlder]);


  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToIndex({ index: 0, animated: true });
    setShowNewMessageButton(false);
  }, []);

  const handleLoadOlder = useCallback(async () => {
    if (onLoadOlder && !isLoadingOlder) {
      setIsLoadingOlder(true);
      await onLoadOlder();
      setIsLoadingOlder(false);
    }
  }, [isLoadingOlder, onLoadOlder]);

  const renderLoadingIndicator = () => {
    if (!isLoadingOlder) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color="#888888" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlashList<T>
        ref={listRef}
        data={data}
        renderItem={memoizedRenderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={estimatedItemSize}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        inverted
        onEndReached={handleLoadOlder}
        onEndReachedThreshold={0.8}
        ListFooterComponent={renderLoadingIndicator}
        {...rest}
      />
      {showNewMessageButton && (
        <View style={[styles.newMessageContainer, { bottom: (showSafeArea ? insets.bottom : 0) + 50 }]}>
          <TouchableOpacity style={styles.newMessageButton} onPress={scrollToBottom}>
            <AntDesign name="arrowdown" size={22} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingBottom: 60,
  },
  newMessageContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
  newMessageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 4,
    borderRadius: 100,
  },
  newMessageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});