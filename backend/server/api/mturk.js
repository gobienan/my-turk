const express = require('express');
const AWS = require('aws-sdk');
const assert = require('assert');
const mongo = require('../services/mongo');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();
const endpoint = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com';
//const endpoint = 'https://mturk-requester.us-east-1.amazonaws.com';
const bodyParser = require("body-parser");
const region = 'us-east-1';
const app = express();

let mturk;

app.post('/login', async (req, res) => {
	let data = req.body;

	let accessKeyId = data.awsAccessKeyId;
	let secretAccessKey = data.awsSecretAccessKey;

	console.log('accessKeyId', accessKeyId || "");
	console.log('secretAccessKey', secretAccessKey || "");

	if (!accessKeyId || !secretAccessKey) {
		return res.send({
			success: false,
			message: "Your Access-Key-ID or your Secret-Access-Key is wrong"
		});
	}

	try {
		AWS.config.update({
			region,
			endpoint,
			accessKeyId,
			secretAccessKey,
			sslEnabled: 'true'
		});

		mturk = new AWS.MTurk();
		let balance = await getBalance(mturk);
		return res.send({
			success: true,
			balance: balance,
			token: accessKeyId,
			message: "You can pass"
		});

	} catch (e) {
		console.log(e)
		return res.send({
			success: false,
			message: "Your Access-Key-ID or your Secret-Access-Key is wrong"
		});
	}
});

app.post('/addExperiment', async (req, res) => {
	let data = req.body;
	let result = await mongo.insertData(data);

	if (result) {
		return res.send({
			success: true,
			message: "added experiment",
			data: {
				id: result.insertedId
			}
		});
	} else {
		return res.send({
			success: false,
			message: "Something went wrong"
		});
	}

});

app.post('/saveExperiment', async (req, res) => {
	let data = req.body;
	let id = data.id;

	delete data.experiment._id;
	let result = await mongo.updateData({ "_id": ObjectId(id) }, data.experiment);

	if (result) {
		return res.send({
			success: true,
			message: "Saved settings",
			data: result
		});
	} else {
		return res.send({
			success: false,
			message: "Something went wrong"
		});
	}
});

const group = key => array => {
	return array.reduce(
		(objectsByKeyValue, obj) => ({
			...objectsByKeyValue,
			[obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj)
		}), {}
	);
}

app.post('/getExperiments', async (req, res) => {
	let data = req.body;
	let id = data.id ? { "_id": ObjectId(data.id) } : {};
	let groupBy = data.groupBy || null;
	let result = await mongo.findData(id);

	if (result) {
		for (var i = 0; i < result.length; i++) {
			let hits = result[i].hits;
			let exp = {};
			exp.available = 0;
			exp.pending = 0;
			exp.waitingForApproval = 0;
			exp.completed = 0;
			exp.maxAssignments = 0;

			for (var j = 0; hits && j < hits.length; j++) {
				let hit = hits[j];
				let mHIT = (await getHIT({ id: hit.id }).catch((err) => ({ error: err }))).HIT;

				if (!mHIT.error) {
					let hitID = mHIT.HITId;
					let maxAssignments = mHIT.MaxAssignments;
					let available = mHIT.NumberOfAssignmentsAvailable;
					let pending = mHIT.NumberOfAssignmentsPending;
					let completed = mHIT.NumberOfAssignmentsCompleted;
					let creationTime = mHIT.CreationTime;
					let title = mHIT.Title;
					let waitingForApproval = maxAssignments - available - completed - pending;
					let status = mHIT.HITStatus;

					mHIT = {
						id: hitID,
						title: title,
						available: `${available} / ${maxAssignments}`,
						pending: `${pending} / ${maxAssignments}`,
						waitingForApproval: `${waitingForApproval} / ${maxAssignments}`,
						completed: `${completed} / ${maxAssignments}`,
						creationTime: creationTime,
						status: status,
					};

					result[i].hits[j] = mHIT;

					exp.available = exp.available + available;
					exp.pending = exp.pending + pending;
					exp.waitingForApproval = exp.waitingForApproval + waitingForApproval;
					exp.completed = exp.completed + completed;
					exp.maxAssignments = exp.maxAssignments + maxAssignments;

					result[i].available = `${exp.available} / ${exp.maxAssignments}`;
					result[i].pending = `${exp.pending} / ${exp.maxAssignments}`;
					result[i].waitingForApproval = `${exp.waitingForApproval} / ${exp.maxAssignments}`;
					result[i].completed = `${exp.completed} / ${exp.maxAssignments}`;

				} else {
					result[i].hits = [];
					result[i].available = `${exp.available} / ${exp.maxAssignments}`;
					result[i].pending = `${exp.pending} / ${exp.maxAssignments}`;
					result[i].waitingForApproval = `${exp.waitingForApproval} / ${exp.maxAssignments}`;
					result[i].completed = `${exp.completed} / ${exp.maxAssignments}`;
				}
			}
		}
		result = groupBy ? group(groupBy)(result) : result;

		return res.send({
			success: true,
			message: `found ${result.length} experiments`,
			data: result,
		});
	} else {
		return res.send({
			success: false,
			message: "Something went wrong"
		});
	}
});

