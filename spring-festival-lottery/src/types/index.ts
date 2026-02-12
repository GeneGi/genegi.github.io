/**
 * 春晚庙会抽奖系统 - 类型定义
 * 
 * 本文件定义了抽奖系统的核心数据模型
 */

/**
 * 奖品接口
 * 
 * 表示一个可以被抽取的奖品项目
 * 
 * @property id - 唯一标识符（使用 UUID）
 * @property name - 奖项名称（如"一等奖"）
 * @property totalCount - 初始总数量
 * @property remainingCount - 剩余数量
 * @property description - 奖品描述（可选）
 * 
 * 验证需求：1.2, 1.4, 2.1
 */
export interface Prize {
  id: string;
  name: string;
  totalCount: number;
  remainingCount: number;
  description?: string;
}

/**
 * 抽奖历史记录接口
 * 
 * @property timestamp - 抽奖时间戳
 * @property prizeName - 中奖奖品名称
 * @property remainingInventory - 抽奖后的剩余库存快照
 */
export interface DrawHistory {
  timestamp: number;
  prizeName: string;
  remainingInventory: { [prizeName: string]: number };
}

/**
 * 抽奖状态接口
 * 
 * 表示整个抽奖系统的当前状态
 * 
 * @property prizes - 奖品列表
 * @property currentResult - 当前抽奖结果（可选，表示最近一次抽奖的结果）
 * @property isDrawing - 是否正在抽奖（用于控制动画状态）
 * @property totalDrawn - 已抽取总数（统计信息）
 * @property history - 抽奖历史记录
 * 
 * 验证需求：1.2, 1.4, 2.1
 */
export interface LotteryState {
  prizes: Prize[];
  currentResult: Prize | null;
  isDrawing: boolean;
  totalDrawn: number;
  history: DrawHistory[];
}
