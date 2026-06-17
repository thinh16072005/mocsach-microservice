import React from "react";
import "./Banner.css";
import { Link } from "react-router-dom";

function Banner() {
	return (
		<div className='container-fluid pt-5 pb-4 text-dark d-flex justify-content-center align-items-center'>
			<div>
				<h3
					data-text='A room without books is like a body without a soul.'
					className='banner-text'
				>
					A room without books is like a body without a soul.
				</h3>
				<p style={{ fontFamily: "'DM Sans', sans-serif", color: '#9CA3AF', fontSize: '14px', marginTop: '10px' }}>— Marcus Tullius Cicero —</p>
				<Link to={"/products"}>
					<button className='ms-btn-grad'>
						Khám phá ngay →
					</button>
				</Link>
			</div>
		</div>
	);
}

export default Banner;
