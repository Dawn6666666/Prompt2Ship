# Third-party notices

本项目以本地组件库中的成熟实现为基础进行适配，未引入真实 AI 服务或复制 Todo 上游完整项目。

## 组件来源

| 来源                  | 上游                                            | 本项目中的适配                                                                                                                                                                                                            |
| --------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Astro shadcn template | https://github.com/AREA44/astro-shadcn-template | `src/components/Header.tsx`、`src/layouts/Layout.astro`：导航、React island 与主题切换模式                                                                                                                                |
| Magic UI              | https://github.com/magicuidesign/magicui        | `src/components/ui/browser.tsx`：Safari 浏览器外壳适配为 iframe；`code-comparison.tsx`：前后代码面板；`terminal.tsx`：Motion 终端分行动效；`typing-animation.tsx`：单次流式打字，适配完成回调、自动滚动与减少动态效果偏好 |
| shadcn/ui             | https://github.com/shadcn-ui/ui                 | `src/components/ui/tabs.tsx`、`accordion.tsx`：基于 Radix 的标签与折叠面板；`textarea.tsx`：提示词输入框                                                                                                                  |

相关本地来源分别位于 `../FrontendFramework/astro-shadcn-template`、`../FrontendFramework/magicui`、`../FrontendFramework/shadcn-ui`。代码高亮改为 Shiki 构建时生成；浏览器外壳使用可交互 HTML 预览；没有照搬与本站无关的整套示例。

## MIT notices

以上三个来源均使用 MIT License，分别保留其版权声明：

```text
Astro shadcn template:
Copyright (c) 2023-present AREA44

Magic UI:
Copyright (c) Magic UI

shadcn/ui:
Copyright (c) 2023 shadcn

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Todo 教学参考

- 原始项目：https://github.com/Baoxd123/todo-app
- 本地参考：`../FrontendFramework/todo-app`，提交 `a5a648a`。
- 核对日期：2026-10-19。上游未提供 LICENSE，不应将公开可见误认为可任意再分发。
- 本站引用项目结构、解释既有数据流并编写局部修改教学，未打包或分发上游完整源码。实际使用该上游项目时，请自行确认授权条件。

## npm 依赖

Astro、React、Radix UI、Tailwind CSS、Motion、Lucide、Shiki、Inter 等依赖遵循各自随包提供的许可；完整依赖版本由 `package-lock.json` 锁定。
