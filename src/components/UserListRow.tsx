import { User } from "../types/User";

export default function UserListRow({ user }: { user: User }) {
  return (
    <div style={{ borderBottom: "1px solid #ddd", padding: 12 }}>
      <strong>{user.first_name} {user.last_name}</strong> — {user.email}
    </div>
  );
}