app.post('/deleteExperiment', async (req, res) => {
	let data = req.body;
	let id = data.id || {};
	let result = await mongo.removeData({ "_id": ObjectId(id) });

	if (result) {
		return res.send({
			success: true,
			message: "removed element",
			data: result
		});
	} else {
		return res.send({
			success: false,
			message: "Something went wrong"
		});
	}
});

app.post('/createHIT', async (req, res) => {
	let data = req.body;
	let result = await createHIT(data).catch((err) => ({ error: err }));
	if (!result.error) {
		return res.send({
			success: true,
			message: "created new HIT",
			data: result
		});
	} else {
		return res.send({
			success: false,
			message: result.error.message,
			error: result.error.code
		});
	}
});

app.post('/getHIT', async (req, res) => {
	let data = req.body;
	let result = await getHIT(data).catch((err) => ({ error: err }));
	if (!result.error) {
		return res.send({
			success: true,
			message: "got HIT",
			data: result.HIT
		});
	} else {
		return res.send({
			success: false,
			message: result.error.message,
			error: result.error.code
		});
	}
});

app.post('/deleteHIT', async (req, res) => {
	let data = req.body;
	let result = await deleteHIT(data).catch((err) => ({ error: err }));
	if (!result.error) {
		return res.send({
			success: true,
			message: "deleted HIT",
			data: result
		});
	} else {
		return res.send({
			success: false,
			message: result.error.message,
			error: result.error.code
		});
	}
});

app.post('/approveAssignment', async (req, res) => {
	let data = req.body;
	let result = await approveAssignment(data).catch((err) => ({ error: err }));
	console.log(result)
	if (!result.error) {
		return res.send({
			success: true,
			message: "approved assignment",
			data: result,
		});
	} else {
		return res.send({
			success: false,
			message: result.error.errors,
			error: "Something went wrong"
		});
	}
});


app.post('/rejectAssignment', async (req, res) => {
	let data = req.body;
	let result = await rejectAssignment(data).catch((err) => ({ error: err }));
	console.log(result)

	if (!result.error) {
		return res.send({
			success: true,
			message: "rejected assignment",
			data: result,
		});
	} else {
		return res.send({
			success: false,
			message: "Something went wrong"
		});
	}
});

app.post('/listAssignments', async (req, res) => {
	let data = req.body;
	let result = await listAssignments(data).catch((err) => ({ error: err }));
	let groupBy = data.groupBy;
	console.log(result)

	if (!result.error) {
		return res.send({
			success: true,
			message: "got all assignments",
			data: groupBy ? group(groupBy)(result.Assignments) : result.Assignments,
		});
	} else {
		return res.send({
			success: false,
			message: "Something went wrong"
		});
	}
});

const connetctToMturk = () => {
	AWS.config.update({
		region,
		endpoint,
		sslEnabled: 'true'
	});

	mturk = new AWS.MTurk();
}

const getBalance = () => {

	return new Promise((resolve, reject) => {
		mturk.getAccountBalance({}, (err, data) => {
			if (err) {
				reject(err)
			}
			balance = data && data.AvailableBalance
			resolve(balance);
		});
	});
}

