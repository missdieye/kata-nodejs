const moment = require("moment");
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;

// check token validity of the header
exports.checkTokenValidity = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);
	jwt.verify(token, secret_key, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
};

// check user Access role
exports.checkUserAccessRole = (req, res, next) => {
	if (req.user.user.role === "admin") {
		next();
	} else {
		// check if user is the owner of the resource
		if (req.user.user._id === req.params.id || req.user.user._id === req.body.userId || req.user.user.passId === req.params.id) {
			next();
		} else {
			res.status(403).json({ message: "You are not allowed to access this resource" });
		}
	}
};

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
