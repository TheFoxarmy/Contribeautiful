<template>
	<section id="canvas" @wheel="cycleColor">
		<div id="theme-select">
			<span class="theme-option">
				<input type="radio" name="theme" id="theme-light" @change="colors = lightColors" checked="checked">
				<label for="theme-light" id="btn-light" class="btn">Light</label>
			</span>
			<span class="theme-option">
				<input type="radio" name="theme" id="theme-dark" @change="colors = darkColors">
				<label for="theme-dark" id="btn-dark" class="btn">Dark</label>
			</span>
		</div>
		<div id="chart" ref="chart" @mouseleave="holdingDown = false">
			<div v-for="(spot, index) in yearStartOffset(year)"
				:key="index"
				class="placeholder"
			/>
			<div v-for="(day, dayIndex) in this.drawingBoard" :key="dayIndex"
				:class="`day day-${day}`"
				@mousedown="() => {holdingDown = true; colorDay(dayIndex)}" @mouseup="holdingDown = false"
				@mouseover="colorDay(dayIndex)"
				v-bind:style="`background: #${colors[day]}`" />
		</div>
		<div id="drawing-controls">
			<div id="colors">
				<div v-for="(color, index) in colors" :key="color"
					:style="`background: #${color}`"
					@click="changeColor(index)"
					class="color"
					:class="{ 'selected': this.currentColor == index }" />
			</div>
			<button id="btn-clear" @click="clear">Clear</button>
		</div>
	</section>
</template>

<script>
import {initializeEmptyCanvas, yearStartOffset} from '../../Utils';
let currentColor = 1;

let holdingDown = false;
let drawingBoard;
const lightColors = ['ebedf0', '9be9a8', '40c463', '30a14e', '216e39'];
const darkColors  = ['161b22', '01311f', '034525', '0f6d31', '00c647'];
const colors = lightColors;
export default {
	name: 'Canvas',
	props: ['year'],
	created() {
		window.setGraph = graph => this.drawingBoard = graph;
		window.getGraph = () => this.drawingBoard;
		this.initialize();
	},
	data() {
		return {drawingBoard, holdingDown, colors, currentColor, lightColors, darkColors};
	},
	methods: {
		colorDay(dayIndex) {
			if(this.holdingDown) {
				console.log('DRAWING!')
				this.drawingBoard[dayIndex] = this.currentColor;
			}
		},
		updateHoldingDown(val) {
			holdingDown = val;
		},
		changeColor(color) {
			this.currentColor = color;
		},
		cycleColor(e) {
			this.currentColor += e.deltaY > 0 ? 1 : -1;
			if(this.currentColor >= colors.length) this.currentColor = 0;
			else if(this.currentColor < 0) this.currentColor = colors.length - 1;
		},
		clear() {
			this.drawingBoard.fill(0);
		},
		importImage(e) {
			const file = e.target.files[0];
			// const img = this.$refs.importedImg;
			const img = new Image(53, 7);
			const reader = new FileReader();
			reader.addEventListener('load', (e) => {
				img.src = e.target.result;
				document.body.append(img);
				createImageBitmap(img).then(imageData => {
					console.log('hi!');
				});
			});
			reader.readAsDataURL(file);
		},
		initialize(drawingBoard = null) {
			this.drawingBoard = drawingBoard || initializeEmptyCanvas(this.year);
		},
		yearStartOffset
	}
};
</script>

<style>
	#canvas {
		display: inline-block;
		user-select: none;
	}
	input[type=radio] {
		display: none;
	}
	#btn-light {
		background: white;
		color: black;
	}
	input:checked ~ #btn-light {
		border: 2px solid black;
	}
	#btn-dark {
		background: black;
		color: white;
		border: none;
	}
	input:checked ~ #btn-dark {
		border: 2px solid white !important;
	}
	#chart {
		min-width: calc(15px * 51);
		min-height: calc(15px * 7);
		display: grid;
		grid-template-rows: repeat(7, 1fr);
		grid-auto-flow: column;
		gap: 1px;
		aspect-ratio: 52 / 7;
	}
	#chart .placeholder {
		width: 1fr;
		height: 1fr;
		display: inline-block;
	}
	#chart .day {
		width: 1fr;
		height:1fr;
		display: inline-block;
	}
	#chart .day:hover {
		border: 1px solid grey;
	}
	#drawing-controls {
		display: flex;
		justify-content: space-between;
	}
	.color {
		display: inline-block;
		width: 11px;
		height: 11px;
	}
	.selected {
		border: 1px solid blue;
		margin: 1px;
	}
</style>
