import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { API_BASE } from '../config';
type TopScore = { name: string; score: number; id: number };

export const topScoresApi = createApi({
  reducerPath: 'topScores',
  baseQuery: fetchBaseQuery({
    // baseUrl: API_BASE || 'https://localhost:8001/api/scores',
    baseUrl: '/api/scores',
  }),
  tagTypes: ['Scores'],
  endpoints: builder => ({
    getTop20Scores: builder.query<Array<TopScore>, void>({
      query: () => '/',
      providesTags: ['Scores'],
    }),
    saveScore: builder.mutation({
      query: (body: Omit<TopScore, 'id'>) => ({
        url: `/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Scores'],
    }),
  }),
});

export const { useGetTop20ScoresQuery, useSaveScoreMutation } = topScoresApi;
