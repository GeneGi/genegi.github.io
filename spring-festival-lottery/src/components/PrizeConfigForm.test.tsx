/**
 * 春晚庙会抽奖系统 - 奖品配置表单组件测试
 * 
 * 测试 PrizeConfigForm 组件的功能和验证逻辑
 * 
 * 验证需求：1.1, 1.2, 1.3
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PrizeConfigForm } from './PrizeConfigForm';

describe('PrizeConfigForm', () => {
  describe('渲染测试', () => {
    it('应该渲染所有表单字段', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      // 检查标题
      expect(screen.getByRole('heading', { name: '添加奖品' })).toBeDefined();

      // 检查奖品名称字段
      expect(screen.getByLabelText(/奖品名称/)).toBeDefined();

      // 检查奖品数量字段
      expect(screen.getByLabelText(/奖品数量/)).toBeDefined();

      // 检查奖品描述字段
      expect(screen.getByLabelText(/奖品描述/)).toBeDefined();

      // 检查提交按钮
      expect(screen.getByRole('button', { name: '添加奖品' })).toBeDefined();
    });

    it('应该显示必填标记', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const requiredMarkers = screen.getAllByText('*');
      expect(requiredMarkers.length).toBe(2); // 名称和数量都是必填
    });

    it('应该显示可选标记', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      expect(screen.getByText('(可选)')).toBeDefined();
    });
  });

  describe('输入验证 - 奖品名称', () => {
    it('应该拒绝空的奖品名称', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const countInput = screen.getByLabelText(/奖品数量/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      // 只填写数量，不填写名称
      fireEvent.change(countInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      // 应该显示错误信息
      expect(screen.getByText('奖品名称不能为空')).toBeDefined();

      // 不应该调用回调函数
      expect(mockOnAddPrize).not.toHaveBeenCalled();
    });

    it('应该拒绝只包含空格的奖品名称', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      fireEvent.change(nameInput, { target: { value: '   ' } });
      fireEvent.change(countInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      expect(screen.getByText('奖品名称不能为空')).toBeDefined();
      expect(mockOnAddPrize).not.toHaveBeenCalled();
    });

    it('应该拒绝超过50个字符的奖品名称', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      const longName = 'a'.repeat(51);
      fireEvent.change(nameInput, { target: { value: longName } });
      fireEvent.change(countInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      expect(screen.getByText('奖品名称不能超过50个字符')).toBeDefined();
      expect(mockOnAddPrize).not.toHaveBeenCalled();
    });

    it('应该接受有效的奖品名称', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.change(countInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      expect(mockOnAddPrize).toHaveBeenCalledWith('一等奖', 10, undefined);
    });
  });

  describe('输入验证 - 奖品数量 (需求 1.3)', () => {
    it('应该拒绝空的奖品数量', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.click(submitButton);

      expect(screen.getByText('奖品数量不能为空')).toBeDefined();
      expect(mockOnAddPrize).not.toHaveBeenCalled();
    });

    it('应该拒绝非数字的奖品数量', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      // HTML number input 会将非数字值转换为空字符串
      fireEvent.change(countInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      expect(screen.getByText('奖品数量不能为空')).toBeDefined();
      expect(mockOnAddPrize).not.toHaveBeenCalled();
    });

    it('应该拒绝小数的奖品数量', async () => {
      const mockOnAddPrize = vi.fn();
      const { container } = render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const form = container.querySelector('form')!;

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.change(countInput, { target: { value: '10.5' } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('奖品数量必须是整数')).toBeDefined();
      });
      expect(mockOnAddPrize).not.toHaveBeenCalled();
    });

    it('应该拒绝零作为奖品数量', async () => {
      const mockOnAddPrize = vi.fn();
      const { container } = render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const form = container.querySelector('form')!;

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.change(countInput, { target: { value: '0' } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('奖品数量必须大于0')).toBeDefined();
      });
      expect(mockOnAddPrize).not.toHaveBeenCalled();
    });

    it('应该拒绝负数作为奖品数量', async () => {
      const mockOnAddPrize = vi.fn();
      const { container } = render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const form = container.querySelector('form')!;

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.change(countInput, { target: { value: '-5' } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('奖品数量必须大于0')).toBeDefined();
      });
      expect(mockOnAddPrize).not.toHaveBeenCalled();
    });

    it('应该拒绝超过10000的奖品数量', async () => {
      const mockOnAddPrize = vi.fn();
      const { container } = render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const form = container.querySelector('form')!;

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.change(countInput, { target: { value: '10001' } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('奖品数量不能超过10000')).toBeDefined();
      });
      expect(mockOnAddPrize).not.toHaveBeenCalled();
    });

    it('应该接受有效的正整数作为奖品数量', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.change(countInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      expect(mockOnAddPrize).toHaveBeenCalledWith('一等奖', 10, undefined);
    });

    it('应该接受边界值1作为奖品数量', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.change(countInput, { target: { value: '1' } });
      fireEvent.click(submitButton);

      expect(mockOnAddPrize).toHaveBeenCalledWith('一等奖', 1, undefined);
    });

    it('应该接受边界值10000作为奖品数量', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.change(countInput, { target: { value: '10000' } });
      fireEvent.click(submitButton);

      expect(mockOnAddPrize).toHaveBeenCalledWith('一等奖', 10000, undefined);
    });
  });

  describe('奖品描述（可选）', () => {
    it('应该允许不填写奖品描述', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.change(countInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      expect(mockOnAddPrize).toHaveBeenCalledWith('一等奖', 10, undefined);
    });

    it('应该接受有效的奖品描述', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const descriptionInput = screen.getByLabelText(/奖品描述/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.change(countInput, { target: { value: '10' } });
      fireEvent.change(descriptionInput, { target: { value: 'iPhone 15 Pro' } });
      fireEvent.click(submitButton);

      expect(mockOnAddPrize).toHaveBeenCalledWith('一等奖', 10, 'iPhone 15 Pro');
    });

    it('应该忽略只包含空格的描述', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const descriptionInput = screen.getByLabelText(/奖品描述/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.change(countInput, { target: { value: '10' } });
      fireEvent.change(descriptionInput, { target: { value: '   ' } });
      fireEvent.click(submitButton);

      expect(mockOnAddPrize).toHaveBeenCalledWith('一等奖', 10, undefined);
    });
  });

  describe('表单提交和重置', () => {
    it('成功提交后应该清空表单', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/) as HTMLInputElement;
      const countInput = screen.getByLabelText(/奖品数量/) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(/奖品描述/) as HTMLTextAreaElement;
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.change(countInput, { target: { value: '10' } });
      fireEvent.change(descriptionInput, { target: { value: 'iPhone 15 Pro' } });
      fireEvent.click(submitButton);

      // 检查表单是否被清空
      expect(nameInput.value).toBe('');
      expect(countInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });

    it('应该修剪名称和描述的前后空格', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const descriptionInput = screen.getByLabelText(/奖品描述/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      fireEvent.change(nameInput, { target: { value: '  一等奖  ' } });
      fireEvent.change(countInput, { target: { value: '10' } });
      fireEvent.change(descriptionInput, { target: { value: '  iPhone 15 Pro  ' } });
      fireEvent.click(submitButton);

      expect(mockOnAddPrize).toHaveBeenCalledWith('一等奖', 10, 'iPhone 15 Pro');
    });
  });

  describe('实时错误清除', () => {
    it('当用户修改名称时应该清除名称错误', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      // 先触发错误
      fireEvent.change(countInput, { target: { value: '10' } });
      fireEvent.click(submitButton);
      expect(screen.getByText('奖品名称不能为空')).toBeDefined();

      // 修改名称应该清除错误
      fireEvent.change(nameInput, { target: { value: '一' } });
      expect(screen.queryByText('奖品名称不能为空')).toBeNull();
    });

    it('当用户修改数量时应该清除数量错误', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const nameInput = screen.getByLabelText(/奖品名称/);
      const countInput = screen.getByLabelText(/奖品数量/);
      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      // 先触发错误
      fireEvent.change(nameInput, { target: { value: '一等奖' } });
      fireEvent.click(submitButton);
      expect(screen.getByText('奖品数量不能为空')).toBeDefined();

      // 修改数量应该清除错误
      fireEvent.change(countInput, { target: { value: '1' } });
      expect(screen.queryByText('奖品数量不能为空')).toBeNull();
    });
  });

  describe('边界情况', () => {
    it('应该处理同时存在多个错误的情况', () => {
      const mockOnAddPrize = vi.fn();
      render(<PrizeConfigForm onAddPrize={mockOnAddPrize} />);

      const submitButton = screen.getByRole('button', { name: '添加奖品' });

      // 不填写任何内容直接提交
      fireEvent.click(submitButton);

      // 应该同时显示两个错误
      expect(screen.getByText('奖品名称不能为空')).toBeDefined();
      expect(screen.getByText('奖品数量不能为空')).toBeDefined();

      // 不应该调用回调函数
      expect(mockOnAddPrize).not.toHaveBeenCalled();
    });
  });
});
