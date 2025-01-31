import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Sidebar from "./components/sidebar/Sidebar";
import { AuthProvider } from "./contexts/authContext/AuthContext";
import { CollectorsDataProvider } from "./contexts/collectorsDataContext/CollectorsDataContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <CollectorsDataProvider>
          <Routes>
            <Route path="/*" element={<Sidebar />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </CollectorsDataProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;
