// let PageRem = document.documentElement.getBoundingClientRect().width / 10;

// 获取当前日期:月/日
export const NewTimeStr = () => {
	let month = new Date().getMonth() + 1; // 当前月
	let date = new Date().getDate(); // 当前日
	let m = month;
	// let m = month > 9 ? month:'0'+month;
	let d = date;
	// let d = date >  9 ? date: '0'+date;
	return `${m}/${d}`;
}

/**
 * 纵向柱状图
 */
export const BarChartConfigVertical = (list: any[], seriesConfig: any[], isStack: boolean = false) => {

	let GridPx = {
		top: 20,
		left: 40,
		bottom: seriesConfig.length > 5 ? 75 : 55,
		right: 16
	}
	let BarSize = {
		barWidth: isStack ? 25 : 15,
		barBorderRadius: [10, 10, 0, 0],
		fontSize: 12,
		fontSizeAxisLabel: 12
	}

	var series: any[] = seriesConfig;

	series = series.map(item => {
		return {
			name: item.name,
			type: item.type,
			stack: isStack ? 'Ad' : null,
			symbol: 'none',
			data: list.map(listItem => {
				return listItem[item.fieldName]
			}),
			showBackground: item.showBackground || false, // 开启背景
			backgroundStyle: {
				color: 'rgba(214, 219, 237, 0.4)' // 背景颜色
			},
			legendHoverLink: false,
			// label: {
			// 	show: false,
			// 	position: 'top',
			// 	fontSize: BarSize.fontSize,
			// 	textShadowColor: '#ffffff',
			// 	textShadowBlur: 0.5,
			// 	textShadowOffsetX: 0.5,
			// 	textShadowOffsetY: 0.5,
			// 	formatter: (data: any) => {
			// 		let value = list[data.dataIndex].value;
			// 		let twoValue = data.value;

			// 		if (data.name == NewTimeStr()) {
			// 			return `{selectedA|${value}}{selectedB|/${twoValue}}`;
			// 		} else {
			// 			return `{defaultA|${value}}{defaultB|/${twoValue}}`;
			// 		}
			// 	},
			// 	rich: {
			// 		selectedA: { color: '#1789FF', fontWeight: '500' },
			// 		selectedB: { color: '#F7BA39', fontWeight: '500' },
			// 		defaultA: { color: '#1789FF', fontWeight: '400' },
			// 		defaultB: { color: '#F7BA39', fontWeight: '400' }
			// 	}
			// },
			barWidth: BarSize.barWidth,
			itemStyle: {
				color: item.color
			},
			emphasis: {
				disabled: true,
				label: {
					show: true,
				},
				itemStyle: {
					// color: '#0B8EF5'
				}
			}
		}
	})

	let option = {
		// 控制--图表四边留白
		grid: GridPx,
		// 控制--图表横轴展示
		xAxis: {
			type: 'category',
			data: list.map((item) => {
				return item.name;
			}),
			axisTick: {
				show: false
			},
			axisLine: {
				show: true
			},
			axisLabel: {
				rotate: 0,
				color: function (params: { name: string }) {
					if (params.name == NewTimeStr()) {
						return '#EA6A4C';
					} else {
						return '#999';
					}
				},
				fontSize: BarSize.fontSizeAxisLabel
			},
			splitLine: {
				show: true,
				lineStyle: {
					type: 'dashed',
					color: '#E6E6E6'
				}
			},
			boundaryGap: true,
		},
		// 控制--图表竖轴展示
		yAxis: {
			type: 'value',
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				show: true
			},
			splitNumber: 5,
			splitLine: {
				show: true,
				lineStyle: {
					type: 'dashed',
					color: '#E6E6E6'
				}
			},
		},
		// 图例
		legend: {
			show: true,
			icon: 'rect',
			top: 'bottom',
			itemGap: 15,
			itemWidth: 6,
			itemHeight: 6,
			selectedMode: true,
			data: seriesConfig.map(item => {
				return {
					name: item.name,
					itemStyle: {
						color: item.color
					}
				}
			}),
		},
		// 设置图表缩放与滑动
		dataZoom: {
			start: 0,
			maxValueSpan: 6,
			type: 'inside',
			zoomLock: true
		},
		series: series,
		tooltip: {
			show: true,
			extraCssText: 'z-index:20',
			borderColor: '#1789FF',
			formatter: function (params: any) {
				let item = list[params.dataIndex];
				let str = `${item.name}`;
				seriesConfig.forEach(s => {
					str += `<br/>${s.name}: ${item[s.fieldName]}${s.name == '完成率' ? '%' : ''}`;
				});
				return str;
			}
		}
	};
	return option;
};

