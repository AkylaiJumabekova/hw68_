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
    inputValue: string;
    isCreating: boolean;
}

const initialState: TodoState = {
    tasks: [],
    loading: false,
    error: false,
    inputValue: '',
    isCreating: false,
};

export const fetchTasks = createAsyncThunk<Task[], void, { state: RootState }>(
    'todo/fetchTasks',
    async () => {
        const response = await axiosApi.get<{ [key: string]: Task }>('/tasks.json');
        return Object.keys(response.data || {}).map((key) => ({
            ...response.data[key],
            id: key,
        }));
    }
);

export const createTask = createAsyncThunk<void, { title: string }, { state: RootState }>(
    'todo/createTask',
    async (taskData, { dispatch }) => {
        await axiosApi.post('/tasks.json', {
            ...taskData,
            completed: false,
        });
        dispatch(fetchTasks());
    }
);

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        setInputValue: (state, action: PayloadAction<string>) => {
            state.inputValue = action.payload;
        },
    },
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
            })
            .addCase(createTask.pending, (state) => {
                state.isCreating = true;
                state.error = false;
            })
            .addCase(createTask.fulfilled, (state) => {
                state.isCreating = false;
            })
            .addCase(createTask.rejected, (state) => {
                state.isCreating = false;
                state.error = true;
            });
    },
});

export const { setInputValue } = todoSlice.actions;
export const todoReducer = todoSlice.reducer;
