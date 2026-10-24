import { useState } from "react";
import {
  CommandBlock,
  DoneCheck,
  TerminalView,
} from "../../workbench/Primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { useSystem } from "../system/useSystem";
import { SetupStep } from "./SetupStep";
import { SetupWindow } from "./SetupWindow";
import {
  installCopy,
  installHint,
  versionFailure,
  versionFailureFix,
} from "./setupContent";
import { versionCommands, versionOutput } from "../../../data/setup";

export function ToolsSetup() {
  const [system, setSystem] = useSystem();
  const [ran, setRan] = useState(false);

  return (
    <div className="setup-root">
      <SetupWindow
        title="运行与版本工具"
        note="示例输出为预设内容，不会执行命令或修改你的系统。"
        system={system}
        onSystemChange={setSystem}
      >
        <SetupStep index={1} title="安装 Node.js 与 Git">
          <p className="setup-lede">{installCopy[system]}</p>
          <p className="setup-hint">{installHint[system]}</p>
        </SetupStep>

        <SetupStep index={2} title="配置 Git 提交身份">
          <p className="setup-lede">
            在终端执行两条命令，写入提交时使用的名字与邮箱。每台电脑只需一次。
          </p>
          <div className="command-grid">
            <CommandBlock text='git config --global user.name "你的名字"' />
            <CommandBlock text='git config --global user.email "你的邮箱"' />
          </div>
        </SetupStep>

        <SetupStep index={3} title="核对版本输出">
          <p className="setup-lede">逐条执行命令，确认三行版本号都出现。</p>
          <Tabs defaultValue="success" className="setup-tabs">
            <TabsList aria-label="版本命令结果">
              <TabsTrigger value="success">成功示例</TabsTrigger>
              <TabsTrigger value="failure">失败示例</TabsTrigger>
            </TabsList>
            <TabsContent value="success">
              <TerminalView
                folder="my-homepage"
                command={versionCommands[system]}
                output={versionOutput}
                executed={ran}
                onRun={() => setRan(true)}
              />
            </TabsContent>
            <TabsContent value="failure">
              <pre className="response-code">{versionFailure[system]}</pre>
              <p className="notice">{versionFailureFix[system]}</p>
            </TabsContent>
          </Tabs>
        </SetupStep>
      </SetupWindow>

      <DoneCheck
        page="preparation"
        id="tools"
        criteria="本机终端能分别输出版本号，Git 用户名与邮箱已配置。"
        result="示例展示输出格式，版本号以本机为准。"
      />
    </div>
  );
}
