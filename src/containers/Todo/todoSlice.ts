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

export const deleteTask = createAsyncThunk<void, string, { state: RootState }>(
    'todo/deleteTask',
    async (taskId, { dispatch }) => {
        await axiosApi.delete(`/tasks/${taskId}.json`);
        dispatch(fetchTasks());
    }
);

export const toggleTask = createAsyncThunk<void, { id: string, completed: boolean }, { state: RootState }>(
    'todo/toggleTask',
    async ({ id, completed }, { getState, dispatch }) => {
        const { tasks } = getState().todo;
        const task = tasks.find(task => task.id === id);
        if (task) {
            await axiosApi.put(`/tasks/${id}.json`, { ...task, completed });
            dispatch(fetchTasks());
        }
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
            })
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(deleteTask.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteTask.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            .addCase(toggleTask.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(toggleTask.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(toggleTask.rejected, (state) => {
                state.loading = false;
                state.error = true;
            });
    },
});

export const { setInputValue } = todoSlice.actions;
export const todoReducer = todoSlice.reducer;
