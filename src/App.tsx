import React from 'react';
import './App.css';
import { TodoList } from '../src/containers/Todo/TodoList';

export const App: React.FC = () => {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
};
