"use client"

import { Virtuoso } from "react-virtuoso"

export default function Example() {
  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`)

  return (
    <Virtuoso
      style={{ height: 400 }}
      data={items}
      itemContent={(index, item) => (
        <div className="p-2 border-b">
          {item}
        </div>
      )}
    />
  )
}