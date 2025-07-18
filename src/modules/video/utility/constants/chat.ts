import { faker } from '@faker-js/faker';

export const MAX_CHAT_MESSAGES = 10;
faker.seed(12)

// เพิ่ม type สำหรับ Gift
export interface Gift {
  id: string;
  name: string;
  imageUrl: string;
  value: number;
}

// อัปเดต ChatItem type ให้รองรับทั้ง text และ gift
export interface ChatItem {
  key: string;
  type: 'text' | 'gift';
  content: string;
  description: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  gift?: Gift; // เพิ่ม gift property สำหรับ type 'gift'
}

export const generateChatMessages = (): ChatItem => ({
    key: faker.string.uuid(),
    type: 'text',
    content: faker.lorem.sentence(),
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
    createdAt: faker.date.recent(),
    user: {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        avatar: faker.image.avatar(),
    }
})

// ฟังก์ชันสำหรับสร้าง gift message
export const generateGiftMessage = (gift: Gift): ChatItem => ({
    key: faker.string.uuid(),
    type: 'gift',
    content: `ส่งของขวัญ ${gift.name}`,
    description: `ส่งของขวัญ ${gift.name} มูลค่า ${gift.value} Coins`,
    createdAt: faker.date.recent(),
    user: {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        avatar: faker.image.avatar(),
    },
    gift: gift
})