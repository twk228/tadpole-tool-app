<template>
  <!-- 自定义表格--根据行进行处理 -->
  <div class="custom-table2">
    <div class="table-box">
      <div
        class="table-header"
        :style="{ 'background-color': thBgColor }"
        :class="{ fixed: isFixedHeader }">
        <div
          class="th"
          :style="{ 'width': typeof column.width === 'string' ? column.width : ((column.width as any) / tableColumn.reduce((sum, cur) => { return sum + (cur.width as number) }, 0)) * 100 + '%' }"
          v-for="(column, columnIndex) in tableColumn"
          :key="'column' + columnIndex"
          :class="{
            'flex-1': !column.width,
            'text-center': isTextCenter,
            'is-set-width': !!column.width,
          }">
          {{ column.title }}
        </div>
      </div>
      <div class="table-body">
        <div
          class="table-item splitline"
          v-for="(item, tdIndex) in tableData"
          :key="tdIndex">
          <div
            class="td"
            :style="{ 'width': typeof column.width === 'string' ? column.width : ((column.width as any) / tableColumn.reduce((sum, cur) => { return sum + (cur.width as number) }, 0)) * 100 + '%' }"
            v-for="(column, columnIndex) in tableColumn"
            :key="`${tdIndex}td${columnIndex}`"
            :class="{
              'flex-1': !column.width,
              'text-center': isTextCenter,
              'is-set-width': !!column.width,
              'is-no-wrap': isNoWrap,
            }">
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue';
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
    // 是否不换行
    isNoWrap: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="less" scoped>
  .custom-table2 {
    .table-box {
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #1d2129;
      letter-spacing: -0.3px;
      position: relative;

      .table-header {
        display: flex;
        padding: 0px @padding-com;
        gap: 10px;
        &.fixed {
          width: 100%;
          position: sticky;
          top: 0px;
          z-index: 1;
        }
        .th {
          &.flex-1 {
            flex: 1;
          }
          background-color: #ecf2ff;
          padding: @padding-com 0px;
          white-space: nowrap;
          width: 100%;

          &.text-center {
            text-align: center;
          }

          &.is-set-width {
            padding: @padding-com 0px;
          }
        }
      }

      .table-body {
        .table-item {
          display: flex;
          padding: 0px @padding-com;
          gap: 10px;
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
          .td {
            padding: @padding-com 0;
            display: flex;
            align-items: center;

            .td-inner {
              line-height: 20px;
            }

            .is-no-wrap {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
            }

            &.text-center {
              display: flex;
              align-items: center;
              text-align: center;
            }

            &.is-set-width {
              padding: @padding-com 0px;
            }
          }
        }
      }
    }
  }
</style>
