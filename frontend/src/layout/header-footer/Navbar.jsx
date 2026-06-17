/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link, NavLink } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Navbar = () => {
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
                        <div className='ms-auth-btns'>
                            <Link to='/register' className='ms-auth-btn ms-auth-btn-solid'>Đăng ký</Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
