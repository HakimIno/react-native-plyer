import { useState, useEffect, useRef } from 'react';
import { ChatItem, generateChatMessages, generateGiftMessage, Gift } from '../utility/constants/chat';

const chatSpeed = {
  slow: [1000, 1000],
  medium: [500, 500],
  fast: [250, 250],
  "very fast": [100, 100],
} as const;

const MAX_CHAT_MESSAGES = 30;

type ChatSpeed = keyof typeof chatSpeed;

export const useChatSystem = (isFullscreen: boolean) => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [commentText, setCommentText] = useState('');
  const [speed, setSpeed] = useState<ChatSpeed>('slow');
  const timeOut = useRef<NodeJS.Timeout | null>(null);
  const isGeneratingRef = useRef(false);

  const generateData = () => {
    if (timeOut.current) {
      clearTimeout(timeOut.current);
      timeOut.current = null;
    }

    if (!isChatVisible || !isFullscreen) {
      isGeneratingRef.current = false;
      return;
    }

    const selectedSpeed = chatSpeed[speed];
    const timer = Math.random() * selectedSpeed[0] + selectedSpeed[1];

    timeOut.current = setTimeout(() => {
      if (!isChatVisible || !isFullscreen) {
        isGeneratingRef.current = false;
        return;
      }

      setMessages((prevMessages) => {
        const newMessage = generateChatMessages();
        const updatedMessages = [newMessage, ...prevMessages];
        if (updatedMessages.length > MAX_CHAT_MESSAGES) {
          return updatedMessages.slice(0, MAX_CHAT_MESSAGES);
        }
        return updatedMessages;
      });

      if (isGeneratingRef.current) {
        generateData();
      }
    }, timer);
  };

  useEffect(() => {
    if (isChatVisible && isFullscreen) {
      isGeneratingRef.current = true;
      generateData();
    } else {
      isGeneratingRef.current = false;
      if (timeOut.current) {
        clearTimeout(timeOut.current);
        timeOut.current = null;
      }
    }
    return () => {
      isGeneratingRef.current = false;
      if (timeOut.current) {
        clearTimeout(timeOut.current);
        timeOut.current = null;
      }
    };
  }, [isChatVisible, isFullscreen, speed]);

  useEffect(() => {
    if (!isChatVisible) {
      setMessages([]);
    }
  }, [isChatVisible]);

  const handleChatPress = () => {
    setIsChatVisible(prev => !prev);
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      const newComment: ChatItem = {
        key: Date.now().toString(),
        type: 'text',
        content: commentText.trim(),
        description: commentText.trim(),
        createdAt: new Date(),
        user: {
          id: Date.now().toString(),
          name: 'คุณ',
          avatar: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHJxMHJtOW15aTlieGhveWJldmo3NWVkenRqa3o3czJ3Z3VzcHhzZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Cguzl9rNeqfPpIO7Yu/giphy.gif',
        },
      };

      setMessages(prev => [newComment, ...prev]);
      setCommentText('');
    }
  };

  const handleSendGift = (gift: Gift) => {
    const newGiftMessage: ChatItem = {
      key: Date.now().toString(),
      type: 'gift',
      content: `ส่งของขวัญ ${gift.name}`,
      description: `ส่งของขวัญ ${gift.name} มูลค่า ${gift.value} Coins`,
      createdAt: new Date(),
      user: {
        id: Date.now().toString(),
        name: 'คุณ',
        /* The `avatar` property in the ChatItem object is used to store the URL of the avatar image
        associated with the user who sent the chat message. It is used to display the user's avatar
        alongside their chat message in the chat interface. The avatar image provides a visual
        representation of the user and helps users identify who sent each message in the chat. */
        avatar: 'https://png.pngtree.com/png-clipart/20231002/original/pngtree-cute-cartoon-cat-png-image_13060428.png',
      },
      gift: gift,
    };

    setMessages(prev => [newGiftMessage, ...prev]);
  };

  return {
    isChatVisible,
    messages,
    commentText,
    setCommentText,
    speed,
    setSpeed,
    handleChatPress,
    handleSendComment,
    handleSendGift,
  };
}; 