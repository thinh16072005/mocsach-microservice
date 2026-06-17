import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar.jsx';
import NotificationBell from './components/NotificationBell.jsx';

const AdminLayout = () => {
    return (
        <>
            <style>{`
                .admin-layout {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    margin-left: 240px;
                }

                .admin-header {
                    background: #fff;
                    padding: 14px 28px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    border-bottom: 1px solid #F1F5F9;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }

                .admin-content {
                    flex: 1;
                    background: #F8FAFC;
                    padding: 28px;
                    overflow-y: auto;
                }

                .admin-content-inner {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                @media (max-width: 1024px) {
                    .admin-layout {
                        margin-left: 0;
                    }

                    .admin-sidebar {
                        width: 240px !important;
                    }
                }
            `}</style>

            <AdminSidebar />

            <div className='admin-layout'>
                <div className='admin-header'>
                    <NotificationBell />
                </div>
                <div className='admin-content'>
                    <div className='admin-content-inner'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
