<template>
	<div class="page-Footer">
		<slot name="inner"></slot>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.page-Footer {
	position: sticky;
	left: 0;
	bottom: 0;
	z-index: 2;
	background: #fff;
	box-shadow: 0 -5px 10px #F9FAFB;
	width: 100%;
	height: 120px;
	display: flex;
	justify-content: space-around;
	padding: 20px 20px;
}
</style>
