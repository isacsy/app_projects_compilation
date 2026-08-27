import Divider from '../decorative/Divider'

export default function Footer() {
  return (
    <footer className="mx-auto mt-16 max-w-6xl px-4 pb-10 sm:px-6">
      <Divider className="mb-6 max-w-md mx-auto" />
      <p
        className="text-center text-xs uppercase tracking-[0.25em]"
        style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-heading)', opacity: 0.7 }}
      >
        Glamouria Studio &middot; A Learning Companion for an Original Tarot Deck
      </p>
    </footer>
  )
}