/**
 * 横向柱状图
 * @param list 图表数据
 */
export const BarChartConfigTransverse = (list: any[]) => {
	let GridPx = {
		top: 16,
		left: 50,
		bottom: 16,
		right: 40
	}
	let BarSize = {
		barWidth: 8,
		barBorderRadius: [10, 10, 0, 0],
		fontSize: 14,
		fontSizeAxisLabel: 14
	}
	var series = [
		{
			name: 'x',
			type: 'bar',
			data: list.map(item => item.value),
			legendHoverLink: false,
			label: {
				show: true,
				position: 'right',
				fontSize: BarSize.fontSize,
				textShadowColor: '#ffffff',
				textShadowBlur: 0.5,
				textShadowOffsetX: 0.5,
				textShadowOffsetY: 0.5,
				formatter: (data: any) => {
					let labelText = '';
					let value = list[data.dataIndex].value;

					if (data.name == NewTimeStr()) {
						labelText = `{selectedA|${value}}`;
					} else {
						labelText = `{defaultA|${value}}`;
					}
					return labelText;
				},
				rich: {
					selectedA: { color: '#4E5969', fontWeight: '500' },
					defaultA: { color: '#4E5969', fontWeight: '400' },
				}
			},
			barWidth: BarSize.barWidth,
			itemStyle: {
				color: function (params: any) {
					if (params.name == NewTimeStr()) {
						return '#246EFF';
					} else {
						return '#246EFF';
					}
				}
			},
			emphasis: {
				disabled: true,
				label: {
					show: true,
				},
				itemStyle: {
					// color: '#0B8EF5'
				}
			}
		}
	]

	for (let i = 0; i < series.length; ++i) {
		const data = (series[i] as any).data;
		for (let j = 0; j < data.length; ++j) {
			let barBorderRadius: number | number[] = 0;
			let value = list[j].value;
			if (value > 0) {
				barBorderRadius = [10, 10, 10, 10];
			} else if (value < 0) {
				barBorderRadius = [10, 0, 0, 10];
			}
			data[j] = {
				value: data[j],
				itemStyle: {
					borderRadius: barBorderRadius
				}
			};
		}
	}

	let option = {
		// 控制--图表四边留白
		grid: GridPx,
		// 控制--图表竖轴展示
		yAxis: {
			type: 'category',
			inverse: true,
			data: list.map((item) => {
				return item.name;
			}),
			axisTick: {
				show: false
			},
			axisLine: {
				show: false
			},
			axisLabel: {
				rotate: 0,
				color: '#4E5969',
				fontSize: BarSize.fontSizeAxisLabel
			},
			boundaryGap: true,
		},
		// 控制--图表横轴展示
		xAxis: {
			type: 'value',
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				show: false
			},
			splitNumber: 10,
			splitLine: {
				show: false,
				lineStyle: {
					color: '#E6E6E6'
				}
			}
		},
		// 设置图表缩放与滑动
		dataZoom: {
			start: 0,
			maxValueSpan: 6,
			type: 'inside',
			yAxisIndex: [0],
			zoomLock: true
		},
		// 图例
		legend: {
			show: false,
			top: 'bottom',
			itemGap: 15,
			itemWidth: 6,
			itemHeight: 6,
			selectedMode: false,
			data: []
		},
		itemStyle: {
			color: '#4E5969'
		},
		tooltip: {
			show: false,
			extraCssText: 'z-index:20',
			borderColor: '#246EFF',
			formatter: function (params: any) {
				let item = list[params.dataIndex];
				return `${item.name}：${item.value}`
			}
		},
		series: series
	};
	return option;
};