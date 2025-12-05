import React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "../styles/UserCard.css";

type Props = { users: any[] };

const UserCard: React.FC<Props> = ({ users,onEdit }) => {
  return (
    <div className="card-grid">
      {users.map((u: any) => (
        <div key={u.id} className="user-card">
          <div className="hover-actions">
            {/* <button className="action edit"></button> */}
               <button className="action edit" onClick={()=>onEdit(u)}><EditOutlined /></button>
            <button className="action delete"><DeleteOutlined /></button>
          </div>

          <img src={u.avatar} alt={u.email} className="card-avatar" />
          <h3 className="card-name">{u.first_name} {u.last_name}</h3>
          <p className="card-email">{u.email}</p>
        </div>
      ))}
    </div>
  );
};

export default UserCard;
