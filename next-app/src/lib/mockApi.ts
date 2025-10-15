type FetchParams = { q?: string; page?: number; limit?: number }

const ALL = Array.from({ length: 57 }).map((_, i) => ({
  id: String(i + 1),
  code: `SKU-${String(i + 1).padStart(4, '0')}`,
  name: `サンプル品目 ${i + 1}`,
  category: i % 3 === 0 ? '金具' : i % 3 === 1 ? '電子部品' : '消耗品',
  qty: Math.floor(Math.random() * 500)
}))

export async function fetchItems({ q = '', page = 1, limit = 10 }: FetchParams) {
  // naive filter
  let list = ALL.filter(i => i.code.includes(q) || i.name.includes(q))
  const total = list.length
  const start = (page - 1) * limit
  const items = list.slice(start, start + limit)
  // simulate network
  await new Promise(res => setTimeout(res, 120))
  return { items, total }
}
