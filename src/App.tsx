/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/Filter';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';

// фильтрация задач в зависимости от выбранного фильтра
function filterTodos(todos: Todo[], filter: FilterStatus): Todo[] {
  switch (filter) {
    case FilterStatus.Active:
      return todos.filter(todo => !todo.completed);
    case FilterStatus.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);

  // ссылка на поле ввода новой задачи
  const inputRef = useRef<HTMLInputElement>(null);

  // загрузка списка задач при монтировании компонента
  useEffect(() => {
    setError('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  // скрытие уведомления об ошибке через 3 секунды
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  // установка фокуса на поле ввода при перезагрузке страницы
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // подсчет количества незавершенных задач
  const todoCount = todos.filter(todo => !todo.completed).length;

  // проверка, выполнены ли все задачи
  const isAllCompleted = todos.every(todo => todo.completed);

  // проверка, есть ли выполненные задачи
  const hasCompleted = todos.some(todo => todo.completed);

  // фильтрация задач в зависимости от выбранного фильтра
  const visibleTodos = filterTodos(todos, filter);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isAllCompleted={isAllCompleted}
          inputRef={inputRef}
        />

        {todos.length > 0 && <TodoList todos={visibleTodos} />}

        {todos.length > 0 && (
          <Footer
            filter={filter}
            todoCount={todoCount}
            hasCompleted={hasCompleted}
            onFilterChange={setFilter}
          />
        )}
      </div>

      <ErrorNotification error={error} onClick={() => setError('')} />
    </div>
  );
};
