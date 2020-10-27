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

	const graphs = db.get('graphs');
	const graph = await graphs.findOne({_id: req.params.user});
	if(!graph)
		res.status(404);
	res.send(graph);
});
router.post('/', async(req, res) => {
	const {user, trim, time} = req.body;
	const userCol = db.get('users');
	const {access_token} = await userCol.findOne({_id: user});
	// Create a repo if the user doesn't already have one.
	const githubUser = await (await fetch('https://api.github.com/user', {headers: {'Authorization': `token ${access_token}`}})).json();
	const repoReq = await fetch(`${githubUser.repos_url}/contribeautiful_data`);
	if(repoReq.status == 404) {
		console.log(access_token)
		const repo = await fetch('https://api.github.com/user/repos', {
			method: 'POST',
			headers: {'Authorization': `token ${access_token}`},
			body: {
				name: 'contribeautiful_data',
				description: 'autogenerated by TheFoxarmy/Contribeautiful',
				homepage: 'https://sethpainter.com/contribeautiful',
				has_issues: false,
				has_projects: false,
				has_wiki: false,
				has_downloads: false,
				auto_init: true
			}
		});
		console.log(await repo.text());
	}
	let {commitData} = req.body;
	const graphs = db.get('graphs');
	if(trim)
		commitData = commitData.filter(arr => arr.reduce((val, sum) => sum + val));
	const graph = await graphs.findOneAndUpdate({_id: user}, {$set: {commitData, ... true && {time}}}, {upsert: true});
	res.status(201).send(graph);
});

module.exports = router;