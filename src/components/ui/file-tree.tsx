// Simplified from Magic UI File Tree (MIT): Radix owns folder disclosure.
import { Accordion as Primitive } from "radix-ui";
import { ChevronRight, FileText, FolderOpen } from "lucide-react";

export function FileTree({
  name,
  files,
  empty = "还没有页面文件。先说清需求，再生成代码。",
}: {
  name: string;
  files: { name: string; note: string }[];
  empty?: string;
}) {
  return (
    <Primitive.Root
      type="single"
      collapsible
      defaultValue="project"
      className="file-tree"
    >
      <Primitive.Item value="project">
        <Primitive.Header>
          <Primitive.Trigger className="file-tree-folder">
            <ChevronRight size={13} />
            <FolderOpen size={15} />
            {name}
          </Primitive.Trigger>
        </Primitive.Header>
        <Primitive.Content className="file-tree-content">
          {files.length ? (
            <ul>
              {files.map((file) => (
                <li key={file.name}>
                  {file.name.endsWith("/") ? (
                    <FolderOpen size={14} />
                  ) : (
                    <FileText size={14} />
                  )}
                  <span>
                    {file.name}
                    <small>{file.note}</small>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>{empty}</p>
          )}
        </Primitive.Content>
      </Primitive.Item>
    </Primitive.Root>
  );
}
