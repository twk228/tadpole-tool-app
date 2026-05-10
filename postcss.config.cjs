const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

module.exports = {
  plugins: [
    autoprefixer({
      // 配置使用 autoprefixer
      overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8']
    }),
    pxtorem({
      rootValue: 37.5,
      propList: ['*'],
      selectorBlackList: ['van-circle__layer'],
      /**
       * 注意：这里mediaQuery仅仅设置是否转换media选择器本身的px，而不是该选择器下style的px
       * 如： @media screen and (min-width: 768px) { html: { font-size: 76.8px } }
       * mediaQuery: true => @media screen and (min-width: 10.24rem) { html: { font-size: 1.024rem } }
       * mediaQuery: false => @media screen and (min-width: 768px) { html: { font-size: 1.024rem } }
       * 解决：
       *   1. 使用'PX'忽略转换单个属性(注意prettier会将'PX'格式化为'px', 需使用'/* prettier-ignore *\/'忽略格式化)
       *   2. 使用exclude忽略整个文件
       */
      // mediaQuery: false,
      // exclude: (file) => /response\.less/i.test(file),
    }),
  ],
};
