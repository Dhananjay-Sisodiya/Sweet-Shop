import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function AdminDashboard() {
  const [sweets, setSweets] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchSweets = async () => {
    try {
      const res = await api.get("/sweets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSweets(res.data);
    } catch {
      alert("Unauthorized - Please Login Again");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const createSweet = async () => {
    try {
      await api.post(
        "/sweets",
        {
          name,
          category,
          price: Number(price),
          quantity: Number(quantity),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Created");
      clearForm();
      fetchSweets();
    } catch {
      alert("Create Failed");
    }
  };

  const startEdit = (s) => {
    setEditId(s._id);
    setName(s.name);
    setCategory(s.category);
    setPrice(s.price);
    setQuantity(s.quantity);
  };

  const updateSweet = async () => {
    try {
      await api.put(
        `/sweets/${editId}`,
        {
          name,
          category,
          price: Number(price),
          quantity: Number(quantity),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Updated");
      clearForm();
      fetchSweets();
    } catch {
      alert("Update Failed");
    }
  };

  const deleteSweet = async (id) => {
    if (!confirm("Delete this sweet?")) return;

    try {
      await api.delete(`/sweets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Deleted");
      fetchSweets();
    } catch {
      alert("Delete Failed");
    }
  };

  const restockSweet = async (id) => {
    const qty = prompt("Enter restock quantity:");
    if (!qty) return;

    try {
      await api.post(
        `/sweets/${id}/restock`,
        { quantity: Number(qty) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Restocked");
      fetchSweets();
    } catch {
      alert("Restock Failed");
    }
  };

  const clearForm = () => {
    setEditId(null);
    setName("");
    setCategory("");
    setPrice("");
    setQuantity("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <button
        onClick={logout}
        style={{ float: "right", marginTop: "-40px", padding: "5px 15px" }}
      >
        Logout
      </button>

      <h3>{editId ? "Update Sweet" : "Add Sweet"}</h3>

      <input
        type="text"
        placeholder="Sweet Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      {editId ? (
        <>
          <button onClick={updateSweet}>Update</button>
          <button onClick={clearForm} style={{ marginLeft: 10 }}>
            Cancel
          </button>
        </>
      ) : (
        <button onClick={createSweet}>Add Sweet</button>
      )}

      <hr />

      <h3>All Sweets</h3>

      <ul>
        {sweets.map((s) => (
          <li key={s._id}>
            {s.name} — {s.category} — ₹{s.price} — Qty: {s.quantity}
            <button onClick={() => startEdit(s)} style={{ marginLeft: 10 }}>
              Edit
            </button>
            <button
              onClick={() => deleteSweet(s._id)}
              style={{ marginLeft: 10, color: "red" }}
            >
              Delete
            </button>
            <button
              onClick={() => restockSweet(s._id)}
              style={{ marginLeft: 10, color: "green" }}
            >
              Restock
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
