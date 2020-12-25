<template>
	<h1 id="title"><span id="contri">Contri</span><span id="beautiful">beautiful</span></h1>
</template>

<script>
export default {
	name: 'Title'
}
</script>

<style scoped>
	#title span:first-child {
		color: green;
	}
	#title span:last-child {
		color: hotpink;
		font-weight: bolder;
	}
</style>