const createHIT = async (params) => {
	connetctToMturk();

	let createHITOptions = {
		AssignmentDurationInSeconds: params.assignmentDurationInMinutes * 60,
		Description: params.description,
		Reward: params.rewardPerAssignment,
		Title: params.title,
		AutoApprovalDelayInSeconds: params.hitDurationInMinutes * 60,
		Keywords: params.keywords,
		LifetimeInSeconds: params.hitDurationInMinutes * 60,
		MaxAssignments: params.assignmentsPerHit,
		HITLayoutId: "3G5IDHQ988NDA56GDYCNC1JRHFWY4O",
		HITLayoutParameters: [{ Name: 'url', Value: params.externalUrl }],
	};
	if (params.defaultRequirements) {
		let requirements = {
			QualificationRequirements: [{
				Comparator: 'GreaterThanOrEqualTo',
				QualificationTypeId: '000000000000000000L0',
				IntegerValues: [95],

			}, {
				QualificationTypeId: "00000000000000000071",
				Comparator: "EqualTo",
				LocaleValues: [{
					Country: "US",
				}]
			}, {
				QualificationTypeId: "00000000000000000040",
				Comparator: "GreaterThanOrEqualTo",
				IntegerValues: [1000],
			}],
		};
		createHITOptions = Object.assign(createHITOptions, requirements);
	}
	return new Promise((resolve, reject) => {
		mturk.createHIT(createHITOptions, (err, data) => {
			if (err) {
				console.log(err, err.stack); // an error occurred
				reject(err)
			} else {
				console.log(data); // successful response
				resolve(data);
			}
		});
	});
}

const getHIT = ({ id }) => {
	connetctToMturk();

	let params = {
		HITId: id
	};
	return new Promise((resolve, reject) => {
		mturk.getHIT(params, (err, data) => {
			if (err) {
				console.log(err, err.stack); // an error occurred
				reject(err)
			} else {
				console.log(data); // successful response
				resolve(data);
			}
		});
	});
}

const deleteHIT = ({ id }) => {
	connetctToMturk();

	var params = {
		HITId: id
	};
	return new Promise((resolve, reject) => {
		mturk.deleteHIT(params, (err, data) => {
			if (err) {
				console.log(err, err.stack); // an error occurred
				reject(err)
			} else {
				console.log(data); // successful response
				resolve(data);
			}
		});
	});
}

const createQualificationType = ({ description, name }) => {
	connetctToMturk();

	let params = {
		Description: 'STRING_VALUE',
		Name: 'STRING_VALUE',
		QualificationTypeStatus: 'Active'
	};

	return new Promise((resolve, reject) => {
		mturk.createQualificationType(params, (err, data) => {
			if (err) {
				console.log(err, err.stack); // an error occurred
				reject(err)
			} else {
				console.log(data); // successful response
				resolve(data);
			}
		});
	});
}

const listAssignments = ({ id }) => {
	connetctToMturk();

	let params = {
		HITId: id
	};
	return new Promise((resolve, reject) => {
		mturk.listAssignmentsForHIT(params, (err, data) => {
			if (err) {
				console.log(err, err.stack); // an error occurred
				reject(err)
			} else {
				console.log(data); // successful response
				resolve(data);
			}
		});
	});
}

const qualify = ({ qualificationTypeID, workerID }) => {
	let params = {
		QualificationTypeId: qualificationTypeID,
		WorkerId: workerID
	};
	return new Promise((resolve, reject) => {
		mturk.associateQualificationWithWorker(params, (err, data) => {
			if (err) {
				console.log(err, err.stack); // an error occurred
				reject(err)
			} else {
				console.log(data); // successful response
				resolve(data);
			}
		});
	});

}

const approveAssignment = ({ id, feedback = '' }) => {
	connetctToMturk();

	let params = {
		AssignmentId: id,
		RequesterFeedback: feedback
	};
	return new Promise((resolve, reject) => {
		mturk.approveAssignment(params, (err, data) => {
			if (err) {
				console.log(err, err.stack); // an error occurred
				reject(err)
			} else {
				console.log(data); // successful response
				resolve(data);
			}
		});
	});
}

const rejectAssignment = ({ id, feedback }) => {
	connetctToMturk();
	let mFeedback = feedback || "Worker did not submit any data, our server shows no HIT-relevant activity whatsoever for this assigment. If this is an error, please contact ikon-research@imp.fu-berlin.de!";

	let params = {
		AssignmentId: id,
		RequesterFeedback: mFeedback
	};
	return new Promise((resolve, reject) => {
		mturk.rejectAssignment(params, (err, data) => {
			if (err) {
				console.log(err, err.stack); // an error occurred
				reject(err)
			} else {
				console.log(data); // successful response
				resolve(data);
			}
		});
	});
}

const contactWorkers = ({ subject, message, workerIDs }) => {
	var params = {
		MessageText: message,
		Subject: subject,
		WorkerIds: workerIDs
	};
	return new Promise((resolve, reject) => {
		mturk.notifyWorkers(params, (err, data) => {
			if (err) {
				console.log(err, err.stack); // an error occurred
				reject(err)
			} else {
				console.log(data); // successful response
				resolve(data);
			}
		});
	});
}

module.exports = app;
