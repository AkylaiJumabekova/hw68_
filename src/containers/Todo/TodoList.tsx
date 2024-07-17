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

    const handleDeleteTask = async (id: string) => {
        await dispatch(deleteTask(id));
        await dispatch(fetchTasks());
    };

    const handleToggleTask = async (id: string, completed: boolean) => {
        await dispatch(toggleTask({ id, completed: !completed }));
        await dispatch(fetchTasks());
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading tasks.</p>;

    return (
        <div>
            <h2>Todo List :</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <Checkbox
                            checked={task.completed}
                            onChange={() => handleToggleTask(task.id, task.completed)}
                        >
                            {task.title}
                        </Checkbox>
                        <Button
                            type="primary"
                            size="small"
                            danger
                            style={{ marginLeft: '10px' }}
                            onClick={() => handleDeleteTask(task.id)}
                        >
                            Delete
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
