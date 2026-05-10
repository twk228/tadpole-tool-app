<template>
  <!-- 选择用户权限 -->
  <view class="picker-tool">
    <van-popup v-model:show="showPicker" position="bottom">
      <view class="picker-inner">
        <view class="picker-header">
          <view class="cancel" @click.stop="cancelFun()">取消</view>
          <view class="title">{{ pickerTitle }}</view>
          <view class="confirm" @click.stop="confirmFun()">保存</view>
        </view>
        <view class="picker-body">
          <view class="card">
            <view
              class="card-li"
              :class="{
                cur: selectFirstLevel.value == item.value,
                'icon-arrow-imitate arrow-CBD6EA':
                  item.childData.length > 0 &&
                  selectFirstLevel.value != item.value,
                'icon-arrow-imitate arrow-3778F3':
                  item.childData.length > 0 &&
                  selectFirstLevel.value == item.value,
              }"
              v-for="(item, index) in firstLevelList"
              :key="index"
              @click.stop="selectItem(item, 1)">
              <text
                class="card-li-text"
                :class="{ scale8: item.value.length > 8 }"
                >{{ item.value }}</text
              >
            </view>
          </view>

          <view
            class="card-title"
            v-if="selectFirstLevel.childData?.length > 0">
            {{ selectFirstLevel.value }}
          </view>

          <van-loading
            color="#1989fa"
            class="loading-box"
            v-if="
              (thirdList.length == 0 && thirdLoading) ||
              (secondaryList.length == 0 && secondaryLoading) ||
              (firstLevelList.length == 0 && firstLevelLoading)
            " />

          <view class="card">
            <view
              class="card-li"
              :class="{
                cur: selectSecondary.value == item.value,
                'icon-arrow-imitate arrow-CBD6EA':
                  item.childData.length > 0 &&
                  selectSecondary.value != item.value,
                'icon-arrow-imitate arrow-3778F3':
                  item.childData.length > 0 &&
                  selectSecondary.value == item.value,
              }"
              v-for="(item, index) in secondaryList"
              :key="index"
              @click.stop="selectItem(item, 2)">
              <text
                class="card-li-text"
                :class="{ scale8: item.value.length > 8 }"
                >{{ item.value }}</text
              >
            </view>
          </view>

          <view class="card-title" v-if="selectSecondary.childData?.length > 0">
            {{ selectSecondary.value }}
          </view>

          <view class="card">
            <view
              class="card-li"
              :class="{
                cur: item.isCheckbox
                  ? selectThird.value && selectThird.value.includes(item.value)
                  : selectThird.value === item.value,
              }"
              v-for="(item, index) in thirdList"
              :key="index"
              @click.stop="selectItem(item, 3)">
              <text
                class="card-li-text"
                :class="{ scale8: item.value.length > 8 }"
                >{{ item.value }}</text
              >
            </view>
          </view>
        </view>
      </view>
    </van-popup>
  </view>
</template>

