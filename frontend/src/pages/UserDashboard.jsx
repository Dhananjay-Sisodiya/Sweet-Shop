import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const loadSweets = async () => {
    try {
      const res = await api.get("/sweets", {
        headers: { Authorization: `Bearer ${token}` }, // 🔥 TOKEN FIX
      });
      setSweets(res.data);
    } catch (err) {
      alert("Failed to load sweets");
      console.error(err);
    }
  };

  useEffect(() => {
    loadSweets();
  }, []);

  // Search sweets
  const searchSweets = async () => {
    try {
      const res = await api.get(`/sweets/search?name=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSweets(res.data);
    } catch (err) {
      alert("Search failed");
    }
  };

  // Purchase
  const purchaseSweet = async (id) => {
    const qty = prompt("Enter quantity:");
    if (!qty) return;

    try {
      await api.post(
        `/sweets/${id}/purchase`,
        { quantity: Number(qty) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Purchase successful");
      loadSweets();
    } catch (err) {
      alert("Purchase failed");
      console.error(err);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out");
    navigate("/login");
  };

  return (
    <div className="page">
      <h1>User Dashboard</h1>

      <button onClick={handleLogout} style={{ float: "right" }}>
        Logout
      </button>

      <input
        placeholder="Search sweet..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={searchSweets}>Search</button>
      <button onClick={loadSweets}>Reset</button>

      <hr />

      <h3>Available Sweets</h3>
      {sweets.map((s) => (
        <div key={s._id} className="card">
          <h4>{s.name}</h4>
          <p>Category: {s.category}</p>
          <p>Price: ₹{s.price}</p>
          <p>Quantity: {s.quantity}</p>

          <button onClick={() => purchaseSweet(s._id)}>Buy</button>
        </div>
      ))}
    </div>
  );
}
