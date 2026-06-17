import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from './layout/pages/HomePage';
import { Error404Page } from './layout/pages/errorpage/404Page';
import { Error403Page } from './layout/pages/errorpage/403Page';
import Navbar from './layout/header-footer/Navbar';
import Footer from './layout/header-footer/Footer';
import RegisterPage from './layout/user/RegisterPage';
import ActiveAccount from './layout/user/ActiveAccount';
import LoginPage from './layout/user/LoginPage';
import { ForgotPassword } from './layout/user/ForgotPassword';
import ProfilePage from './layout/user/ProfilePage';

const MyRoutes = () => {
    const [reloadAvatar, setReloadAvatar] = useState(0);
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminPath && <Navbar key={reloadAvatar} />}

            <Routes>
                {/* Customer Routes */}
                <Route path='/' element={<HomePage />} />
                <Route path='/error-403' element={<Error403Page />} />
                <Route path='/error-404' element={<Error404Page />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/active' element={<ActiveAccount />} />
                <Route path='/active/:email/:activationCode' element={<ActiveAccount />} />

                {!isAdminPath && (
                    <Route path='*' element={<Error404Page />} />
                )}
            </Routes>

            {!isAdminPath && <Footer />}
        </>
    );
};


function App() {
    return (
        <div className="App">
            <MyRoutes />
            <ToastContainer
                position='bottom-center'
                autoClose={3000}
                pauseOnFocusLoss={false}
                theme="colored"
            />
        </div>
    );
}

export default App;
