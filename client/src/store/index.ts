import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { topScoresApi } from './scoreApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import gameSlice from './gameSlice';

const rootReducer = combineReducers({
  game: gameSlice,
  [topScoresApi.reducerPath]: topScoresApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([topScoresApi.middleware]),
});

setupListeners(store.dispatch);
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
