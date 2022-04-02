import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { StoreState, Todo, TodoAction } from "../interfaces";
import axios from "axios";

const API_URL = '/api/todo/';

interface Props {
  list: Todo[];
  setList: (list: Todo[]) => void;
}

const App = ({list, setList}: Props) => {
  const [task, setTask] = useState<string>('');

  const fetchList = () => {
    axios.get(API_URL)
      .then(({data}) => setList(data))
      .catch(e => console.error(e))
  }

  useEffect(() => {
    fetchList()
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  }

  const handleAdd = () => {
    const todoToAdd = {text: task};
    axios.post(API_URL, todoToAdd)
      .then(() => fetchList())
      .catch(e => console.error(e));
    setTask('');
  }

  const handleDelete = (todo: Todo) => {
    axios.delete(API_URL.concat(String(todo.id)))
      .then(() => fetchList())
      .catch(e => console.error(e));
  }


  function toggleComplete(todo: Todo) {
    const todoToUpdate = {
      ...todo,
      is_done: !todo.is_done,
    }
    axios.patch(API_URL.concat(String(todo.id)), todoToUpdate)
      .then(() => fetchList())
      .catch(e => console.error(e));
  }

  const sortedAndDisplayedTodos = list.sort((a, b) => a.id - b.id).map(todo => (
    <>
      <li key={todo.id}>{todo.text}</li>
      <p>{String(todo.is_done)}</p>
      <button onClick={() => handleDelete(todo)}>Click to delete</button>
      <button onClick={() => toggleComplete(todo)}>Toggle complete</button>
    </>
  ))

  return (
    <div>
      <input onChange={(event) => handleChange(event)} value={task}/>
      <button onClick={() => handleAdd()}>Click to add</button>
      {sortedAndDisplayedTodos}
    </div>
  )
};


function mapStateToProps(state: StoreState) {
  return {
    list: state.list
  };
}

function mapDispatchToProps(dispatch: Dispatch<TodoAction>) {
  return {
    setList: (list: Todo[]) => dispatch({
      type: 'SET_LIST',
      payload: list,
    })
  };
}

export const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
