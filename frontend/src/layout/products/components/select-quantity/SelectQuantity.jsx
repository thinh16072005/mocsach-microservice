import React from "react";
import "./SelectQuantity.css";
import { Remove, Add } from "@mui/icons-material";
import BookModel from "../../../../model/BookModel";

const SelectQuantity = (props) => {

	const handleInputChange = (e) => {
		const value = e.target.value;

		// Nếu input rỗng, không làm gì
		if (value === "") {
			return;
		}

		const numValue = parseInt(value, 10);

		// Kiểm tra xem có phải số hợp lệ không
		if (isNaN(numValue)) {
			return;
		}

		// Đảm bảo giá trị nằm trong khoảng [1, max]
		let finalValue = numValue;
		if (finalValue < 1) {
			finalValue = 1;
		}
		if (props.max && finalValue > props.max) {
			finalValue = props.max;
		}

		// Gọi setQuantity nếu có
		if (props.setQuantity) {
			props.setQuantity(finalValue);
		}
	};

	return (
		<div
			className='wrapper-select-quantity d-flex align-items-center rounded'
			style={{ width: "110px" }}
		>
			<button
				type='button'
				className='d-flex align-items-center justify-content-center'
				onClick={() => props.reduce()}
				style={{
					backgroundColor: "transparent",
					borderColor: "transparent",
				}}
			>
				<Remove />
			</button>
			<input
				type='number'
				className='inp-number p-0 m-0'
				value={props.quantity}
				min={1}
				max={props.max}
				onChange={handleInputChange}
			/>
			<button
				type='button'
				className='d-flex align-items-center justify-content-center'
				onClick={() => props.add()}
				style={{
					backgroundColor: "transparent",
					borderColor: "transparent",
				}}
			>
				<Add />
			</button>
		</div>
	);
};

export default SelectQuantity;
