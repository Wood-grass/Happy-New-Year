# 1Panel 部署指南

本指南将帮助你将项目部署到 1Panel 面板。本项目包含前端（Vite + React）和后端（Node.js + Express + TypeScript）。

## 准备工作

1.  **服务器**: 安装了 1Panel 的 Linux 服务器。
2.  **1Panel 应用**:
    *   **OpenResty** (用于托管前端和反向代理)
    *   **Node.js** (用于运行后端服务)

---

## 第一步：后端部署 (Node.js)

我们需要先运行后端服务，以便前端可以通过 API 访问。

### 1. 准备后端代码
由于后端是 TypeScript 编写的，我们可以直接使用 `tsx` 运行，或者编译后运行。为简单起见，建议直接使用 `tsx`。

在你的本地项目中，修改 `package.json`，添加一个 `start` 脚本：
```json
"scripts": {
  ...
  "start": "tsx api/server.ts"
}
```

### 2. 在 1Panel 创建运行环境
1.  进入 1Panel -> **网站** -> **运行环境** -> **Node.js**。
2.  点击 **创建运行环境**。
    *   **名称**: `project-backend` (或自定义)
    *   **Node 版本**: 选择 `v18` 或更高 (建议 LTS)。
    *   **包管理器**: `npm` 或 `pnpm` (本项目有 package-lock.json，建议用 npm)。

### 3. 上传代码
1.  进入 1Panel -> **文件**。
2.  创建一个目录，例如 `/opt/1panel/apps/project-backend`。
3.  将本地项目的所有文件（**除了** `node_modules` 和 `dist`）上传到该目录。
    *   重点上传: `api/`, `package.json`, `package-lock.json`, `tsconfig.json`, `.env`。

### 4. 配置环境变量
编辑服务器上的 `.env` 文件，确保包含以下内容：
```env
# 你的 Supabase URL
VITE_SUPABASE_URL=https://your-project.supabase.co
# 你的 Supabase Anon Key
VITE_SUPABASE_ANON_KEY=your-anon-key
# 你的 Supabase Service Role Key (后端需要)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# 后端运行端口 (建议设置为 3001，与前端代理一致，或者记住你设置的端口)
PORT=3001
```

### 5. 创建并启动网站 (后端服务)
1.  进入 1Panel -> **网站** -> **运行环境** -> **Node.js**。
2.  点击 **添加项目** (或在刚才创建的环境中添加)。
    *   **名称**: `project-api`
    *   **运行环境**: 选择刚才创建的 `project-backend`。
    *   **项目目录**: 选择你上传代码的目录 (`/opt/1panel/apps/project-backend`)。
    *   **启动脚本**: `npm run start` (如果你添加了 start 脚本) 或者 `npx tsx api/server.ts`。
    *   **端口**: `3001` (必须与 `.env` 中的 PORT 一致)。
3.  点击 **确认**。
4.  等待项目启动，查看日志确保显示 "Server ready on port 3001"。

---

## 第二步：前端部署 (静态网站)

### 1. 本地构建
在本地终端运行以下命令生成构建产物：
```bash
npm run build
```
这将生成一个 `dist` 目录。

### 2. 创建静态网站
1.  进入 1Panel -> **网站** -> **网站**。
2.  点击 **创建网站**。
    *   **类型**: `静态网站`
    *   **主域名**: 你的域名 (例如 `example.com`) 或服务器 IP (如果只是测试)。
    *   **代号**: `project-frontend`
3.  点击 **确认**。

### 3. 上传构建文件
1.  进入 **网站** 列表，点击刚才创建的网站的 **根目录** 链接。
2.  进入 `index` 目录 (通常是 `/opt/1panel/apps/openresty/www/sites/project-frontend/index`)。
3.  删除默认的 `index.html`。
4.  将本地 `dist` 目录下的**所有文件**上传到这个目录。

### 4. 配置反向代理 (关键)
为了让前端能访问后端 API，我们需要配置 Nginx 反向代理。

1.  进入 **网站** 列表，点击网站的 **配置**。
2.  进入 **反向代理** 选项卡。
3.  点击 **创建反向代理**。
    *   **名称**: `api`
    *   **代理路径**: `/api`
    *   **代理地址**: `http://127.0.0.1:3001` (这里端口要和后端 PORT 一致)。
4.  点击 **确认**。

### 5. 配置伪静态 (解决路由刷新 404)
由于是单页应用 (SPA)，刷新非首页路径会出现 404，需要配置 Nginx 重写规则。

1.  在网站配置中，进入 **配置文件** 选项卡 (或者 **伪静态** 如果有专用选项)。
2.  在 `server` 块中（通常在 `location / { ... }` 里面或下面），添加以下配置：
    ```nginx
    location / {
        try_files $uri $uri/ /index.html;
    }
    ```
    *注意：如果已有 `location /`，请修改它包含 `try_files`。*
3.  点击 **保存并重载**。

---

## 验证

1.  打开浏览器访问你的域名或 IP。
2.  尝试登录或进行数据交互，确保 API 请求正常 (查看浏览器网络面板，API 请求应为 `http://your-domain/api/...` 并返回 200)。
