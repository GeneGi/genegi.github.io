/**
 * 春晚庙会抽奖系统 - 奖品管理器
 * 
 * 负责奖品的增删改查操作
 * 
 * 验证需求：1.1, 1.2, 1.4
 */

import type { Prize } from '../types';

/**
 * 奖品管理器类
 * 
 * 提供奖品的添加、更新、删除和查询功能
 * 包含输入验证和唯一 ID 生成
 */
export class PrizeManager {
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
   * 添加新奖品
   * 
   * 生成唯一 ID，验证输入，并将奖品添加到列表中
   * 
   * @param name - 奖品名称
   * @param count - 奖品数量
   * @param description - 奖品描述（可选）
   * @returns 新创建的奖品对象
   * @throws Error 当输入无效时
   * 
   * 验证需求：1.1, 1.2
   */
  addPrize(name: string, count: number, description?: string): Prize {
    // 验证奖品名称
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Prize name must be a non-empty string');
    }

    if (name.trim().length > 50) {
      throw new Error('Prize name must not exceed 50 characters');
    }

    // 验证奖品数量
    if (typeof count !== 'number') {
      throw new Error('Prize count must be a number');
    }

    if (!Number.isInteger(count)) {
      throw new Error('Prize count must be an integer');
    }

    if (count <= 0) {
      throw new Error('Prize count must be a positive integer');
    }

    if (count > 10000) {
      throw new Error('Prize count must not exceed 10000');
    }

    // 验证描述（如果提供）
    if (description !== undefined && typeof description !== 'string') {
      throw new Error('Prize description must be a string');
    }

    // 生成唯一 ID（使用时间戳 + 随机数）
    const id = this.generateUniqueId();

    // 创建新奖品对象
    const newPrize: Prize = {
      id,
      name: name.trim(),
      totalCount: count,
      remainingCount: count,
      description: description?.trim(),
    };

    // 添加到奖品列表
    this.prizes.push(newPrize);

    return newPrize;
  }

  /**
   * 更新奖品数量
   * 
   * 更新指定奖品的剩余数量
   * 
   * @param prizeId - 奖品 ID
   * @param newCount - 新的数量
   * @throws Error 当奖品不存在或数量无效时
   * 
   * 验证需求：1.4
   */
  updatePrizeCount(prizeId: string, newCount: number): void {
    // 验证奖品 ID
    if (typeof prizeId !== 'string' || prizeId.trim().length === 0) {
      throw new Error('Prize ID must be a non-empty string');
    }

    // 查找奖品
    const prize = this.prizes.find(p => p.id === prizeId);
    if (!prize) {
      throw new Error(`Prize with ID ${prizeId} not found`);
    }

    // 验证新数量
    if (typeof newCount !== 'number') {
      throw new Error('Prize count must be a number');
    }

    if (!Number.isInteger(newCount)) {
      throw new Error('Prize count must be an integer');
    }

    if (newCount < 0) {
      throw new Error('Prize count must be non-negative');
    }

    if (newCount > 10000) {
      throw new Error('Prize count must not exceed 10000');
    }

    // 更新剩余数量
    prize.remainingCount = newCount;
  }

  /**
   * 删除奖品
   * 
   * 从列表中删除指定的奖品
   * 
   * @param prizeId - 奖品 ID
   * @throws Error 当奖品不存在时
   * 
   * 验证需求：1.1
   */
  removePrize(prizeId: string): void {
    // 验证奖品 ID
    if (typeof prizeId !== 'string' || prizeId.trim().length === 0) {
      throw new Error('Prize ID must be a non-empty string');
    }

    // 查找奖品索引
    const index = this.prizes.findIndex(p => p.id === prizeId);
    if (index === -1) {
      throw new Error(`Prize with ID ${prizeId} not found`);
    }

    // 删除奖品
    this.prizes.splice(index, 1);
  }

  /**
   * 获取所有奖品
   * 
   * 返回所有奖品的列表（包括剩余数量为 0 的奖品）
   * 
   * @returns 所有奖品的数组副本
   * 
   * 验证需求：1.5
   */
  getAllPrizes(): Prize[] {
    // 返回数组的副本，避免外部修改内部状态
    return [...this.prizes];
  }

  /**
   * 获取可抽取的奖品
   * 
   * 返回剩余数量大于 0 的奖品列表
   * 
   * @returns 可抽取奖品的数组
   * 
   * 验证需求：2.3
   */
  getAvailablePrizes(): Prize[] {
    return this.prizes.filter(prize => prize.remainingCount > 0);
  }

  /**
   * 生成唯一 ID
   * 
   * 使用时间戳和随机数生成唯一标识符
   * 格式：prize-{timestamp}-{random}
   * 
   * @returns 唯一的奖品 ID
   * @private
   */
  private generateUniqueId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `prize-${timestamp}-${random}`;
  }
}
