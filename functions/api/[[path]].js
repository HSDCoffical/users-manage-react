export async function onRequest(context) {
  const { request, params } = context;
  const path = params.path || '';
  
  // 构建目标 URL（转发到你的 Worker）
  const targetUrl = `https://user-mgmt.2791389901.workers.dev/${path}`;
  
  // 复制请求，但修改 Host 头
  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
  
  // 转发请求
  const response = await fetch(newRequest);
  
  // 返回响应
  return response;
}