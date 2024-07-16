import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import type { RootState } from '../../app/store';

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

interface TodoState {
    tasks: Task[];
    loading: boolean;
    error: boolean;
}

const initialState: TodoState = {
    tasks: [],
    loading: false,
    error: false,
};

export const fetchTasks = createAsyncThunk<Task[], void, { state: RootState }>('todo/fetchTasks', async () => {
        const response = await axiosApi.get<{ [key: string]: Task }>('/tasks.json');
        return Object.keys(response.data || {}).map((key) => ({
            ...response.data[key],
            id: key,
        }));
    }
);

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state) => {
                state.loading = false;
                state.error = true;
            });
    },
});

export const todoReducer = todoSlice.reducer;
export type { TodoState };
