//178. How Do React + TypeScript Work Together?
import React, { useState } from "react";

import TodoList from "./components/TodoList";
import NewTodo from "./components/NewTodo";
import { Todo } from "./todo.model";

const App: React.FC = () => {
  //182. Working with State & Types
  const [todos, setTodos] = useState<Todo[]>([]);

  //181. Cross-Component Communication
  const todoAddHandler = (text: string) => {
    ////183. Managing State Better
    setTodos((prevTodos) => [
      ...prevTodos,
      { id: Math.random().toString(), text: text },
    ]);
  };

  return (
    <div className="App">
      <NewTodo onAddTodo={todoAddHandler} />
      <TodoList items={todos} />
    </div>
  );
};

export default App;
