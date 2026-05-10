<template>
	<div class="list-card1">
		<div class="title">{{ item.title }}</div>
		<div class="count">{{ item.count }}家</div>
		<div
			class="linkRelativeRatio"
			v-if="item.linkRelativeRatio == 0"
		>
			环比
			<span class="text-color-green">持平</span>
		</div>
		<div
			class="linkRelativeRatio"
			v-if="item.linkRelativeRatio < 0"
		>
			环比
			<span class="text-color-red">↓{{ item.linkRelativeRatio }}</span>
			家
		</div>
		<div
			class="linkRelativeRatio"
			v-if="item.linkRelativeRatio > 0"
		>
			环比
			<span class="text-color-green">↑+{{ item.linkRelativeRatio }}</span>
			家
		</div>
		<div class="coverage">
			覆盖度
			<span class="text-color-1d2129">{{ item.coverage }}</span>%
		</div>
		<van-progress
			class="progress"
			:percentage="item.coverage"
			:show-pivot="false"
			track-color="#F7F8FA"
			color="#246EFF"
		></van-progress>
	</div>
</template>

<script setup lang="ts">
// const router = useRouter();

defineProps({
	item: {
		type: Object,
		default: {
			title: '',
			// 数量
			count: 0,
			// 环比
			linkRelativeRatio: '',
			// 覆盖率
			coverage: 0
		}
	}
});
</script>

<style lang="less" scoped>
.list-card1 {
	padding: @padding-sm;
	border-radius: 4px;
	background: #fff;

	.title {
		color: #000000;
		font-size: 14px;
		font-weight: 500;
		letter-spacing: -0.3px;
		margin-bottom: @margin-sm;
	}

	.count {
		color: @gray;
		font-size: 14px;
		font-weight: 500;
		letter-spacing: -0.3px;
		margin-bottom: @margin-base;
	}

	.linkRelativeRatio {
		color: @gray;
		font-size: 12px;
		font-weight: 400;
		letter-spacing: -0.3px;
		margin-bottom: @margin-base;
	}

	.coverage {
		color: @gray;
		font-size: 12px;
		font-weight: 400;
		letter-spacing: -0.3px;
		margin-bottom: @margin-xs;
	}
	.progress{
		height: 8px;
	}
}
</style>
