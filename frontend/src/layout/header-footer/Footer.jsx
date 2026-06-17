import React from "react";
import { Link } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

function Footer() {
    return (
        <footer style={{ background: '#0F172A', color: '#94A3B8', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 0' }}>
                <div className='row g-5'>
                    {/* Brand */}
                    <div className='col-lg-4 col-md-6'>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '22px', color: '#F8FAFC', marginBottom: '12px', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MenuBookIcon sx={{ color: '#2C7B8F', fontSize: 24 }} />Mộc Sách
                        </div>
                        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#64748B', maxWidth: '260px', marginBottom: '24px' }}>
                            Hiệu sách trực tuyến — nơi tri thức gặp gỡ.
                            Hàng ngàn tựa sách, giao hàng nhanh, giá tốt.
                        </p>
                        <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><LocationOnIcon sx={{ fontSize: '16px', color: '#94A3B8' }} /> <span><strong style={{ color: '#94A3B8' }}>Địa chỉ:</strong> FPT Software Đà Nẵng</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><EmailIcon sx={{ fontSize: '16px', color: '#94A3B8' }} /> <span><strong style={{ color: '#94A3B8' }}>Email:</strong> hello@mocsach.vn</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><PhoneIcon sx={{ fontSize: '16px', color: '#94A3B8' }} /> <span><strong style={{ color: '#94A3B8' }}>Hotline:</strong> 1800 123 456</span></div>
                        </div>
                    </div>

                    {/* Dịch vụ */}
                    <div className='col-lg-2 col-md-6'>
                        <h6 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#475569', marginBottom: '18px' }}>
                            Dịch vụ
                        </h6>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
                            {['Điều khoản sử dụng', 'Chính sách bảo mật', 'Chính sách thanh toán', 'Hệ thống nhà sách'].map(t => (
                                <li key={t}>
                                    <a href='#!' style={{ color: '#64748B', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#CBD5E1'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>
                                        {t}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Hỗ trợ */}
                    <div className='col-lg-2 col-md-6'>
                        <h6 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#475569', marginBottom: '18px' }}>
                            Hỗ trợ
                        </h6>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
                            {['Đổi trả hoàn tiền', 'Bảo hành bồi hoàn', 'Chính sách vận chuyển', 'Chính sách khách sỉ'].map(t => (
                                <li key={t}>
                                    <a href='#!' style={{ color: '#64748B', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#CBD5E1'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>
                                        {t}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className='col-lg-4 col-md-6'>
                        <h6 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#475569', marginBottom: '18px' }}>
                            Nhận bản tin
                        </h6>
                        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px', lineHeight: 1.6 }}>
                            Nhận thông báo về sách mới và ưu đãi độc quyền.
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type='email'
                                placeholder='Địa chỉ email của bạn'
                                style={{
                                    flex: 1, padding: '10px 14px', borderRadius: '8px',
                                    border: '1.5px solid #1E293B', background: '#1E293B',
                                    color: '#F1F5F9', fontSize: '13.5px', fontFamily: "'DM Sans', sans-serif",
                                    outline: 'none',
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = '#2C7B8F'}
                                onBlur={e => e.currentTarget.style.borderColor = '#1E293B'}
                            />
                            <button style={{
                                padding: '10px 18px', borderRadius: '8px', border: 'none',
                                background: '#2C7B8F', color: '#fff', fontSize: '13.5px',
                                fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                flexShrink: 0, transition: 'background 0.2s ease',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = '#1A5E70'}
                                onMouseLeave={e => e.currentTarget.style.background = '#2C7B8F'}
                            >
                                Đăng ký
                            </button>
                        </div>

                        <div style={{ marginTop: '24px' }}>
                            <div style={{ fontSize: '11px', color: '#475569', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 600 }}>Theo dõi</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[
                                    { k: 'fb', icon: <FacebookIcon sx={{ fontSize: 18 }} />, label: 'Facebook' },
                                    { k: 'tw', icon: <TwitterIcon sx={{ fontSize: 18 }} />, label: 'Twitter' },
                                    { k: 'ig', icon: <InstagramIcon sx={{ fontSize: 18 }} />, label: 'Instagram' },
                                    { k: 'yt', icon: <YouTubeIcon sx={{ fontSize: 18 }} />, label: 'YouTube' }
                                ].map((item) => (
                                    <a key={item.k} href='#!' aria-label={item.label} style={{
                                        width: 32, height: 32, borderRadius: '8px',
                                        background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#64748B', textDecoration: 'none', transition: 'all 0.2s ease',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#2C7B8F'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#64748B'; }}
                                    >
                                        {item.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #1E293B', marginTop: '48px', padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>
                        © 2026 Mộc Sách. Tất cả quyền được bảo lưu.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {['Bảo mật', 'Điều khoản', 'Cookies'].map(t => (
                            <a key={t} href='#!' style={{ fontSize: '13px', color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
                                onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                                {t}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
