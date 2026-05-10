import { useToast } from "@/hooks";
const { showToast } = useToast();

/**
 * @description 获取当前格式化时间
 */
export const getDate = (Split: string = '/') => {
	const date = new Date();
	let year = <any>date.getFullYear();
	let month = <any>date.getMonth() + 1;
	let day = <any>date.getDate();

	// if (type === 'start') {
	// 	year = year - 60;
	// } else if (type === 'end') {
	// 	year = year + 2;
	// }
	month = month > 9 ? month : '0' + month;
	day = day > 9 ? day : '0' + day;
	return `${year}${Split}${month}${Split}${day}`;
}

/**
 * @description 计算时间,两个时间的时间差
 */
export const handleTimeDistance = (time: any, newDate: any) => {
	if (typeof time == 'string') {
		time = time.replace(/-/g, '/');
	}
	if (typeof newDate == 'string') {
		newDate = newDate.replace(/-/g, '/');
	}

	const newTime = new Date(newDate).getTime();
	const afferentTime = new Date(time).getTime();
	let DistanceTime = <any>((newTime - afferentTime) / 1000 / 60).toFixed(0);

	let str = ''
	if (DistanceTime <= 1) {
		str = '刚刚'
	} else if (DistanceTime < 60 && DistanceTime > 1) {
		str = `${DistanceTime}分钟前`
	} else if (DistanceTime >= 60 && DistanceTime < 1440) {
		str = `${(DistanceTime / 60).toFixed(0)}小时前`;
	} else if (DistanceTime >= 1440) {
		str = `${(DistanceTime / 1440).toFixed(0)}天前`;
	}
	return str
}

/**
 * @description 处理展示的文本
 * @param {string} text - 原始文本
 * @param {number} showLength - 展示长度
 */
export const handleText = (text: string, showLength: number) => {
	if (text.length < showLength) {
		return text
	} else {
		return text.substring(0, showLength) + '..'
	}
}

// 检验是否包含数据
export const inCludesFun = (dataList: any, item: any) => {
	return dataList.includes(item);
}

// 动态生成地址
export const generatePicturesUrl = (image: string) => {
	// image为相对路径
	// 第二个参数:当前路径的URL
	return new URL(`../assets/img/${image}`, import.meta.url).href;
};

// 复制内容到剪贴板
function fallbackCopy(text: string) {
	// 创建一个临时的textarea元素
	const textArea = document.createElement('textarea');
	textArea.value = text;
	textArea.style.position = 'fixed'; // 防止滚动
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	try {
		const successful = document.execCommand('copy');
		const msg = successful ? '复制成功' : '复制失败';
		showToast(msg);
	} catch (err) {
		console.error('复制失败:', err);
		showToast('复制失败');
	}
	document.body.removeChild(textArea);
};
export const copyToClipboard = (text: string) => {

	// 现代浏览器 Clipboard API
	if (navigator.clipboard) {
		navigator.clipboard.writeText(text).then(() => {
			showToast('复制成功');
		}).catch(err => {
			console.error('复制失败:', err);
			fallbackCopy(text);
		});
	} else {
		// 降级方案
		fallbackCopy(text);
	}
}

/**
 * @description  根据选项查找索引 在list中查找value出现的位置，供下拉选择使用
 * @param {Array} list
 * @param {number} value
 */
export function findIndexByValue(list: any[], value: any) {
	let index = list.findIndex(item => {
		return item.value == value
	})
	return index;
}
