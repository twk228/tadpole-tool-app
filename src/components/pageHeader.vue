<template>
	<div class="page-header">
		<div class="main" :class="{ 'splitline': showSunHeader }">
			<div class="back-box" v-if="showGack" @click="routerGo()">
				<div class="backIcon"></div>
			</div>
			<div class="back-box" v-else></div>
			<div class="title">{{ title }}</div>
			<div class="tool-box">
				<slot name="tool"></slot>
			</div>
		</div>
		<view class="sun">
			<slot name="sun-header"></slot>
		</view>
	</div>
</template>

<script setup lang="ts">

// import debug from '@/utils/debug';
import { useUserStore } from '@/store';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();

const props = defineProps({
	title: String,
	showSunHeader: {
		type: Boolean,
		default: false
	},
	showGack: {
		type: Boolean,
		default: true
	},
	isHarmonyBack: {
		type: Boolean,
		default: false
	}
});

// 当前环境
const Env = ref<any>({});

const routerGo = () => {
	if(props.isHarmonyBack){
		return;
	}
	if (Env.value.h5) {
		router.go(-1);
	} else {
		uni.navigateBack();
	}
};

onMounted(() => {
	uni.getEnv((res: any) => {
		console.log('当前环境：' + JSON.stringify(res));
		Env.value = res
	});
});

</script>

<style lang="less" scoped>
.page-header {
	position: sticky;
	left: 0;
	top: 0;
	z-index: 2;
	background: #fff;
	margin-bottom: 20px;
	box-shadow: 0 5px 10px #F9FAFB;

	.main {
		height: 88px;
		display: flex;
		justify-content: space-between;
		padding-right: 88px;

		.back-box,
		.tool-box {
			min-width: 88px;
			height: 88px;
			flex: none;

			.backIcon {
				display: flex;
				align-items: center;
				justify-content: center;
				// background: url('@/assets/icons/icon-goback.png') no-repeat center / 28px auto;
				width: 100%;
				height: 100%;
			}
		}

		.tool-box {
			position: absolute;
			right: 0;
			top: 0;
			display: flex;
			align-items: center;
			font-weight: 400;
		}

		.title {
			flex-grow: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			padding: 0 10px;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			font-weight: 500;
			font-size: 36px;
			letter-spacing: 2px;
			color: #1C2025;
		}
	}

	.splitline {
		position: relative;

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 2px;
			background: #F4F6F9;
			transform: rotateX(30deg);
		}

		&.topline::after {
			top: 0;
			bottom: auto;
		}
	}
}
</style>
