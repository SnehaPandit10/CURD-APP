import './App.css';
import LogIn from './Components/LogIn';
import SignUp from './Components/SignUp';
import Task from './Components/Task';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LogIn />} />
        <Route path='/signup/' element={<SignUp />} />
        <Route path='/tasks/' element={<Task />} />

      </Routes>
    </Router>
  );
}

export default App;
