// functions/api/[[path]].js
export async function onRequest(context) {
  const { request, params } = context;
  const path = params.path || '';
  
  const targetUrl = `https://user-mgmt.2791389901.workers.dev/${path}`;
  
  // 获取请求体（PUT/POST 需要转发 body）
  let body = null;
  if (request.method === 'PUT' || request.method === 'POST') {
    body = await request.arrayBuffer();
  }

  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: body,
  });

  return await fetch(newRequest);
}