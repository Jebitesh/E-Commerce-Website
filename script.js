// Mock product data
let products = JSON.parse(localStorage.getItem('products')) || [
  { id: 1, name: "Used Laptop", price: 25000, desc: "Dell Inspiron i5", img: "https://via.placeholder.com/150" },
  { id: 2, name: "Textbooks", price: 500, desc: "Engineering books set", img: "https://via.placeholder.com/150" }
];

// Display products
const productList = document.getElementById('productList');
if (productList) {
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${p.img}" width="150" height="150"><br>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <p><b>₹${p.price}</b></p>
      <button onclick="addToWishlist(${p.id})">Add to Wishlist</button>
    `;
    productList.appendChild(div);
  });
}

// Add to wishlist
function addToWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const item = products.find(p => p.id === id);
  wishlist.push(item);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  alert("Added to wishlist!");
}
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

import { updateProfile } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
const storage = getStorage(app);
views.profile = document.getElementById("view-profile");

const profEmail = document.getElementById("profEmail");
const newPic = document.getElementById("newPic");
const profilePreview = document.getElementById("profilePreview");
const profileStatus = document.getElementById("profileStatus");
function updateProfileBubble(user) {
  const bubble = document.getElementById("profileBubble");

  if (!user) {
    bubble.textContent = "";
    bubble.style.background = "#e5e7eb";
    bubble.style.backgroundImage = "none";

    bubble.onclick = () => authModal.classList.remove("hidden");
    return;
  }

  // Logged in
  if (user.photoURL) {
    bubble.style.backgroundImage = url('${user.photoURL}');
    bubble.textContent = "";
  } else {
    const initial = user.email.charAt(0).toUpperCase();
    bubble.textContent = initial;
    bubble.style.background = "#2563eb";
    bubble.style.color = "white";
    bubble.style.backgroundImage = "none";
  }

  bubble.onclick = () => {
    const c = confirm("Logout?");
    if (c) signOut(auth);
  };
}
onAuthStateChanged(auth, (user) => {
  updateProfileBubble(user);

  if (user) {
    profEmail.textContent = user.email;

    if (user.photoURL) {
      profilePreview.style.backgroundImage = url('${user.photoURL}');
    } else {
      profilePreview.style.backgroundImage = "none";
    }
  }
});
document.getElementById("updatePicBtn").onclick = async () => {
  const user = auth.currentUser;
  const file = newPic.files[0];

  if (!user) {
    alert("Please login first.");
    return;
  }

  if (!file) {
    alert("Select an image first.");
    return;
  }

  profileStatus.textContent = "Uploading...";

  try {
    // Upload to Firebase Storage
    const refPath = storageRef(storage, profilePics/$,{useruid}.jpg);
    const snapshot = await uploadBytes(refPath, file);
    const url = await getDownloadURL(snapshot.ref);

    // Update Firebase User profile
    await updateProfile(user, { photoURL: url });

    profileStatus.textContent = "Profile photo updated!";
    profilePreview.style.backgroundImage = url('${url}');

    updateProfileBubble(user);

  } catch (err) {
    profileStatus.textContent = "Error: " + err.message;
  }
};