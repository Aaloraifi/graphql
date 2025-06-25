import { fetchUserData } from "../graphql";

export async function createUserInfoSection(jwt: string): Promise<HTMLDivElement> {
  const user = await fetchUserData(jwt);
console.log("user.attrs:", user.attrs);
  // Top-left avatar and logout (outside dashboard)
  const floating = document.createElement("div");
  floating.style.position = "fixed";
  floating.style.top = "2rem";
  floating.style.left = "2rem";
  floating.style.zIndex = "1000";
  floating.style.display = "flex";
  floating.style.flexDirection = "column";
  floating.style.alignItems = "flex-start";

  // User avatar (initials)
  const avatar = document.createElement("div");
  avatar.className = "user-avatar";
  avatar.textContent = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  avatar.style.margin = "0";
  avatar.style.cursor = "pointer";

  // Logout button (hidden by default)
  const logoutBtn = document.createElement("button");
  logoutBtn.id = "logoutBtn";
  logoutBtn.textContent = "Logout";
  logoutBtn.style.display = "none";
  logoutBtn.style.width = "90px";
  logoutBtn.style.background = "#e10098";
  logoutBtn.style.color = "#fff";
  logoutBtn.style.border = "none";
  logoutBtn.style.borderRadius = "8px";
  logoutBtn.style.padding = "0.5rem 0";
  logoutBtn.style.fontWeight = "600";
  logoutBtn.style.fontSize = "1rem";
  logoutBtn.style.cursor = "pointer";
  logoutBtn.style.marginTop = "0.5rem";

  // Show logout on avatar hover
  avatar.addEventListener("mouseenter", () => {
    logoutBtn.style.display = "block";
  });
  avatar.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!logoutBtn.matches(":hover")) logoutBtn.style.display = "none";
    }, 100);
  });
  logoutBtn.addEventListener("mouseleave", () => {
    logoutBtn.style.display = "none";
  });
  logoutBtn.addEventListener("mouseenter", () => {
    logoutBtn.style.display = "block";
  });

  floating.appendChild(avatar);
  floating.appendChild(logoutBtn);

  // Remove any existing floating avatar/logout to avoid duplicates or lingering on login
  const existingFloating = document.getElementById("floating-user-avatar");
  if (existingFloating) existingFloating.remove();

  // Only add floating avatar/logout if jwt exists in localStorage and not already present
  if (localStorage.getItem("jwt")) {
    floating.id = "floating-user-avatar";
    document.body.appendChild(floating);
  }

  // Main dashboard container
  const container = document.createElement("div");
  container.className = "dashboard";

  // Rectangular card for user info
  const card = document.createElement("div");
  card.className = "card user-info-card";
  card.style.margin = "2rem auto 2.5rem auto";
  card.style.maxWidth = "1200px";
  card.style.width = "100%";
  card.style.textAlign = "center";
  card.style.boxSizing = "border-box";

  // Welcome heading
  const heading = document.createElement("h2");
  heading.textContent = `WELCOME ${user.firstName} ${user.lastName}!`;
  heading.style.marginBottom = "0.5rem";
  card.appendChild(heading);

  // User info details styled as a transparent table with 3 items per row
  const detailsTable = document.createElement("table");
  detailsTable.className = "user-info-table";
  detailsTable.style.width = "100%";
  detailsTable.style.borderCollapse = "separate";
  detailsTable.style.background = "rgba(255,255,255,0.15)";
  detailsTable.style.backdropFilter = "blur(2px)";
  detailsTable.style.borderRadius = "16px";
  detailsTable.style.overflow = "hidden";
  detailsTable.style.margin = "1.5rem 0";
  detailsTable.style.color = "0 2px 12px 0 rgba(166, 24, 123, 0.07)";

  // Collect all info as [label, value] pairs
  const infoRows: [string, string][] = [
    ["Email", user.email],
    ["Campus", user.campus],
    ["Username", user.login],
    ["ID", String(user.id)]
  ];
  if (user.attrs) {
    if (user.attrs.genders) infoRows.push(["Gender", user.attrs.genders]);
    if (user.attrs.dateOfBirth) infoRows.push([
      "Date of Birth",
      new Date(user.attrs.dateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    ]);
    if (user.attrs.Degree) infoRows.push(["Degree", user.attrs.Degree]);
    if (user.attrs.PhoneNumber) infoRows.push(["Phone Number", user.attrs.PhoneNumber]);
    if (user.attrs.CPRnumber) infoRows.push(["CPR Number", user.attrs.CPRnumber]);
    if (user.attrs.other) infoRows.push(["Employment", user.attrs.other]);
    if (user.attrs.qualification) infoRows.push(["Qualifications", user.attrs.qualification]);
    if (user.attrs.countryOfBirth) infoRows.push(["Place of Birth", user.attrs.countryOfBirth]);
  }

  // Render every 3 items in a row
  for (let i = 0; i < infoRows.length; i += 3) {
    const tr = document.createElement("tr");
    for (let j = 0; j < 3; j++) {
      const idx = i + j;
      if (idx < infoRows.length) {
        const [label, value] = infoRows[idx];
        const td = document.createElement("td");
        td.style.verticalAlign = "top";
        td.style.padding = "1.1rem 1.2rem";
        td.style.background = "transparent";
        td.style.width = "33%";
        td.style.border = "none";
        td.style.borderBottom = "1px solid #e0e0e0";
        td.style.borderRight = j < 2 ? "1px solid #e0e0e0" : "none";
        
        const labelEl = document.createElement("div");
        labelEl.textContent = label;
        labelEl.style.fontWeight = "600";
        labelEl.style.fontSize = "1rem";
        labelEl.style.color = "#6c6c80";
        labelEl.style.marginBottom = "0.2rem";
        
        const valueEl = document.createElement("div");
        valueEl.textContent = value;
        valueEl.style.fontWeight = "500";
        valueEl.style.fontSize = "1.08rem";
        valueEl.style.color = "#764ba2"; 
        
        td.appendChild(labelEl);
        td.appendChild(valueEl);
        tr.appendChild(td);
      } else {
        // Empty cell for alignment
        const td = document.createElement("td");
        td.style.background = "transparent";
        td.style.border = "none";
        tr.appendChild(td);
      }
    }
    detailsTable.appendChild(tr);
  }

  card.appendChild(detailsTable);

  container.appendChild(card);
  return container;
}