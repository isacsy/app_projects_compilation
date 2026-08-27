import CornerFloret from './CornerFloret'

/**
 * Wraps children in a thin double-line border with Art Nouveau corner
 * florets. Use `as` to change the wrapping element, `tone` to switch the
 * floret palette for use on dark panels.
 */
export default function OrnateFrame({
  children,
  as: Tag = 'div',
  tone = 'gold',
  className = '',
  innerClassName = '',
}) {
  const borderColor = tone === 'gold' ? 'var(--color-gold)' : 'var(--color-ivory)'

  return (
    <Tag className={`relative ${className}`}>
      <div
        className={`relative ${innerClassName}`}
        style={{
          border: `1px solid color-mix(in srgb, ${borderColor} 55%, transparent)`,
          boxShadow: `inset 0 0 0 4px color-mix(in srgb, ${borderColor} 12%, transparent)`,
        }}
      >
        {children}
      </div>
      <CornerFloret tone={tone} className="absolute -top-3 -left-3" />
      <CornerFloret tone={tone} className="absolute -top-3 -right-3 -scale-x-100" />
      <CornerFloret tone={tone} className="absolute -bottom-3 -left-3 -scale-y-100" />
      <CornerFloret tone={tone} className="absolute -bottom-3 -right-3 -scale-x-100 -scale-y-100" />
    </Tag>
  )
}
