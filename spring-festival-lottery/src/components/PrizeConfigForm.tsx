/**
 * 春晚庙会抽奖系统 - 奖品配置表单组件
 * 
 * 提供奖品配置界面，允许管理员添加新奖品
 * 
 * 验证需求：1.1, 1.2, 1.3
 */

import { useState, type FormEvent } from 'react';
import './PrizeConfigForm.css';

/**
 * PrizeConfigForm 组件的属性接口
 */
export interface PrizeConfigFormProps {
  /**
   * 添加奖品的回调函数
   * @param name - 奖品名称
   * @param count - 奖品数量
   * @param description - 奖品描述（可选）
   */
  onAddPrize: (name: string, count: number, description?: string) => void;
}

/**
 * 表单错误状态接口
 */
interface FormErrors {
  name?: string;
  count?: string;
}

/**
 * PrizeConfigForm 组件
 * 
 * 提供输入框用于配置奖品信息：
 * - 奖品名称（必填）
 * - 奖品数量（必填，正整数）
 * - 奖品描述（可选）
 * 
 * 包含输入验证和错误提示功能
 */
export function PrizeConfigForm({ onAddPrize }: PrizeConfigFormProps) {
  // 表单状态
  const [name, setName] = useState('');
  const [count, setCount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * 验证奖品名称
   * 需求 1.2: 要求输入奖项名称
   */
  const validateName = (value: string): string | undefined => {
    if (!value.trim()) {
      return '奖品名称不能为空';
    }
    if (value.length > 50) {
      return '奖品名称不能超过50个字符';
    }
    return undefined;
  };

  /**
   * 验证奖品数量
   * 需求 1.3: 验证奖品数量为正整数
   */
  const validateCount = (value: string): string | undefined => {
    if (!value.trim()) {
      return '奖品数量不能为空';
    }

    const numValue = Number(value);

    // 检查是否为有效数字
    if (isNaN(numValue)) {
      return '奖品数量必须是数字';
    }

    // 检查是否为整数
    if (!Number.isInteger(numValue)) {
      return '奖品数量必须是整数';
    }

    // 检查是否为正数
    if (numValue <= 0) {
      return '奖品数量必须大于0';
    }

    // 检查范围
    if (numValue > 10000) {
      return '奖品数量不能超过10000';
    }

    return undefined;
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 验证所有字段
    const nameError = validateName(name);
    const countError = validateCount(count);

    // 如果有错误，显示错误信息并阻止提交
    if (nameError || countError) {
      setErrors({
        name: nameError,
        count: countError,
      });
      return;
    }

    // 清除错误
    setErrors({});

    // 调用回调函数添加奖品
    onAddPrize(
      name.trim(),
      Number(count),
      description.trim() || undefined
    );

    // 清空表单
    setName('');
    setCount('');
    setDescription('');
  };

  /**
   * 处理名称输入变化
   */
  const handleNameChange = (value: string) => {
    setName(value);
    // 实时清除错误
    if (errors.name) {
      setErrors({ ...errors, name: undefined });
    }
  };

  /**
   * 处理数量输入变化
   */
  const handleCountChange = (value: string) => {
    setCount(value);
    // 实时清除错误
    if (errors.count) {
      setErrors({ ...errors, count: undefined });
    }
  };

  return (
    <form className="prize-config-form" onSubmit={handleSubmit}>
      <h2 className="form-title">添加奖品</h2>

      <div className="form-group">
        <label htmlFor="prize-name" className="form-label">
          奖品名称 <span className="required">*</span>
        </label>
        <input
          id="prize-name"
          type="text"
          className={`form-input ${errors.name ? 'error' : ''}`}
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="例如：一等奖"
          maxLength={50}
        />
        {errors.name && (
          <span className="error-message">{errors.name}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="prize-count" className="form-label">
          奖品数量 <span className="required">*</span>
        </label>
        <input
          id="prize-count"
          type="number"
          className={`form-input ${errors.count ? 'error' : ''}`}
          value={count}
          onChange={(e) => handleCountChange(e.target.value)}
          placeholder="例如：10"
          min="1"
          max="10000"
        />
        {errors.count && (
          <span className="error-message">{errors.count}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="prize-description" className="form-label">
          奖品描述 <span className="optional">(可选)</span>
        </label>
        <textarea
          id="prize-description"
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="例如：iPhone 15 Pro"
          rows={3}
          maxLength={200}
        />
      </div>

      <button type="submit" className="submit-button">
        添加奖品
      </button>
    </form>
  );
}
