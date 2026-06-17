import Rating from "@mui/material/Rating";
import React from "react";

const RatingStar = (props) => {
	const [value, setValue] = React.useState(
		props.ratingPoint || 0
	);


	// Xử lý khi thay đổi rating
	const handleChangeRating = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Rating
			name='half-rating'
			value={value}
			precision={0.5}
			onChange={handleChangeRating}
			readOnly={props.readonly}
			size='small'
		/>
	);
};

export default RatingStar;
