<template>
	<div class="container">
		<Header />
		<h1 id="lbl-dashboard">Dashboard</h1>
		<div class="wrapper">
			<div id="user">
				<img id="profile-picture" :src="githubProfile?.avatar_url" alt="profile pic" >
				<div class="text">
					<h3 id="profile-name" v-text="githubProfile?.login" />
					<p>Last Commit:
						<a 	id="last-commit"
							:href="`https://github.com/${githubProfile.login}/contribeautiful_data/commit/${userData.lastCommit}`"
							v-text="userData.lastCommit" />
					</p>
				</div>
			</div>
			<main>
				<Canvas :year="selectedYear" id="canvas" ref="canvas" />
				<section id="year">
					<p>Year</p>
					<hr>
					<ul>
						<li v-for="year in yearSpan" :key="year">
							<input type="radio" :id="`rad-${year}`" :value="year" v-model="selectedYear" name="year" @change="selectYear">
							<label :for="`rad-${year}`" v-text="year"/>
						</li>
					</ul>
				</section>
				<button @click="submit" id="submit" class="btn" v-text="!editing ? 'Submit Contributions' : 'Edit Contributions'" />
			</main>
		</div>
	</div>
</template>

<script>
import Header from '../components/Header';
import Canvas from '../components/Canvas';

let userData = null;
const currentYear = new Date().getFullYear();
let selectedYear = currentYear;

export default {
	name: 'Dashboard',
	components: {Header, Canvas},
	async created() {
		const userID = localStorage.getItem('userID');
		this.userData = await ( // Get the server's userdata
			await fetch(`${process.env.VUE_APP_SERVER_BASE_URL}/user/${userID}`)).json();
		const profileReq = await fetch('https://api.github.com/user', {headers: {'authorization': `token ${this.userData.access_token}`}});
		if(profileReq.ok) {
			this.githubProfile = await profileReq.json();
			const minYear = new Date(this.githubProfile.created_at).getFullYear();
			this.yearSpan = [];
			for(let year = currentYear; year >= minYear; year--)
				this.yearSpan.push(year);
			this.selectYear();
		} else if(profileReq.status == 401) { // If the GH app can no longer access this user anmore
			localStorage.removeItem('userID');
			// Delete the user from the db
			await fetch(`${process.env.VUE_APP_SERVER_BASE_URL}/user/${userID}`, {method: 'DELETE'});
			this.$router.push('/');
		}
	},
	data() {	
		return {userData, githubProfile: this.githubProfile, yearSpan: this.yearSpan, selectedYear, editing: this.editing};
	},
	methods: {
		async submit() {
			let commitData = this.$refs.canvas.drawingBoard;
			let method = 'POST';
			if(this.editing) {
				commitData = commitData.map((newVal, index) => newVal - this.originalData[index]);
				method = 'PATCH';
			}
			const body = {
				user: localStorage.getItem('userID'),
				commitData,
				year: this.selectedYear
			};
			try {
				const req = await fetch(`${process.env.VUE_APP_SERVER_BASE_URL}/graph`, {
					method,
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});
				if(req.ok)
					console.log(await req.text());
			} catch(e) {
				console.error(e);
			}
		},
		async selectYear() {
			try {
				const req = await fetch(`${process.env.VUE_APP_SERVER_BASE_URL}/graph/${localStorage.getItem('userID')}/${this.selectedYear}`);
				if(req.ok) {
					this.$refs.canvas.initialize(await req.json());
					this.editing = true;
					this.originalData = this.$refs.canvas.drawingBoard;
				} else {
					this.$refs.canvas.initialize();
					this.editing = false;
				}
			} catch(e) {
				console.error(e);
			}
		}
	}
};

</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
	}
	.wrapper {
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		align-items: flex-start;
	}
	.wrapper > * {
		margin-top: 4em;
	}

	#lbl-dashboard {
		text-align: center;
		padding: 0 0.4em;
		padding-bottom: 0.4em;
		margin: 0 auto;
		margin-top: 1em;
		border-bottom: 3px solid white;
	}

	#user {
		border-radius: 25px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 1);
		overflow: hidden;
		word-wrap: break-word;
		max-width: 300px;
	}
	#user img {
		max-width: 100%;
	}
	#user .text {
		padding: 1em;
	}

	main {
		display: grid;
		grid-template-columns: auto auto;
		justify-items: start;
	}
	#canvas {
		align-self: center;
	}
	#year {
		padding: 0 1em;
	}
	#year [type=radio] {
		display: none;
	}
	#year ul {
		list-style-type: none;
	}
	#year label {
		display: block;
		margin-top: 0.1em;
		padding: 0.3em 0.7em;
		border-radius: 5px;
	}
	#year input:checked ~ label {
		background: mediumslateblue;
	}
	#year label:hover {
		background: #666;
	}
</style>
