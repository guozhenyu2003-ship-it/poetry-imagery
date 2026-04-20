export function dashScopeHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}
