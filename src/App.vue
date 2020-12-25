<template>
	<router-view />
</template>

<style>
	@import url("https://use.fontawesome.com/releases/v5.7.1/css/all.css");
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	:root, body, #app, .container {
		height: 100%;
		overflow: auto;
	}
	body {
		font-family: poppins;
		background: #444;
		/* background-image: url("/fabric_bkg.jpg"); */
		background-repeat: no-repeat;
		background-size: cover;
		color: white;
	}

	button, .btn {
		display: inline-block;
		font-size: 1.2em;
		padding: 0.4em;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
		color: white;
		background: none;
		text-decoration: none;
		font-weight: bolder;
		border-radius: 30px;
		margin: 0.3em;
		border: 2px solid white;
	}
	button:hover, .btn:hover {
		color: rgba(0, 0, 0, .8);
		background: white;
	}
</style>