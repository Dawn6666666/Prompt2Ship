export const todoBaseline = "a5a648a426d46f1576caf920d40c738455023e7e";
export const todoCommands = {
  prepare: `git clone https://github.com/Baoxd123/todo-app.git todo-app-p2s
cd todo-app-p2s
git switch --detach ${todoBaseline}
git switch -c learn/task-notes
git rev-parse HEAD
git status --short
npm ci`,
  backend: "npm start --workspace=todo-server",
  frontend: "npm run dev --workspace=todo-client",
  patch:
    "git apply --check todo-notes.patch\ngit apply todo-notes.patch\ngit diff --stat",
  verify:
    "git diff --check\ngit diff -- server/db.js server/routes/todos.js client/src/components/TodoForm.jsx client/src/components/TodoItem.jsx\nnpm run build --workspace=todo-client",
  commit:
    'git add server/db.js server/routes/todos.js client/src/components/TodoForm.jsx client/src/components/TodoItem.jsx\ngit diff --staged\ngit commit -m "feat: add task notes"',
};
