import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ViewCats from './components/ViewCats';
import AddCat from './components/AddCat';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './UserContext';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/viewcats" element={<ViewCats />} />
          <Route path="/addcat" element={<AddCat />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
