import React, { useEffect, useState } from "react";
import ReviewModel from "../../../../model/ReviewModel";
import { getReviewByIdBook } from "../../../../api/ReviewApi";
import RatingStar from "../rating/Rating";
import User from "../user/User";

const Comment = (props) => {
	const [reviews, setReviews] = useState(null);
	useEffect(() => {
		getReviewByIdBook(props.idBook).then((respose) => {
			setReviews(respose);
		});
	}, []);

	if (reviews?.length === 0) {
		return <p>Không có đánh giá nào</p>;
	}

	// Hàm để format timestamp
	const formatDate = (timestamp) => {
		const date = new Date(timestamp);
		return date.toLocaleString('vi-VN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<>
			{/* Hiển thị danh sách review */}
			{reviews?.map((review, index) => {
				return (
					<div className='mb-4 pb-3 border-bottom' key={index}>
						<div className='d-flex'>
							<User user={review.user}>
								<div className='flex-grow-1'>
									<div className='mb-2'>
										<RatingStar
											readonly={true}
											ratingPoint={review.ratingPoint}
										/>
									</div>
									<p className='mb-2' style={{ color: '#333', lineHeight: '1.6' }}>
										{review.content}
									</p>
									<p className='mb-0' style={{ fontSize: '13px', color: '#888' }}>
										{formatDate(review.timestamp)}
									</p>
								</div>
							</User>
						</div>
					</div>
				);
			})}
		</>
	);
};

export default Comment;
