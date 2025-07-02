const memberContainer = document.querySelector("#members");
const gridBtn = document.querySelector("#gridBtn");
const listBtn = document.querySelector("#listBtn");

async function getMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error("Data fetch failed");
    const data = await response.json();
    displayMembers(data);
  } catch (error) {
    console.error("Error loading members:", error);
    memberContainer.innerHTML = "<p>Failed to load member data.</p>";
  }
}

function displayMembers(members) {
  memberContainer.innerHTML = ""; // clear existing

  members.forEach(member => {
    const card = document.createElement("div");
    card.classList.add("member-card");

    card.innerHTML = `
      <h3>${member.name}</h3>
      <img src="images/${member.image}" alt="${member.name} logo" loading="lazy" width="200">
      <p><strong>Address:</strong> ${member.address}</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <a href="${member.website}" target="_blank">Visit Website</a>
    `;

    memberContainer.appendChild(card);
  });
}

// Toggle view
gridBtn.addEventListener("click", () => {
  memberContainer.classList.add("grid-view");
  memberContainer.classList.remove("list-view");
});

listBtn.addEventListener("click", () => {
  memberContainer.classList.add("list-view");
  memberContainer.classList.remove("grid-view");
});

// Load data
getMembers();
