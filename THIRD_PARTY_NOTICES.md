# Third-party notices

本项目以本地组件库中的成熟实现为基础进行适配，未引入真实 AI 服务或复制 Todo 上游完整项目。

## 组件来源

| 来源                  | 上游                                            | 本项目中的适配                                                                                                                                      |
| --------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Astro shadcn template | https://github.com/AREA44/astro-shadcn-template | `src/components/Header.tsx`、`src/layouts/Layout.astro`：导航、React island 与主题切换模式                                                          |
| Magic UI              | https://github.com/magicuidesign/magicui        | `src/components/dynamics/PortfolioPreview.tsx`：Safari 外壳参考与实际 iframe；`ui/code-comparison.tsx`：前后代码面板，扩展统一差异视图              |
| shadcn/ui             | https://github.com/shadcn-ui/ui                 | `src/components/ui/tabs.tsx`、`slider.tsx`：Radix 标签与视口滑杆；`dynamics/ReferenceImage.tsx`：参考本地 Dialog 的组合方式，提供图片放大与键盘操作 |
| Astro Starlight       | https://github.com/withastro/starlight          | 文档布局、搜索、章节导航、MDX 与 Expressive Code，通过依赖集成                                                                                      |
| Motion                | https://github.com/motiondivision/motion        | 参考本地 tab-select 的共享布局状态指示；使用 Motion React 的过渡与减少动态效果支持                                                                  |

相关本地来源分别位于 `../FrontendFramework/astro-shadcn-template`、`../FrontendFramework/magicui`、`../FrontendFramework/shadcn-ui`。代码高亮改为 Shiki 构建时生成；浏览器外壳使用可交互 HTML 预览；没有照搬与本站无关的整套示例。

## MIT notices

旧版未使用的聊天回放、Resizable 与流式打字组件已移除。未引入 React Bits 或 Origin UI 源码；本轮重点采用文档、标签、滑杆和状态过渡。

以下直接适配的三个来源使用 MIT License，分别保留其版权声明；其他依赖的许可随包提供：

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
- 核对日期：2026-10-20。上游 README 的 License 部分声明 MIT，仓库未提供独立 LICENSE 文件。
- 本站引用项目结构、解释数据流并编写局部修改教学，提供本次修改的补丁与验证脚本，未打包上游完整源码。

## npm 依赖

Astro、React、Radix UI、Tailwind CSS、Motion、Lucide、Shiki、Inter 等依赖遵循各自随包提供的许可；完整依赖版本由 `package-lock.json` 锁定。

## VS Code 真实界面参考

- `public/images/vscode/workbench.png`：Microsoft，[VS Code User Interface](https://code.visualstudio.com/docs/getstarted/userinterface)，原图未修改。
- `public/images/vscode/open-terminal.png`：Microsoft，[Terminal Getting Started](https://code.visualstudio.com/docs/terminal/getting-started)，原图未修改。
- 上述文档图片遵循 vscode-docs 的 [Creative Commons Attribution 3.0 United States](https://github.com/microsoft/vscode-docs/blob/main/LICENSE.md) 许可，版权归 Microsoft Corporation；页面放大仅改变显示比例。
- `public/images/vscode/download.png`：2026-10-20 对 [VS Code 官方下载页](https://code.visualstudio.com/download) 的参考截图，仅用于解释系统与芯片选择。商标与产品界面权利归各自所有者。
- `public/examples/todo-browser-verified.png`：本站验证脚本在 Todo 临时副本运行后生成的界面截图，只包含测试数据。
