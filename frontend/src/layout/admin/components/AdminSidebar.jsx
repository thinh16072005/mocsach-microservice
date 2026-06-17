import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../utils/JwtService';
import BookIcon from '@mui/icons-material/Book';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const NAV_ITEMS = [
    { to: '/admin/books', icon: <BookIcon sx={{ fontSize: 18 }} />, label: 'Sách' },
    { to: '/admin/genres', icon: <CategoryIcon sx={{ fontSize: 18 }} />, label: 'Thể loại' },
    { to: '/admin/users', icon: <PeopleIcon sx={{ fontSize: 18 }} />, label: 'Tài khoản' },
    { to: '/admin/orders', icon: <ShoppingCartIcon sx={{ fontSize: 18 }} />, label: 'Đơn hàng' },
    { to: '/admin/feedback', icon: <FeedbackIcon sx={{ fontSize: 18 }} />, label: 'Feedback' },
    { to: '/admin/coupon', icon: <LocalOfferIcon sx={{ fontSize: 18 }} />, label: 'Mã giảm giá' },
];

const AdminSidebar = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
        };
        if (showDropdown) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showDropdown]);

    return (
        <>
            <style>{`
                .admin-sidebar {
                    width: 240px;
                    height: 100vh;
                    background: #0F172A;
                    color: #94A3B8;
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    left: 0; top: 0;
                    padding: 0; margin: 0;
                    overflow-y: auto;
                    box-shadow: 2px 0 20px rgba(0,0,0,0.25);
                    z-index: 1030;
                }

                .sidebar-header {
                    padding: 28px 20px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    flex-shrink: 0;
                }
                .sidebar-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .sidebar-brand-symbol {
                    color: #2C7B8F;
                    font-size: 18px;
                    line-height: 1;
                }
                .sidebar-brand-name {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 17px;
                    font-weight: 400;
                    color: #F1F5F9;
                    letter-spacing: 0.3px;
                }
                .sidebar-brand-sub {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 10px;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    color: #475569;
                    margin-top: 2px;
                }

                .sidebar-nav {
                    flex: 1;
                    padding: 12px 10px;
                    overflow-y: auto;
                }
                .sidebar-section-label {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                    color: #334155;
                    padding: 10px 12px 6px;
                }
                .nav-link {
                    display: flex !important;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 12px;
                    border-radius: 8px;
                    color: #64748B !important;
                    text-decoration: none !important;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13.5px;
                    font-weight: 500;
                    transition: all 0.18s ease;
                    border-left: 2px solid transparent;
                    margin-bottom: 2px;
                }
                .nav-link:hover {
                    background: rgba(255,255,255,0.05);
                    color: #CBD5E1 !important;
                    border-left-color: rgba(44,123,143,0.4);
                }
                .nav-link.active {
                    background: rgba(44,123,143,0.15);
                    color: #7DD3E0 !important;
                    border-left-color: #2C7B8F;
                }
                .nav-symbol {
                    font-size: 15px;
                    width: 20px;
                    text-align: center;
                    flex-shrink: 0;
                    line-height: 1;
                }

                .sidebar-footer {
                    padding: 12px 10px 16px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    flex-shrink: 0;
                    position: relative;
                }
                .admin-button {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 14px;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #94A3B8;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                }
                .admin-button:hover {
                    background: rgba(255,255,255,0.09);
                    border-color: rgba(44,123,143,0.4);
                    color: #CBD5E1;
                }
                .admin-dropdown {
                    position: absolute;
                    bottom: calc(100% + 8px);
                    left: 10px;
                    right: 10px;
                    background: #1E293B;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 10px;
                    box-shadow: 0 -8px 24px rgba(0,0,0,0.3);
                    overflow: hidden;
                    z-index: 1100;
                    animation: slideUp 0.2s ease-out both;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 11px 14px;
                    color: #94A3B8;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.15s ease;
                    font-weight: 500;
                    border: none;
                    background: transparent;
                    width: 100%;
                    text-align: left;
                    font-size: 13px;
                    font-family: 'DM Sans', sans-serif;
                }
                .dropdown-item:hover {
                    background: rgba(255,255,255,0.06);
                    color: #E2E8F0;
                }
                .dropdown-item.danger { color: #F87171; }
                .dropdown-item.danger:hover { background: rgba(220,38,38,0.1); }
                .dropdown-sep {
                    height: 1px;
                    background: rgba(255,255,255,0.05);
                }

                /* Scrollbar */
                .sidebar-nav::-webkit-scrollbar { width: 4px; }
                .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
                .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
            `}</style>

            <div className='admin-sidebar'>
                {/* Header */}
                <div className='sidebar-header'>
                    <div className='sidebar-brand'>
                        <span className='sidebar-brand-symbol' style={{ display: 'flex', alignItems: 'center' }}>
                            <BookIcon sx={{ color: '#2C7B8F', fontSize: 22 }} />
                        </span>
                        <div>
                            <div className='sidebar-brand-name'>Mộc Sách</div>
                            <div className='sidebar-brand-sub'>Admin</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className='sidebar-nav'>
                    <div className='sidebar-section-label'>Quản lý</div>
                    {NAV_ITEMS.map(({ to, icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                        >
                            <span className='nav-symbol' style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer / User Menu */}
                <div className='sidebar-footer' ref={dropdownRef}>
                    {showDropdown && (
                        <div className='admin-dropdown'>
                            <button className='dropdown-item' onClick={() => { setShowDropdown(false); navigate('/'); }} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <HomeIcon sx={{ fontSize: '16px', opacity: 0.8 }} /> Về trang chủ
                            </button>
                            <div className='dropdown-sep' />
                            <button className='dropdown-item danger' onClick={() => { setShowDropdown(false); logout(navigate); }} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ExitToAppIcon sx={{ fontSize: '16px', opacity: 0.8 }} /> Đăng xuất
                            </button>
                        </div>
                    )}
                    <button className='admin-button' onClick={() => setShowDropdown(!showDropdown)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AdminPanelSettingsIcon sx={{ fontSize: '18px', color: '#2C7B8F' }} />
                            <span>Admin</span>
                        </div>
                        <span style={{
                            fontSize: '11px',
                            transition: 'transform 0.2s',
                            display: 'inline-block',
                            transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}>▾</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
