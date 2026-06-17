import React, { useEffect, useState } from "react";
import { getAllGenres } from "../../../api/GenreApi";

const S = {
    input: {
        padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #E2E8F0',
        fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#1E293B',
        background: '#fff', outline: 'none', transition: 'all 0.2s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
    },
    btn: {
        padding: '10px 20px', borderRadius: '8px', border: 'none',
        background: 'linear-gradient(135deg, #2C7B8F, #1A5E70)', color: '#fff',
        fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600,
        cursor: 'pointer', transition: 'all 0.2s ease',
        display: 'flex', alignItems: 'center', gap: '8px'
    }
};

const ToolFilter = (props) => {
	const [keySearchTemp, setKeySearchTemp] = useState(props.keySearch ?? "");
	const [genres, setGenres] = useState(null);

	useEffect(() => {
		getAllGenres().then(setGenres).catch(console.error);
	}, []);

	const handleChangeGenre = (event) => {
		const value = event.target.value;
		props.onGenreChange(value === "" ? undefined : Number(value));
	};

	const handleChangeKeySearch = (e) => setKeySearchTemp(e.target.value);
	const handleClickSearch = () => props.onKeySearchChange(keySearchTemp);

	return (
		<div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
			{/* Genre Select */}
			<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
				<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#475569' }}>Thể loại:</span>
				<select 
					style={{ ...S.input, minWidth: '180px', cursor: 'pointer' }}
					value={props.genreId || ""}
					onChange={handleChangeGenre}
				>
					<option value="">Tất cả thể loại</option>
					{genres?.map(genre => (
						<option key={genre.idGenre} value={genre.idGenre}>{genre.nameGenre}</option>
					))}
				</select>
			</div>

			{/* Search Input */}
			<div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
				<input 
					style={{ ...S.input, minWidth: '300px' }}
					placeholder="Tìm kiếm theo tên sách..."
					value={keySearchTemp}
					onChange={handleChangeKeySearch}
					onKeyDown={(e) => e.key === 'Enter' && handleClickSearch()}
				/>
				<button 
					style={S.btn}
					onClick={handleClickSearch}
					onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(44,123,143,0.2)'; }}
					onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
				>
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
					Tìm kiếm
				</button>
			</div>
		</div>
	);
};

export default ToolFilter;