<script setup>
  import { ref, nextTick } from 'vue';
  import { useToast } from '@/hooks';
  import { findIndexByValue } from '@/utils/publicMethod';
  // 引入接口方法
  import userApi from '@/api/user/index';

  const props = defineProps({
    // 弹出框标题
    pickerTitle: { type: String, default: '' },
    // 传入的 已选择的数据
    selectedData: { type: Object },
  });

  const emit = defineEmits(['cancelModel', 'confirmModel']);
  const { startLoading, stopLoading, showToast } = useToast();

  const showPicker = ref(false);

  // 一级数据
  const firstLevelList = ref([]);
  // 二级数据
  const secondaryList = ref([]);
  // 三级数据
  const thirdList = ref([]);
  // 选择的一级数据
  const selectFirstLevel = ref({});
  // 选择的二级数据
  const selectSecondary = ref({});
  // 选择的三级数据
  const selectThird = ref({});
  // 一级加载标识
  const firstLevelLoading = ref(false);
  // 二级加载标识
  const secondaryLoading = ref(false);
  // 三级加载标识
  const thirdLoading = ref(false);

  // 选择
  // item 当前项 ； type 类型
  const selectItem = (item, type) => {
    if (type == 1) {
      // 设置当前选择的一级
      selectFirstLevel.value = item;
      // 重置选择的二级
      selectSecondary.value = {};
      secondaryList.value = [];
      // 重置选择的三级
      selectThird.value = {};
      thirdList.value = [];

      if (item.childData.length > 0) {
        secondaryList.value = item.childData;
      }
    } else if (type == 2) {
      // 设置当前选择的二级
      selectSecondary.value = item;
      // 重置选择的三级
      selectThird.value = {};
      thirdList.value = [];

      if (item.childData.length > 0) {
        thirdList.value = item.childData;
      }
    } else if (type == 3) {
      if (item.isCheckbox) {
        // 初始化：如果 selectThird 未赋值，先深拷贝 item 并初始化 value 为数组
        if (!selectThird.value.value) {
          selectThird.value = JSON.parse(JSON.stringify(item));
          selectThird.value.value = [item.value];
        } else {
          if (selectThird.value.value.includes(item.value)) {
            // 存在则删除（取消选中）
            selectThird.value.value = selectThird.value.value.filter(
              (i) => i !== item.value
            );
          } else {
            // 不存在则添加（选中）
            selectThird.value.value.push(item.value);
          }
        }
        // 是否全选
        selectThird.value.isAll =
          selectThird.value.value.length === thirdList.value.length;
      } else {
        // 非复选框类型，直接赋值
        selectThird.value = item;
      }
    }
  };
  // 取消
  const cancelFun = () => {
    emit('cancelModel', {
      pickerName: props.pickerTitle,
      message: '取消',
    });
  };
  // 确认
  const confirmFun = () => {
    if (!selectFirstLevel.value.value) {
      showToast('请选择一级权限', 'info');
      return;
    }
    if (secondaryList.value.length > 0 && !selectSecondary.value.value) {
      showToast('请选择二级权限', 'info');
      return;
    }
    if (
      thirdList.value.length > 0 &&
      (selectThird.value.isCheckbox
        ? !selectThird.value.value.length
        : !selectThird.value.value)
    ) {
      showToast('请选择三级权限', 'info');
      return;
    }
    emit('confirmModel', {
      pickerName: props.pickerTitle,
      message: '确认',
      data: {
        firstLevel: selectFirstLevel.value,
        secondary: selectSecondary.value,
        third: selectThird.value,
      },
    });
  };

  /**
   * @description 获取权限数据
   */
  const getOptionsFun = () => {
    firstLevelLoading.value = true;
    userApi
      .getUserAuthTree()
      .then((res) => {
        console.log(res);
        if (res.code == 200 && res.data.length > 0) {
          firstLevelList.value = res.data;
          if (props.selectedData?.firstLevel) {
            selectFirstLevel.value =
              firstLevelList.value[
                findIndexByValue(
                  firstLevelList.value,
                  props.selectedData.firstLevel.value
                )
              ];
            if (selectFirstLevel.value.childData.length > 0) {
              secondaryList.value = selectFirstLevel.value.childData;
              if (props.selectedData?.secondary) {
                selectSecondary.value =
                  secondaryList.value[
                    findIndexByValue(
                      secondaryList.value,
                      props.selectedData.secondary.value
                    )
                  ];
                if (selectSecondary.value.childData.length > 0) {
                  thirdList.value = selectSecondary.value.childData;
                  if (props.selectedData?.third) {
                    selectThird.value = props.selectedData.third;
                  }
                }
              }
            }
          }
        }
      })
      .finally(() => {
        firstLevelLoading.value = false;
      });
  };

  // 组件展示控制
  const PickerDisplayControlFun = (display) => {
    showPicker.value = display;
    if (display) {
      // 获取选项数据
      getOptionsFun();
    } else {
      // 一级数据
      firstLevelList.value = [];
      selectFirstLevel.value = {};
      // 二级数据
      secondaryList.value = [];
      selectSecondary.value = {};
      // 三级数据
      thirdList.value = [];
      selectThird.value = {};
    }
  };

  // 暴露给父组件的事件
  defineExpose({
    PickerDisplayControlFun,
  });
</script>

