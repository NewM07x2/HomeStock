type FetchParams = { q?: string; page?: number; limit?: number }

let ALL = Array.from({ length: 57 }).map((_, i) => ({
  id: String(i + 1),
  code: `SKU-${String(i + 1).padStart(4, '0')}`,
  name: `サンプル品目 ${i + 1}`,
  category: i % 3 === 0 ? '金具' : i % 3 === 1 ? '電子部品' : '消耗品',
  qty: Math.floor(Math.random() * 500),
  price: (Math.floor(Math.random() * 10000) + 100) / 100,
  purchase_store: 'サンプル店',
  purchase_date: new Date().toISOString().slice(0,10),
  notes: ''
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

export async function fetchItemById(id: string) {
  await new Promise(res => setTimeout(res, 80))
  const item = ALL.find(i => i.id === id)
  if (!item) throw new Error('not found')
  return item
}

export async function createItem(payload: Partial<any>) {
  const id = String(ALL.length + 1)
  const code = payload.code ?? `SKU-${String(ALL.length + 1).padStart(4,'0')}`
  const newItem = {
    id,
    code,
    name: payload.name ?? '無名',
    category: payload.category ?? '',
    qty: Number(payload.qty ?? 0),
    price: Number(payload.price ?? 0),
    purchase_store: payload.purchase_store ?? '',
    purchase_date: payload.purchase_date ?? null,
    notes: payload.notes ?? ''
  }
  ALL = [newItem, ...ALL]
  await new Promise(res => setTimeout(res, 120))
  return newItem
}
