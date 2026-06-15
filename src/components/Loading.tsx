export default function Loading({ label = 'Loading' }: { label?: string }) {
  return <p className="notice">{label}…</p>
}