<style scoped lang="less">
  .picker-tool {
    // position: fixed;
    // top: 0;
    // left: 0;
    // z-index: 10;
    // background: rgba(0, 0, 0, 0.5);
    // width: 100vw;
    // height: 100vh;
    // display: flex;
    // align-items: flex-end;
    // justify-content: center;
    .picker-inner {
      width: 100vw;
      height: 60vh;
      background: #fff;
      border-radius: 6px 6px 0 0;
      display: flex;
      flex-direction: column;
      transform: translate3d(0, 0, 2px);
      .picker-title {
        width: 100%;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 16px;
        color: #323233;
        font-weight: 500;
      }
      .main-box {
        flex-grow: 1;
        box-sizing: border-box;
        padding: 10px 16px;
        overflow-y: auto;

        .list {
          flex-wrap: wrap;
          .li {
            width: calc(50% - 8px);
            margin-bottom: 10px;
            background: #f4f6f9;
            border: 1px solid #f4f6f9;
            color: #000000;
            box-sizing: border-box;
            border-radius: 20px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            .li-inner {
              width: 100%;
              height: 36px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 400;
              font-size: 14px;

              &.scale8 {
                font-size: 12px;
                transform: scale(0.8);
              }
              &.scale9 {
                font-size: 12px;
                transform: scale(0.9);
              }
              &.scale10 {
                font-size: 12px;
                // transform: scale(0.9);
              }
            }
            .arrow-icon {
              width: 12px;
              height: 12px;
              position: absolute;
              right: 5px;
            }
            &:nth-child(2n + 1) {
              margin-right: 16px;
            }
            &.cur {
              background: #1789ff0f;
              border: 1px solid #1789ff;
              color: #1789ff;
            }
          }
        }
        .picker-no-data {
          padding: 30px;
          text-align: center;
        }
      }
      .footer-box {
        width: 100%;
        height: 50px;
        font-size: 14px;
        border-top: 1px solid #f4f6f9;
        .btn {
          flex: 1;
          line-height: 50px;
          font-weight: 500;
          font-size: 16px;
          text-align: center;
          &.btn-cancel {
            color: #323233;
            position: relative;
            &::after {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              width: 1px;
              height: 100%;
              background: #f4f6f9;
              transform: rotateY(30deg);
            }
          }
          &.btn-confirm {
            color: #1789ff;
          }
        }
      }

      .picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 48px;
        flex-shrink: 0;
        .title {
          text-align: center;
          font-size: 16px;
          color: #1c2025;
          font-weight: 500;
          flex-grow: 1;
        }
        .cancel,
        .confirm {
          padding: 5px 16px;
          flex-shrink: 0;
          color: #1789ff;
          font-size: 14px;
          &.cancel {
            color: #95a2b9;
          }
        }
      }

      .picker-body {
        flex-grow: 1;
        box-sizing: border-box;
        padding: 10px 16px;
        .card-title {
          display: flex;
          color: #1c2025;
          font-size: 16px;
          font-weight: 500;
          padding: 10px 0;
        }
        .loading-box {
          margin: 10vh auto;
          display: flex;
          justify-content: center;
        }
        .card {
          display: flex;
          flex-wrap: wrap;
          &:last-child {
            min-height: 80px;
            padding-bottom: 20px;
          }
          .icon-arrow-imitate {
            padding-right: 15px;
            position: relative;
            &::after {
              content: '';
              position: absolute;
              top: 50%;
              right: 10px;
              width: 8px;
              height: 8px;
              box-sizing: border-box;
              border: 0px solid transparent;
              transform-origin: center;
              transform: translateY(-50%) rotate(45deg);
            }
            &.arrow-CBD6EA {
              &::after {
                border-top: 2px solid #cbd6ea;
                border-right: 2px solid #cbd6ea;
              }
            }
            &.arrow-3778F3 {
              &::after {
                border-top: 2px solid #1789ff;
                border-right: 2px solid #1789ff;
              }
            }
          }
          .card-li {
            width: 32%;
            height: 38px;
            margin-bottom: 10px;
            background-color: #f4f6f9;
            border: 1px solid #f4f6f9;
            color: #000000;
            box-sizing: border-box;
            border-radius: 20px;
            display: flex;
            justify-content: center;
            &:not(&:nth-child(3n)) {
              margin-right: 2%;
            }
            .card-li-text {
              display: inline-flex;
              justify-content: center;
              align-items: center;
              text-align: center;
              width: 95%;

              font-weight: 400;
              font-size: 12px;

              &.scale8 {
                transform: scale(0.8);
              }
              &.scale9 {
                transform: scale(0.9);
              }
            }
            &.cur {
              background-color: rgba(55, 120, 243, 0.08);
              border: 1px solid #1789ff;
              color: #1789ff;
            }
          }
        }
      }
    }
  }
</style>
