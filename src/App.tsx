import React from 'react';
import './App.css';
import { TodoList } from './containers/Todo/TodoList';
import { AddTaskForm } from '../src/containers/AddTaskForm';

export const App: React.FC = () => {
    return (
        <div className="App">
            <AddTaskForm />
            <TodoList />
        </div>
    );
};
