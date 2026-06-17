import React from "react";

const User = (props) => {
	const user = props.user;

	return (
		<>
			<div className='me-4 mt-1'>
				<img
					src={user?.avatar || "/images/users/default_avatar.jpg"}
					alt="avatar"
					style={{
						width: '50px',
						height: '50px',
						borderRadius: '50%',
						objectFit: 'cover',
						border: '2px solid #e0e0e0'
					}}
				/>
			</div>
			<div>
				<strong>{user?.username || "Ẩn danh"}</strong>
			</div>
			{props.children}
		</>
	);
};

export default User;
