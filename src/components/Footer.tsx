import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { Filters } from '../types/Filtres';
import { FilterButton } from './FilterButton';
// import { FilterButton } from './FilterButton';

type Props = {
  currentFilter: Filters;
  setCurrentFilter: Dispatch<SetStateAction<Filters>>;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
};

export const Footer: React.FC<Props> = props => {
  const { todos, setTodos, currentFilter, setCurrentFilter } = props;

  const activeTodos = todos.filter(todo => !todo.completed).length;

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filters).map(filterItem => (
          <FilterButton
            key={filterItem}
            filterItem={filterItem}
            setCurrentFilter={setCurrentFilter}
            currentFilter={currentFilter}
          />
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
