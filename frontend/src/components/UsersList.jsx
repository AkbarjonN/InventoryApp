
import React, { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../services/api";
import { toast } from "react-toastify";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      
      setUsers(res.data);
    } catch  {
      toast.error("Error fetching users");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success("Role updated!");
      fetchUsers();
    } catch  {
      toast.error("Error updating role");
    }
  };

  return (
    <div className="container mt-4">
      <h3>User Management</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="form-select"
                >
                  <option value="admin">Admin</option>
                  <option value="creator">Creator</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
