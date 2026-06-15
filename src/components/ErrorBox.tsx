export default function ErrorBox({ message }: { message: string }) {
  return <p className="notice error">{message}</p>
}
