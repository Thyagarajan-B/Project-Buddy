import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import ExploreProjects from './pages/ExploreProjects';
import CreateProject from './pages/CreateProject';
import ApplyProject from './pages/ApplyProject';
import GetMyProjects from './pages/GetMyProjects';
import AppliedProjects from './pages/AppliedProject';
import Profile from './pages/Profile';
import GroupChatPage from './pages/GroupChatPage';

function App() {
  const { loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/explore-projects' element={<ExploreProjects />} />
        <Route path='/create-projects' element={<CreateProject />} />
        <Route path='/apply/:id' element={<ApplyProject  />} />
        <Route path='/my-project' element={<GetMyProjects  />} />
        <Route path='/applied' element={<AppliedProjects  />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/group-chat' element={<GroupChatPage/>} /> 
      </Routes>
    </Router>
  );
}

export default App;
