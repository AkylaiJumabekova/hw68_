import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../containers/Todo/todoSlice';
import { RootState, AppDispatch } from '../../app/store';

export const TodoList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.todo.tasks);
    const loading = useSelector((state: RootState) => state.todo.loading);
    const error = useSelector((state: RootState) => state.todo.error);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading tasks.</p>;

    return (
        <div>
            <h2>Todo List</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <label>
                            <input type="checkbox" checked={task.completed} readOnly />
                            {task.title}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};
