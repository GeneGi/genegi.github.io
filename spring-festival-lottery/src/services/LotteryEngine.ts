/**
 * 春晚庙会抽奖系统 - 抽奖引擎
 * 
 * 负责执行抽奖逻辑，包括加权随机选择、奖品数量管理和系统重置
 * 
 * 验证需求：2.1, 2.2, 2.3, 2.4, 5.3, 5.4
 */

import type { Prize } from '../types';

/**
 * 抽奖引擎类
 * 
 * 提供抽奖执行、奖品可用性检查、数量递减和系统重置功能
 * 使用加权随机算法确保公平性
 */
export class LotteryEngine {
  private prizes: Prize[] = [];

  /**
   * 构造函数
   * 
   * @param initialPrizes - 初始奖品列表（可选）
   */
  constructor(initialPrizes: Prize[] = []) {
    this.prizes = initialPrizes;
  }

  /**
   * 执行抽奖
   * 
   * 使用加权随机算法从可用奖品池中选择一个奖品
   * 权重基于每个奖品的剩余数量
   * 
   * 算法步骤：
   * 1. 获取所有剩余数量 > 0 的奖品
   * 2. 计算总权重（所有可用奖品的剩余数量之和）
   * 3. 生成 0 到总权重之间的随机数
   * 4. 遍历奖品，累加权重，当累加值超过随机数时选中该奖品
   * 5. 将选中奖品的剩余数量减 1
   * 6. 返回选中的奖品
   * 
   * @returns 选中的奖品，如果没有可用奖品则返回 null
   * 
   * 验证需求：2.1, 2.2, 2.3
   */
  draw(): Prize | null {
    // 获取所有可用奖品（剩余数量 > 0）
    const availablePrizes = this.prizes.filter(prize => prize.remainingCount > 0);

    // 如果没有可用奖品，返回 null
    if (availablePrizes.length === 0) {
      return null;
    }

    // 计算总权重（所有可用奖品的剩余数量之和）
    const totalWeight = availablePrizes.reduce(
      (sum, prize) => sum + prize.remainingCount,
      0
    );

    // 生成 0 到总权重之间的随机数
    const randomValue = Math.random() * totalWeight;

    // 使用加权随机算法选择奖品
    let cumulativeWeight = 0;
    let selectedPrize: Prize | null = null;

    for (const prize of availablePrizes) {
      cumulativeWeight += prize.remainingCount;
      if (randomValue < cumulativeWeight) {
        selectedPrize = prize;
        break;
      }
    }

    // 如果由于浮点数精度问题没有选中奖品，选择最后一个可用奖品
    if (selectedPrize === null) {
      selectedPrize = availablePrizes[availablePrizes.length - 1];
    }

    // 减少选中奖品的剩余数量
    selectedPrize.remainingCount -= 1;

    return selectedPrize;
  }

  /**
   * 检查是否还有可抽取的奖品
   * 
   * 遍历所有奖品，检查是否至少有一个奖品的剩余数量大于 0
   * 
   * @returns 如果有可抽取的奖品返回 true，否则返回 false
   * 
   * 验证需求：2.3, 2.4
   */
  hasAvailablePrizes(): boolean {
    return this.prizes.some(prize => prize.remainingCount > 0);
  }

  /**
   * 减少奖品数量
   * 
   * 将指定奖品的剩余数量减 1
   * 
   * @param prizeId - 奖品 ID
   * @throws Error 当奖品不存在或剩余数量已为 0 时
   * 
   * 验证需求：2.2
   */
  decrementPrize(prizeId: string): void {
    // 验证奖品 ID
    if (typeof prizeId !== 'string' || prizeId.trim().length === 0) {
      throw new Error('Prize ID must be a non-empty string');
    }

    // 查找奖品
    const prize = this.prizes.find(p => p.id === prizeId);
    if (!prize) {
      throw new Error(`Prize with ID ${prizeId} not found`);
    }

    // 检查剩余数量
    if (prize.remainingCount <= 0) {
      throw new Error(`Prize ${prize.name} has no remaining count`);
    }

    // 减少剩余数量
    prize.remainingCount -= 1;
  }

  /**
   * 重置所有奖品到初始状态
   * 
   * 将所有奖品的剩余数量恢复为初始总数量
   * 
   * @returns void
   * 
   * 验证需求：5.3, 5.4
   */
  reset(): void {
    // 遍历所有奖品，将剩余数量重置为总数量
    for (const prize of this.prizes) {
      prize.remainingCount = prize.totalCount;
    }
  }

  /**
   * 获取所有奖品
   * 
   * 返回所有奖品的列表（用于测试和调试）
   * 
   * @returns 所有奖品的数组副本
   */
  getAllPrizes(): Prize[] {
    return [...this.prizes];
  }

  /**
   * 设置奖品列表
   * 
   * 替换当前的奖品列表（用于测试和状态管理）
   * 
   * @param prizes - 新的奖品列表
   */
  setPrizes(prizes: Prize[]): void {
    this.prizes = prizes;
  }
}
