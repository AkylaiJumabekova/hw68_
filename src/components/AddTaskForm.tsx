import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { createTask, setInputValue } from '../containers/Todo/todoSlice';

export const AddTaskForm: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const inputValue = useSelector((state: RootState) => state.todo.inputValue);
    const isCreating = useSelector((state: RootState) => state.todo.isCreating);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await dispatch(setInputValue(event.target.value));
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (inputValue !== '') {
            await dispatch(createTask({ title: inputValue }));
            await dispatch(setInputValue(''));
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                />
                <button type="submit" disabled={isCreating}>
                    {isCreating ? 'Adding...' : 'Add Task'}
                </button>
            </div>
        </form>
    );
};
