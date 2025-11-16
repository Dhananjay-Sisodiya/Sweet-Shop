import React from "react";
import "../styles/global.css";


function SweetCard({ sweet, onPurchase }) {
return (
<div class="sweet-card">
<h3>{sweet.name}</h3>
<p>Category: {sweet.category}</p>
<p>Price: ₹{sweet.price}</p>
<p>Stock: {sweet.quantity}</p>


<button
disabled={sweet.quantity === 0}
onClick={() => onPurchase(sweet._id)}
>
Purchase
</button>
</div>
);
}


export default SweetCard;