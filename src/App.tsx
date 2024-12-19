/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, deleteTodo, addTodo } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';
import { Todo } from './types/Todo';
import { Filters } from './types/Filtres';
import { ErrorNotification } from './components/ErrorNotification';
import { filterTodos } from './utils/filterTodos';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.Empty);
  const [currentFilter, setCurrentFilter] = useState<Filters>(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const onAddTodo = async (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    });
    try {
      const newTodo = await addTodo({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setErrorMessage(ErrorType.AddTodo);
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const onDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorMessage(ErrorType.DeleteTodo);
      throw err;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const filteredTodos = filterTodos(todos, currentFilter);

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(ErrorType.LoadTodos);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAddTodo={onAddTodo} setErrorMessage={setErrorMessage} />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDeleteTodo={onDeleteTodo}
              isLoading={loadingTodoIds.includes(todo.id)}
            />
          ))}
          {tempTodo && (
            <TodoItem todo={tempTodo} isLoading onDeleteTodo={onDeleteTodo} />
          )}
        </section>

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />
        )}
      </div>

      <ErrorNotification error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
