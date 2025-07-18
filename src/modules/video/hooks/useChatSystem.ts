import { useState, useEffect, useRef } from 'react';
import { ChatItem, generateChatMessages } from '../utility/constants/chat';

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
        content: commentText.trim(),
        description: commentText.trim(),
        createdAt: new Date(),
        user: {
          id: Date.now().toString(),
          name: 'คุณ',
          avatar: 'https://via.placeholder.com/32/007AFF/FFFFFF?text=U',
        },
      };

      setMessages(prev => [newComment, ...prev]);
      setCommentText('');
    }
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
  };
}; 