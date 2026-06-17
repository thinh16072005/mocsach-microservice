/* eslint-disable jsx-a11y/anchor-is-valid */
import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
    getAvatarByToken,
    getLastNameByToken,
    isToken,
    logout,
} from "../utils/JwtService";

const Navbar = () => {
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState(getAvatarByToken());
    const [lastName, setLastName] = useState(getLastNameByToken());

    useEffect(() => {
        const handleProfileUpdate = () => {
            setAvatar(getAvatarByToken());
            setLastName(getLastNameByToken());
        };
        window.addEventListener('profile_updated', handleProfileUpdate);
        return () => window.removeEventListener('profile_updated', handleProfileUpdate);
    }, []);

    return (
        <>
            <style>{`
                .ms-nav {
                    position: sticky;
                    top: 0;
                    z-index: 1030;
                    background: rgba(255, 255, 255, 0.94);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    border-bottom: 1px solid #E5E7EB;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                    padding: 0;
                }
                .ms-nav-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 24px;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    gap: 32px;
                }
                .ms-nav-brand {
                    font-family: 'DM Sans', sans-serif !important;
                    font-size: 20px;
                    color: #111827 !important;
                    text-decoration: none !important;
                    letter-spacing: 0.3px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .ms-nav-links {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    flex: 1;
                }
                .ms-nav-link {
                    font-family: 'DM Sans', sans-serif !important;
                    font-size: 14px;
                    font-weight: 500;
                    color: #6B7280 !important;
                    text-decoration: none !important;
                    padding: 6px 12px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }
                .ms-nav-link:hover { color: #111827 !important; background: #F3F4F6; }
                .ms-nav-link.active { color: #2C7B8F !important; background: #EEF8FA; }
                .ms-nav-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-left: auto;
                }
                .ms-avatar-wrap {
                    position: relative;
                }
                .ms-avatar-trigger {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    padding: 4px 10px 4px 4px;
                    border-radius: 24px;
                    border: 1px solid #E5E7EB;
                    background: #fff;
                    transition: all 0.2s ease;
                    font-family: 'DM Sans', sans-serif !important;
                    font-size: 13px;
                    color: #374151;
                }
                .ms-avatar-trigger:hover { border-color: #2C7B8F; box-shadow: 0 0 0 3px rgba(44,123,143,0.08); }
                .ms-avatar-chevron {
                    font-size: 10px;
                    color: #9CA3AF;
                    transition: transform 0.2s ease;
                }
                .ms-dropdown-menu {
                    position: absolute;
                    top: calc(100% + 10px);
                    right: 0;
                    background: #fff;
                    border: 1px solid #E5E7EB;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.10);
                    min-width: 200px;
                    overflow: hidden;
                    animation: slideUp 0.2s ease-out both;
                    z-index: 1100;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .ms-dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 11px 16px;
                    font-family: 'DM Sans', sans-serif !important;
                    font-size: 13.5px;
                    color: #374151;
                    cursor: pointer;
                    transition: background 0.15s ease;
                    text-decoration: none !important;
                    border: none;
                    background: transparent;
                    width: 100%;
                    text-align: left;
                }
                .ms-dropdown-item:hover { background: #F9FAFB; color: #111827; }
                .ms-dropdown-item.danger { color: #DC2626; }
                .ms-dropdown-item.danger:hover { background: #FEF2F2; }
                .ms-dropdown-sep {
                    height: 1px;
                    background: #F3F4F6;
                    margin: 4px 0;
                }
                .ms-auth-btns { display: flex; gap: 8px; }
                .ms-auth-btn {
                    padding: 7px 18px;
                    border-radius: 8px;
                    font-family: 'DM Sans', sans-serif !important;
                    font-size: 13.5px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-decoration: none !important;
                    display: flex;
                    align-items: center;
                }
                .ms-auth-btn-ghost {
                    background: transparent;
                    border: 1.5px solid #E5E7EB;
                    color: #374151;
                }
                .ms-auth-btn-ghost:hover { border-color: #2C7B8F; color: #2C7B8F; }
                .ms-auth-btn-solid {
                    background: #2C7B8F;
                    border: 1.5px solid #2C7B8F;
                    color: #fff;
                }
                .ms-auth-btn-solid:hover { background: #1A5E70; border-color: #1A5E70; }
            `}</style>

            <nav className='ms-nav'>
                <div className='ms-nav-inner'>
                    {/* Logo */}
                    <Link className='ms-nav-brand' to='/' style={{ fontWeight: 600 }}>
                        <MenuBookIcon sx={{ color: "#2C7B8F", fontSize: 24 }} />
                        Mộc Sách
                    </Link>

                    {/* Nav Links */}
                    <div className='ms-nav-links'>
                        <NavLink className={({ isActive }) => `ms-nav-link${isActive ? ' active' : ''}`} to='/'>Trang chủ</NavLink>
                    </div>

                    {/* Right side */}
                    <div className='ms-nav-right'>
                        {!isToken() ? (
                            <div className='ms-auth-btns'>
                                <Link to='/login' className='ms-auth-btn ms-auth-btn-ghost'>Đăng nhập</Link>
                                <Link to='/register' className='ms-auth-btn ms-auth-btn-solid'>Đăng ký</Link>
                            </div>
                        ) : (
                            <AvatarDropdown navigate={navigate} avatar={avatar} lastName={lastName} />
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

/* Separate component to keep hooks clean */
const AvatarDropdown = ({ navigate, avatar, lastName }) => {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className='ms-avatar-wrap' ref={ref}>
            <button className='ms-avatar-trigger' onClick={() => setOpen(!open)}>
                <Avatar
                    alt={lastName?.toUpperCase()}
                    src={avatar || "/images/user/user-default.jpg"}
                    sx={{ width: 28, height: 28, fontSize: '12px' }}
                />
                <span style={{ fontWeight: 500, color: '#374151', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
                    {lastName}
                </span>
                <span className='ms-avatar-chevron' style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
            </button>

            {open && (
                <div className='ms-dropdown-menu'>
                    <Link to='/profile' className='ms-dropdown-item' onClick={() => setOpen(false)}>
                        <AccountCircleIcon sx={{ fontSize: '18px', color: '#2C7B8F' }} /> Tài khoản của tôi
                    </Link>
                    <div className='ms-dropdown-sep' />
                    <button className='ms-dropdown-item danger' onClick={() => { setOpen(false); logout(navigate); }}>
                        <ExitToAppIcon sx={{ fontSize: '18px' }} /> Đăng xuất
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;
