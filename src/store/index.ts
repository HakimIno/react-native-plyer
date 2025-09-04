import { configureStore } from '@reduxjs/toolkit';
import videoReducer from './slices/videoSlice';

export const store = configureStore({
  reducer: {
    video: videoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 