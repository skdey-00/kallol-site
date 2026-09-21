/**
 * MetaList, definition-list metadata set (Phase 6).
 *
 * The Phase 5B Visit-section treatment: small uppercase tracked
 * terms with body values, address, phone, email, timings. Sets
 * practical facts quietly, <dl> semantics included.
 */

export interface MetaItem {
  term: string
  /** Pass a node when the value contains a link; plain string otherwise */
  value: React.ReactNode
}

export function MetaList({
  items,
  className,
}: {
  items: MetaItem[]
  className?: string
}) {
  return (
    <dl className={`space-y-5 ${className ?? ""}`}>
      {items.map((item) => (
        <div key={item.term}>
          <dt className="meta-label">{item.term}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-ink-soft">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
