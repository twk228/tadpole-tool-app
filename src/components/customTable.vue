<template>
  <!-- 自定义表格--根据列进行处理 -->
  <div class="custom-table">
    <slot name="table-header"></slot>
    <div class="table-box" :class="{ 'scroll-box': isFixedHeader }">
      <div
        class="column"
        :class="{ 'flex-1': !column.width }"
        :style="{ 'width': typeof column.width === 'string' ? column.width : ((column.width as any) / tableColumn.reduce((sum, cur) => { return sum + (cur.width as number) }, 0)) * 100 + '%' }"
        v-for="(column, columnIndex) in tableColumn"
        :key="'column' + columnIndex">
        <div
          class="th"
          :style="{ 'background-color': thBgColor }"
          :class="{
            'th-fixed': isFixedHeader,
            'p-l-16': !isTextCenter,
            'text-center': isTextCenter,
            'is-set-width': !!column.width,
          }">
          {{ column.title }}
        </div>
        <div
          class="td splitline"
          :class="{
            'text-center': isTextCenter,
            'p-l-16': !isTextCenter,
            'is-set-width': !!column.width,
            stripe1: stripeMode === '1',
            stripe2: stripeMode === '2',
          }"
          v-for="(item, tdIndex) in tableData"
          :key="tdIndex">
          <div class="td-inner" v-if="!column.tooltip">
            <span
              v-if="column.render && !column.click"
              v-html="column.render(item)"></span>
            <span
              v-if="column.render && column.click"
              @click="(column as any).click(item)"
              v-html="column.render(item)"></span>
            <span v-if="!column.render && !column.click && !column.tooltip">{{
              item[column.key] === null ||
              item[column.key] === undefined ||
              item[column.key] === ''
                ? '无'
                : item[column.key]
            }}</span>
          </div>

          <touch-tool-tip
            v-if="column.tooltip"
            :text="
              item[column.key] === null ||
              item[column.key] === undefined ||
              item[column.key] === ''
                ? '无'
                : String(item[column.key])
            ">
          </touch-tool-tip>
        </div>
      </div>
    </div>
    <!-- 空数据 -->
    <van-empty v-if="!tableData.length" description="暂无数据" />
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue';

  // 引入公共方法
  import { copyToClipboard } from '@/utils';
  // 引入组件
  import touchToolTip from './toolTip.vue';

  interface TableColumn {
    title: string;
    key: string;
    width?: string | number;
    tooltip?: boolean;
    render?: (row: any) => string;
    click?: (row: any) => void;
  }

  // 定义表格数据接口
  interface TableData {
    [key: string]: string | number; // 允许字符串或数字类型的值
  }

  // const router = useRouter();

  const props = defineProps({
    tableColumn: {
      type: Array as PropType<TableColumn[]>,
      default: () => [],
    },
    tableData: {
      type: Array as PropType<TableData[]>,
      default: () => [],
    },
    // 是否固定表头
    isFixedHeader: {
      type: Boolean,
      default: false,
    },
    // 是否居中
    isTextCenter: {
      type: Boolean,
      default: false,
    },
    // 表头背景颜色
    thBgColor: {
      type: String,
      default: '#ECF2FF',
    },
    // 斑马纹模式
    stripeMode: {
      type: String,
      default: '1',
    },
  });

  const lastTapTime = ref(0);
  const handleClick = (text: string, event: any) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime.value;
    lastTapTime.value = currentTime;
    // 如果两次点击在300ms内，则认为是双击
    if (tapLength < 300 && tapLength > 0) {
      // 阻止默认行为以避免可能的页面缩放
      event.preventDefault();
      // 触发复制
      copyToClipboard(text);
    }
  };
</script>

<style lang="less" scoped>
  .custom-table {
    .table-box {
      width: 100%;
      display: flex;
      font-size: 14px;
      font-weight: 400;
      color: #1d2129;
      letter-spacing: -0.3px;

      &.scroll-box {
        overflow-x: scroll;
      }

      .column {
        &.flex-1 {
          flex: 1;
        }

        .th {
          background-color: #ecf2ff;
          padding: @padding-com;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          width: 100%;

          &.th-fixed {
            position: sticky;
            top: -1px;
            z-index: 1;
          }

          &.text-center {
            text-align: center;
          }

          &.is-set-width {
            padding: @padding-com 0px;
          }
        }

        .td {
          padding: @padding-com;

          .td-inner {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            line-height: 20px;
          }

          .tool-tip-text {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            line-height: 20px;
          }

          &.text-center {
            text-align: center;
          }

          &.is-set-width {
            padding: @padding-com 0px;
          }
        }

        .stripe1 {
          &:nth-child(2n + 1) {
            background-color: #f8f8f8;
          }
        }

        .stripe2 {
          &:nth-child(2n) {
            background-color: #f8f8f8;
          }
        }
      }
    }
  }
</style>
