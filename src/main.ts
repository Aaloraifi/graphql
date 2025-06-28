import { login, logout } from "./auth";
import "./style.css";
import { createUserInfoSection } from "./components/userInfo";
import { createLevelCard } from "./components/levelCard";
import { createAuditRatioCard } from "./components/auditRatioCard";
import { createXPCard } from "./components/xpCard";
import { createSkillsCard } from "./components/skillsCard";
import { createTechCard } from "./components/techCard";
import { createAuditGroupsCard } from "./components/auditGroupsCard";
import { createLearningProgressCardWithProjects } from "./components/learningProgressCard";

const root = document.getElementById("app")!;

function renderLogin() {
  root.innerHTML = "";
  const floating = document.getElementById("floating-user-avatar");
  if (floating) floating.remove();
  //logo
  const logoDiv = document.createElement("div");
  logoDiv.className = "logo";
  const logoTitle = document.createElement("h1");
  logoTitle.textContent = "GraphQL";
  logoDiv.appendChild(logoTitle);

  const container = document.createElement("div");
  container.className = "container fade-in";

  const heading = document.createElement("h1");
  heading.textContent = "Welcome! Login Here";
  heading.className = "login-heading-animated";
  heading.style.textAlign = "center";
  heading.style.color = "white";
  heading.style.marginBottom = "2rem";
  heading.style.fontSize = "2.5rem";
  heading.style.fontWeight = "700";
  heading.style.marginTop = "0.5rem";

  const form = document.createElement("form");
  form.id = "loginForm";

  const usernameInput = document.createElement("input");
  usernameInput.id = "identifier";
  usernameInput.placeholder = "Enter your username";
  usernameInput.required = true;
  usernameInput.type = "text";

  const passwordInput = document.createElement("input");
  passwordInput.id = "password";
  passwordInput.type = "password";
  passwordInput.placeholder = "Enter your password";
  passwordInput.required = true;

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Sign In";
  submitButton.style.width = "100%";
  submitButton.style.marginTop = "1rem";

  const errorDiv = document.createElement("div");
  errorDiv.id = "error";
  errorDiv.className = "error";

  form.append(usernameInput, passwordInput, submitButton, errorDiv);
  container.append(logoDiv, heading, form);
  root.appendChild(container);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = (document.getElementById("identifier") as HTMLInputElement)
      .value;
    const pw = (document.getElementById("password") as HTMLInputElement).value;
    errorDiv.textContent = "";
    submitButton.textContent = "Signing in...";
    submitButton.disabled = true;
    try {
      await login(id, pw);
      renderDashboard();
    } catch (err) {
      errorDiv.textContent = (err as Error).message;
      submitButton.textContent = "Sign In";
      submitButton.disabled = false;
    }
  });
}

async function renderDashboard() {
  const floating = document.getElementById("floating-user-avatar");
  if (floating) floating.remove();

  const jwt = localStorage.getItem("jwt");
  if (!jwt) return renderLogin();

  try {
    root.innerHTML = "";
    const mainContainer = document.createElement("div");
    mainContainer.className = "container fade-in";
    const logoDiv = document.createElement("div");
    logoDiv.className = "logo";
    const logoTitle = document.createElement("h1");
    logoTitle.textContent = "GraphQL";
    logoDiv.appendChild(logoTitle);
    
    const container = await createUserInfoSection(jwt);
   
    const cardsGrid = document.createElement("div");
    cardsGrid.className = "cards-grid";
    mainContainer.appendChild(logoDiv);
    mainContainer.appendChild(container);
    mainContainer.appendChild(cardsGrid);
    root.appendChild(mainContainer);
    document.getElementById("logoutBtn")!.addEventListener("click", () => {
      logout();
      renderLogin();
    });
    
    const cardPromises = [
      createLevelCard(jwt),
      createAuditRatioCard(jwt),
      createXPCard(jwt),
      createSkillsCard(jwt),
      createTechCard(jwt),
      createAuditGroupsCard(jwt),
      createLearningProgressCardWithProjects(jwt),
    ];
    const cards = await Promise.all(cardPromises);

    // Group Audit Ratio and XP together
    const cardRow = document.createElement("div");
    cardRow.className = "card-row";
    cardRow.style.display = "flex";
    cardRow.style.gap = "2rem";
    cardRow.style.justifyContent = "center";
    cardRow.style.flexWrap = "wrap";
    cardsGrid.appendChild(cards[0]); // Level card
    cardRow.appendChild(cards[1]); // Audit Ratio
    cardRow.appendChild(cards[2]); // XP
    cardsGrid.appendChild(cardRow); // Row group

    [5, 3, 6, 4].forEach((i) => { // the rest are here
      if (cards[i]) cardsGrid.appendChild(cards[i]);
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    localStorage.removeItem("jwt");
    render404();
  }
}

function render404() {
  root.innerHTML = "";
  const container = document.createElement("div");
  container.className = "container fade-in";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.minHeight = "60vh";

  const heading = document.createElement("h1");
  heading.textContent = "404 - Page Not Found";
  heading.className = "login-heading-animated";
  heading.style.fontSize = "2.5rem";
  heading.style.marginBottom = "1.5rem";

  const message = document.createElement("p");
  message.textContent = "Sorry, the page you are looking for does not exist.";
  message.style.color = "#fff";
  message.style.fontSize = "1.2rem";
  message.style.marginBottom = "2rem";
  message.style.textAlign = "center";

  const backBtn = document.createElement("button");
  backBtn.textContent = "Back to Login";
  backBtn.onclick = () => renderLogin();
  backBtn.style.padding = "0.8rem 2rem";
  backBtn.style.fontSize = "1.1rem";
  backBtn.style.cursor = "pointer";

  container.append(heading, message, backBtn);
  root.appendChild(container);
}

function initApp() {
  const validPaths = ["/", ""];
  const currentPath = window.location.pathname;
  if (!validPaths.includes(currentPath)) {
    render404();
    return;
  }
  const jwt = localStorage.getItem("jwt");
  jwt ? renderDashboard() : renderLogin();
}

window.addEventListener("popstate", initApp);

initApp();
 