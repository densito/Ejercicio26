import logo from './logo.svg';
import './App.css';
import TaskList, { TaskListProvider} from './TodoList';
 
function App() {
  return (
    <div className="App">
      <header className="App-header">
      <TaskListProvider>
      <TaskList />
    </TaskListProvider>
      </header>
    </div>
  );
}

export default App;
