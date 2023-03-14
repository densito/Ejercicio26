import React, { createContext, useReducer, useContext, useState } from "react";

// create a new context for the task list
const TaskListContext = createContext();

// initial state of the task list
const initialState = {
  tasks: [],
  filter: "all",
};

// reducer function to update state based on action
function taskListReducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.task],
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.taskId),
      };
    case "SET_FILTER":
      return {
        ...state,
        filter: action.filter,
      };
    default:
      return state;
  }
}

export function TaskListProvider(props) {
  const [state, dispatch] = useReducer(taskListReducer, initialState);
  return (
    <TaskListContext.Provider value={{ state, dispatch }}>
      {props.children}
    </TaskListContext.Provider>
  );
}

function TaskForm() {
  const { dispatch } = useContext(TaskListContext);
  const [taskText, setTaskText] = useState("");
  const handleInputChange = (event) => {
    setTaskText(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: "ADD_TASK", task: { id: Date.now(), text: taskText } });
    setTaskText("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={taskText} onChange={handleInputChange} placeholder='Write a task' />
      <button type="submit">Add Task</button>
    </form>
  );
}

export function TaskList() {
  const { state, dispatch } = useContext(TaskListContext);
  const filteredTasks = state.tasks.filter((task) => {
    if (state.filter === "all") return true;
    if (state.filter === "completed") return task.completed;
    if (state.filter === "notCompleted") return !task.completed;
    return false;
  });
  const handleDelete = (taskId) => {
    dispatch({ type: "DELETE_TASK", taskId });
  };
  return (
    <div>
      <div>
        <button onClick={() => dispatch({ type: "SET_FILTER", filter: "all" })}>
          All
        </button>
        <button onClick={() => dispatch({ type: "SET_FILTER", filter: "completed" })}>
          Completed
        </button>
        <button onClick={() => dispatch({ type: "SET_FILTER", filter: "notCompleted" })}>
          Not Completed
        </button>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            {task.text}{" "}
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <TaskListProvider>
      <TaskForm />
      <TaskList />
    </TaskListProvider>
  );
}
