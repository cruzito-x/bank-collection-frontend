import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/login/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/*" element={<Sidebar />} /> */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
