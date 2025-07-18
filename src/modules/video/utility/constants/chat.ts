import { faker } from '@faker-js/faker';

export const MAX_CHAT_MESSAGES = 10;
faker.seed(12)

export const generateChatMessages = () => ({
    key: faker.string.uuid(),
    content: faker.lorem.sentence(),
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
    createdAt: faker.date.recent(),
    user: {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        avatar: faker.image.avatar(),
    }
})

export type ChatItem = ReturnType<typeof generateChatMessages>;