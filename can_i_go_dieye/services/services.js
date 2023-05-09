const moment = require("moment");

// check the difference between two dates
exports.checkDateDiffDays = (date) => {
	return moment().diff(date, "days");
};

exports.checkDateDiffMonths = (date) => {
	return moment().diff(date, "months");
};

// check if user with recent case of covid have temporary pass
exports.checkIfUserHaveTemporaryPass = async (date) => {
	let nDaysBetweenTodayAndLastUpdate = this.checkDateDiffDays(date);
	let nMonthsBetweenTodayAndLastUpdate = this.checkDateDiffMonths(date);
	if (nDaysBetweenTodayAndLastUpdate < 14 || (nDaysBetweenTodayAndLastUpdate > 14 && nMonthsBetweenTodayAndLastUpdate > 4)) {
		return false;
	}
	return true;
};
