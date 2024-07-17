import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask, toggleTask } from '../../containers/Todo/todoSlice';
import { RootState, AppDispatch } from '../../app/store';
import { Button, Checkbox } from 'antd';

export const TodoList: React.FC = () => {
    const tasks = useSelector((state: RootState) => state.todo.tasks);
    const loading = useSelector((state: RootState) => state.todo.loading);
    const error = useSelector((state: RootState) => state.todo.error);
    const dispatch: AppDispatch = useDispatch();

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
                        <Checkbox
                            checked={task.completed}
                            onChange={() => {
                                dispatch(toggleTask({ id: task.id, completed: !task.completed }));
                                dispatch(fetchTasks());
                            }}
                        >
                            {task.title}
                        </Checkbox>
                        <Button
                            type="primary"
                            size="small"
                            danger
                            onClick={() => {
                                dispatch(deleteTask(task.id));
                                dispatch(fetchTasks());
                            }}
                        >
                            Delete
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
