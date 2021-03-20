const moment = require('moment-timezone');

const parseDate = (date) => {
	const strdate = moment(date).tz('Asia/Kolkata').format('MMMM Do YYYY')
	return strdate;
}

// console.log(parseDate('2021-02-24T07:19:13.193Z'));
module.exports = parseDate;