import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Register from './components/Register';
import Layout from './components/layout';
import Dashboard from './components/dashboard';
import NearBy from './components/Nearby';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route
          path="/*"
          element={
      
        <Layout>
          <Routes>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/NearBy" element={<NearBy />} />
          </Routes>
        </Layout>}
        />
        </Routes>
      </Router>
    </>
  );
}

export default App;

