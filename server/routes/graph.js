const router = require('express').Router();
const fetch = require('node-fetch');
const db = require('monk')('mongodb://localhost/contribeautiful');
const ObjectId = require('mongodb').ObjectID;

router.get('/:user', async(req, res) => {
	const user = req.params.user;
	if(!ObjectId.isValid(user)) {
		res.sendStatus(404);
		return;
	}

	const users = db.get('users');
	const {graph} = await users.findOne({_id: req.params.user});
	if(!graph)
		res.status(404);
	res.send(graph);
});
router.post('/', async(req, res) => {
	const {user, trim, time} = req.body;
	const userCol = db.get('users');
	const {access_token} = await userCol.findOne({_id: user});
	// Create a repo if the user doesn't already have one.
	const {login} = await (await fetch('https://api.github.com/user', {headers: {'Authorization': `token ${access_token}`}})).json();
	const repoReq = await fetch(`https://api.github.com/repos/${login}/contribeautiful_data`);
	if(repoReq.status == 404) {
		const repo = await fetch('https://api.github.com/user/repos', {
			method: 'POST',
			headers: {'Authorization': `token ${access_token}`},
			body: JSON.stringify({
				name: 'contribeautiful_data',
				description: 'autogenerated by TheFoxarmy/Contribeautiful',
				homepage: 'https://sethpainter.com/contribeautiful',
				has_issues: false,
				has_projects: false,
				has_wiki: false,
				has_downloads: false,
				auto_init: true
			})
		});
	}
	
	let {commitData} = req.body;
	if(trim)
		commitData = commitData.filter(arr => arr.reduce((val, sum) => sum + val));
	
	const {graph} = await userCol.findOneAndUpdate({_id: user}, {$set: {graph: commitData}});
	res.status(201).send(graph);
});

module.exports = router;