<template>
	<!-- 年度累计销量表格组件 -->
	<div class="annual-sales-table">
		<div class="table-line bg-ECF2FF">
			<div
				class="th"
				:style="{ 'width': typeof column.width === 'string' ? column.width : (column.width / tableColumn.reduce((sum, cur) => { return sum + (cur.width as number) }, 0)) * 100 + '%' }"
				v-for="(column, columnIndex) in tableColumn"
				:key="'th' + columnIndex"
			>
				{{ column.title }}
			</div>
		</div>
		<!-- 空数据 -->
		<div
			class="flex-c"
			v-if="tableTotal.every((i: any)=>i.title === 0)"
		>
			<van-empty description="暂无数据" />
		</div>
		<!-- 合计 -->
		<div class="table-line bg-F7F8FA splitline">
			<div
				class="th"
				:style="{ 'width': typeof column.width === 'string' ? column.width : (column.width / tableColumn.reduce((sum, cur) => { return sum + (cur.width as number) }, 0)) * 100 + '%' }"
				v-for="(column, columnIndex) in tableTotal"
				:key="'total' + columnIndex"
			>
				{{ column.title }}
			</div>
		</div>
		<!-- 表格数据 -->
		<div
			class="table-line bg-FFFFFF splitline"
			v-for="(division, divisionIndex) in data"
			:key="'division' + divisionIndex"
		>
			<!-- 业务 -->
			<div
				class="left-section"
				:style="{ 'width': (140 / tableColumn.reduce((sum, cur) => { return sum + (cur.width as number) }, 0)) * 100 + '%' }"
			>
				{{ division.businessLine }}
			</div>
			<!-- 产品线销量数据 -->
			<div class="right-section">
				<div
					class="td-line"
					v-for="(tdLine, tdLineIndex) in division.productLines"
					:key="'tdLine' + tdLineIndex"
				>
					<div
						class="td splitline"
						:style="{ 'width': typeof td.width === 'string' ? td.width : (td.width / tdWidth.reduce((sum, cur) => { return sum + (cur.width as number) }, 0)) * 100 + '%' }"
						v-for="(td, tdIndex) in tdWidth"
						:key="'td' + tdIndex"
					>
						{{ tdLine[td.key] }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// const router = useRouter();

const props = defineProps({
	tableData: {
		type: Object,
		default: {}
	}
});

// 监听数据变化
watch(
	() => props.tableData,
	newVal => {
		tableTotal.value = [
			{ title: '合计', width: 280 },
			{ title: newVal.total?.targetSales || 0, width: 120 },
			{ title: newVal.total?.actualSales || 0, width: 100 },
			{ title: newVal.total?.invoicedAmount || 0, width: 100 },
			{ title: newVal.total?.stockLevel || 0, width: 100 },
			{ title: newVal.total?.overdueNum || 0, width: 100 }
		];
		data.value = newVal.list;
	},
	{ deep: true }
);

const data = ref<any>([]);

const tableColumn = [
	{ title: '业务', width: 140, key: 'businessLine' },
	{ title: '产品线', width: 140, key: 'productLine' },
	{ title: '目标销量', width: 120, key: 'targetSales' },
	{ title: '实销', width: 100, key: 'actualSales' },
	{ title: '开票', width: 100, key: 'invoicedAmount' },
	{ title: '库存', width: 100, key: 'stockLevel' },
	{ title: '超期车', width: 100, key: 'overdueNum' }
];

const tdWidth = ref<any[]>(tableColumn.filter((item, index) => index > 0));

const tableTotal = ref<any[]>([]);

onMounted(() => {});
</script>

<style lang="less" scoped>
.annual-sales-table {
	.table-line {
		width: 100%;
		display: flex;
		font-size: 14px;
		font-weight: 400;
		color: #1d2129;
		letter-spacing: -0.3px;

		&.bg-ECF2FF {
			background-color: #ecf2ff;
		}

		&.bg-F7F8FA {
			background-color: #f7f8fa;
		}

		&.bg-FFFFFF {
			background-color: #ffffff;
		}

		.th {
			width: 100%;
			padding: @padding-com 0px;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
		}

		.left-section {
			padding: @padding-com 0px;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.right-section {
			flex: 1;

			.td-line {
				display: flex;

				&:first-child {
					background-color: #f7f8fa;
				}

				.td {
					width: 100%;
					padding: @padding-com 0px;
					display: flex;
					justify-content: center;
					align-items: center;
					text-align: center;
				}
			}
		}
	}
}
</style>
