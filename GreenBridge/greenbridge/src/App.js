import React from 'react';
import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import RegLogin from './Pages/Authentication/RegLogin';
import './Login.css';
import Header from './components/Header';
import Admin from './Pages/Dashboard/Admin/Admin';
import Home from './Pages/Home/Home';
import LandingPage from './Pages/Home/LandingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import PendingRequestsPage from './Pages/Dashboard/Admin/PendingRequestPage';
import AllSHGsPage from './Pages/Dashboard/Admin/AllSHGSpage';
import ShgRegistration from './Pages/Dashboard/Shg/ShgRegistration';

function App() {
  return (
    // <Router>
    //   {/* <Header /> */}
    //   <main>
    //   <Routes>
        
    //     {/* <Route path="/." element={<LandingPage/>}/> */}
    //     {/* <Route path="/shg" element={<ShgRegistration/>} />
    //     <<oute path="/admin" element={<Admin />} /> */}
    //     <Route path="/login" element={<RegLogin />} />
    //     <Route path="/signup" element={<RegLogin />} />
    //     <Route path="/" element={<LandingPage />} />
    //   </Routes>
    //   </main>
    // </Router>
    <Router>
      <Routes>
        <Route path="/admin/home" element={<Admin />} />
        <Route path="/admin/pending-requests" element={<PendingRequestsPage />} />
        <Route path="/admin/view-all-shgs" element={<AllSHGsPage />} />
        <Route path='/shgregister' element={<ShgRegistration />} />
        <Route path="/login" element={<RegLogin />} />
        <Route path="/signup" element={<RegLogin />} />
        <Route path="/" element={<LandingPage />} />
        <Route path='/home' element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;
