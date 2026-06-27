export default function EmptyState({ message, colSpan = 1 }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-muted">{message}</td>
    </tr>
  );
}
