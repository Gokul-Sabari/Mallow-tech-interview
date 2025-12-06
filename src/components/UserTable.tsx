import React from "react";

type Props = { users: any[],onEdit:(user:any)=>void,onDelete:(user:any)=>void };

const UserTable: React.FC<Props> = ({ users,onEdit,onDelete}) => {

    
  return (
    <div>
    <table className="users-table">
      <thead>
        <tr>
          <th></th>
          <th>Email</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>
              <img src={u.avatar} alt={u.email} className="avatar" />
            </td>
            <td className="email-text">{u.email}</td>
            <td>{u.first_name}</td>
            <td>{u.last_name}</td>
            <td>
              <button className="edit" onClick={()=>onEdit(u)}>Edit</button>
              <button className="delete" onClick={()=>onDelete(u)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default UserTable;
