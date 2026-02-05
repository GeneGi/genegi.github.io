# 项目搭建文档

## 完成的任务

### 1. 项目初始化
- ✅ 使用 Vite 创建 React + TypeScript 项目
- ✅ 项目名称: spring-festival-lottery
- ✅ 模板: react-ts

### 2. TypeScript 配置
- ✅ 配置了严格的 TypeScript 编译选项
- ✅ 启用了以下特性:
  - strict mode
  - noUnusedLocals
  - noUnusedParameters
  - noFallthroughCasesInSwitch
  - forceConsistentCasingInFileNames
  - resolveJsonModule
  - esModuleInterop
- ✅ 添加了 vitest/globals 类型支持

### 3. 项目目录结构
```
spring-festival-lottery/
├── src/
│   ├── components/      # React 组件目录
│   │   └── index.ts     # 组件导出文件
│   ├── services/        # 业务逻辑服务目录
│   │   └── index.ts     # 服务导出文件
│   ├── types/           # TypeScript 类型定义目录
│   │   └── index.ts     # 类型导出文件
│   ├── utils/           # 工具函数目录
│   │   ├── index.ts     # 工具导出文件
│   │   └── example.test.ts  # 测试验证文件
│   ├── assets/          # 静态资源目录
│   ├── App.tsx          # 主应用组件
│   ├── App.css          # 应用样式
│   ├── main.tsx         # 应用入口
│   └── index.css        # 全局样式
├── public/              # 公共资源目录
├── node_modules/        # 依赖包目录
├── package.json         # 项目配置文件
├── tsconfig.json        # TypeScript 配置
├── tsconfig.app.json    # 应用 TypeScript 配置
├── tsconfig.node.json   # Node TypeScript 配置
├── vite.config.ts       # Vite 配置
├── vitest.config.ts     # Vitest 配置
├── eslint.config.js     # ESLint 配置
├── README.md            # 项目说明文档
└── PROJECT_SETUP.md     # 本文档
```

### 4. 依赖安装

#### 生产依赖
- react: ^19.2.0
- react-dom: ^19.2.0

#### 开发依赖
- vite: ^7.2.4 (构建工具)
- typescript: ~5.9.3 (TypeScript 编译器)
- @vitejs/plugin-react: ^5.1.1 (React 插件)
- vitest: ^3.2.4 (测试框架)
- fast-check: ^4.5.3 (属性测试库)
- @vitest/ui: ^3.2.4 (测试 UI)
- jsdom: ^26.0.0 (DOM 环境模拟)
- eslint: ^9.39.1 (代码检查)
- @types/react: ^19.2.5 (React 类型定义)
- @types/react-dom: ^19.2.3 (React DOM 类型定义)
- @types/node: ^24.10.1 (Node 类型定义)

### 5. 测试配置

#### Vitest 配置 (vitest.config.ts)
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

#### 测试脚本
- `npm test`: 运行测试（监听模式）
- `npm run test:ui`: 运行测试并显示 UI
- `npm run test:run`: 运行测试一次（CI 模式）

#### 测试验证
创建了示例测试文件 `src/utils/example.test.ts`，包含：
- 基本单元测试
- 基于属性的测试（使用 fast-check）

测试结果：
```
✓ src/utils/example.test.ts (2 tests) 3ms
  ✓ Setup Verification > should run basic unit tests 1ms
  ✓ Setup Verification > should run property-based tests with fast-check 2ms

Test Files  1 passed (1)
     Tests  2 passed (2)
```

### 6. 开发脚本
- `npm run dev`: 启动开发服务器
- `npm run build`: 构建生产版本
- `npm run lint`: 运行代码检查
- `npm run preview`: 预览生产构建

## 注意事项

### Node.js 版本
- 当前使用: Node.js v18.20.8
- Vite 7 要求: Node.js 20.19+ 或 22.12+
- 影响: 生产构建可能有问题，但开发服务器和测试正常工作
- 建议: 在生产部署前升级 Node.js 版本

### 下一步工作
根据任务列表，下一个任务是：
- 任务 2: 实现数据模型和类型定义
  - 2.1 创建 TypeScript 接口定义
  - 2.2 为数据模型编写属性测试

## 验证清单
- ✅ 项目成功创建
- ✅ TypeScript 配置完成
- ✅ 目录结构创建完成
- ✅ 测试库安装成功
- ✅ 测试配置完成
- ✅ 示例测试通过
- ✅ 开发服务器可以启动
- ⚠️ 生产构建需要升级 Node.js 版本

## 总结
项目基础结构已成功搭建，所有必要的依赖已安装，测试框架已配置并验证通过。项目已准备好进行下一阶段的开发工作。
