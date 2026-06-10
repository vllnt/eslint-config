type Status = 'active' | 'archived'

interface Item {
  readonly id: string
  readonly status: Status
}

export function findActive(items: readonly Item[]): readonly Item[] {
  return items.filter((item) => item.status === 'active')
}
