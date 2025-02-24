import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Sidebar from "./components/sidebar/Sidebar";
import { AuthProvider } from "./contexts/authContext/AuthContext";
import { CollectorsDataProvider } from "./contexts/collectorsDataContext/CollectorsDataContext";
import { ServerStatusProvider } from "./contexts/serverStatusContext/ServerStatusContext";

const App = () => {
  return (
    <AuthProvider>
      <ServerStatusProvider>
        <Router>
          <CollectorsDataProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/*" element={<Sidebar />} />
            </Routes>
          </CollectorsDataProvider>
        </Router>
      </ServerStatusProvider>
    </AuthProvider>
  );
};

export default App;
