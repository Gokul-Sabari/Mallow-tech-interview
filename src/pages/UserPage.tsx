import React, { useEffect, useState } from "react";
import "../styles/User.css"
import UserTable from "../components/UserTable";
import UserCard from "../components/UserCard";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchUsers } from "../redux/slices/usersSlice";
import { CloseOutlined, LogoutOutlined, ProfileOutlined, SearchOutlined, TableOutlined } from "@ant-design/icons";

const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, page, totalPages } = useAppSelector((state) => state.User);
  const [view, setView] = useState<"table" | "card">("table");
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false)
  const filteredUsers = list.filter((u: any) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchUsers(page));
  }, [dispatch, page]);

  const handleSubmit = () => {
    if (!firstName || !lastName || !email || !image) {
       showToast("All fields are required!", "error"); 
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      profile: image,
    };

    const url = editMode
      ? `https://reqres.in/api/users/${selectedUser.id}`
      : "https://reqres.in/api/users";

    fetch(url, {
      method: editMode ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "reqres_1af77f68c54d455b865dfacb1f622a38"
      },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        
        showToast(editMode ? "User updated!" : "User created!", "success");
        alert(editMode ? "User updated!" : "User created!");
        setShowPopup(false);
        setEditMode(false);
        setSelectedUser(null);
      })
      .catch(() => showToast("Something went wrong!", "error")); 

      
  };

  useEffect(() => {
    if (selectedUser) {
      setFirstName(selectedUser.first_name);
      setLastName(selectedUser.last_name);
      setEmail(selectedUser.email);
      setImage(selectedUser.avatar);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setImage("");
    }
  }, [selectedUser]);

  return (
    <div className="users-container">


      <div className="topbar-user">
        <span style={{ color: "white" }}>Elon Musk</span>
        <button className="logout">
          <LogoutOutlined />
        </button>
      </div>

      <div className="users-content-card">
        <h2 className="page-title">Users</h2>

        <div className="controls-row">
          <div className="toggle-btns">
            <button
              className={view === "table" ? "active" : ""}
              onClick={() => setView("table")}
            >
              <TableOutlined style={{ marginRight: 8 }} /> Table
            </button>

            <button
              className={view === "card" ? "active" : ""}
              onClick={() => setView("card")}
            >
              <ProfileOutlined style={{ marginRight: 8 }} /> Card
            </button>
          </div>

          <div className="right-controls">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="input search text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="search-icon"><SearchOutlined /></span>
            </div>
            <button className="create-user-btn" onClick={() => setShowPopup(true)}>Create User</button>
          </div>
        </div>


        {view === "table" ? (
          <UserTable users={filteredUsers} onEdit={(user) => {
            setSelectedUser(user);
            setEditMode(true);
            setShowPopup(true);
          }} />

        ) : (
          <UserCard users={filteredUsers} onEdit={(user: any) => {
            setSelectedUser(user);
            setEditMode(true);
            setShowPopup(true);
          }} />
        )}

        <div className="pagination-box">
          <button>{"<"}</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} className={page === i + 1 ? "active" : ""}>
              {i + 1}
            </button>
          ))}
          <button>{">"}</button>
        </div>
      </div>

      {showPopup && (
        <>
          <div className="user-popup-overlay">
            <div className="user-popup-box">
              <div className="popup-header">
                <h3>Create New User</h3>
                <span className="close-popup" onClick={() => setShowPopup(false)}><CloseOutlined /></span>
              </div>
              <div className="popup-body">
                <label><span className="required">*</span>First Name</label>
                <input type="text" placeholder="Please Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <label><span className="required">*</span>Last Name</label>
                <input type="text" placeholder="Please your first name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <label><span className="required">*</span>Email</label>
                <input type="text" placeholder="Please Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label><span className="required">*</span>Profile Image Link</label>
                <input type="text" placeholder="Please Profile image link" value={image} onChange={(e) => setImage(e.target.value)} />
              </div>

              <div className="popup-footer">
                <button className="cancel-btn"  onClick={() => {
    setShowPopup(false);
    setEditMode(false);
    setSelectedUser(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setImage("");
  }}
 >Cancel</button>
                <button className="save-btn" onClick={handleSubmit}>Submit</button>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default UsersPage;
function showToast(arg0: string, arg1: string) {
  throw new Error("Function not implemented.");
}

