import React, { useEffect, useState } from "react";
import "../styles/User.css"
import UserTable from "../components/UserTable";
import UserCard from "../components/UserCard";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchUsers } from "../redux/slices/usersSlice";
import { CloseOutlined, LogoutOutlined, ProfileOutlined, SearchOutlined, TableOutlined } from "@ant-design/icons";
import axiosClient from "../api/axiosClient";
import { showToast } from "../components/Toaster";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, page, total_pages } = useAppSelector((state) => state.User);
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
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setShowDeletePopup(true);
  };


  useEffect(() => {
    dispatch(fetchUsers(page));
  }, [dispatch, page]);



  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await axiosClient.delete(`/users/${userToDelete.id}`);
      showToast.success("User deleted!");
      dispatch(fetchUsers(page));
    } catch (err) {
      console.error(err);
      showToast.error("Failed to delete user!");
    } finally {
      setShowDeletePopup(false);
      setUserToDelete(null);
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !image) {
      alert("All fields are required!");
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      avatar: image,
    };

    const url = editMode ? `/users/${selectedUser.id}` : `/users`;
    const method = editMode ? "put" : "post";

    try {
      const res = await axiosClient({
        url,
        method,
        data: payload,
      });


      showToast.success(editMode ? "User updated!" : "User created!");

      setShowPopup(false);
      setEditMode(false);
      setSelectedUser(null);
      dispatch(fetchUsers(page));

    } catch (err) {
      console.error(err);
      alert("Request failed!");
    }
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
        <button
          className="logout"
          onClick={() => {
            dispatch(logout());
            navigate("/", { replace: true });
          }}
        >
          <span><LogoutOutlined /></span>
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
          }}
            onDelete={(user) => handleDeleteClick(user)} />

        ) : (
          <UserCard users={filteredUsers} onEdit={(user: any) => {
            setSelectedUser(user);
            setEditMode(true);
            setShowPopup(true);
          }}
            onDelete={(user) => handleDeleteClick(user)} />
        )}

        <div className="pagination-box">
          <button
            disabled={page === 1}
            onClick={() => dispatch(fetchUsers(page - 1))}
          >
            {"<"}
          </button>

          {[...Array(total_pages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                className={page === pageNum ? "active" : ""}
                onClick={() => dispatch(fetchUsers(pageNum))}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            disabled={page === total_pages}
            onClick={() => dispatch(fetchUsers(page + 1))}
          >
            {">"}
          </button>
        </div>

      </div>

      {showPopup && (
        <>
          <div className="user-popup-overlay">
            <div className="user-popup-box">
              <div className="popup-header">
                <h3>Create New User</h3>
                <span className="close-popup" onClick={() => {
                  setShowPopup(false);
                  setEditMode(false);
                  setSelectedUser(null);
                  setFirstName("");
                  setLastName("");
                  setEmail("");
                  setImage("");
                }}><CloseOutlined /></span>
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
                <button className="cancel-btn" onClick={() => {
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


      {showDeletePopup && (
        <div className="user-popup-overlay">
          <div className="user-popup-delete-box">
            <div className="popup-header">
              <h3>Confirm Delete</h3>
              <span
                className="close-popup"
                onClick={() => setShowDeletePopup(false)}
              >
                &times;
              </span>
            </div>
            <div className="popup-body">
              <p>Are you sure you want to delete this item?</p>
            </div>
            <div className="popup-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowDeletePopup(false)}
              >
                No
              </button>
              <button className="save-btn" onClick={handleConfirmDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default UsersPage;