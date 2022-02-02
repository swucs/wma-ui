

export const DATE_FORMAT_YYYYMMDD = "YYYY-MM-DD";

//숫자포맷을 위한 Render
export const formatNumber = (value) => {
	// console.log(value, row, index);
	return new Intl.NumberFormat().format(value);
};