import { login, logout } from './auth';
import { fetchUserData } from './graphql';

const root = document.getElementById("app")!;

function renderLogin() {
  root.innerHTML = `
    <h1>Login</h1>
    <form id="loginForm">
      <input id="identifier" placeholder="Username" required />
      <input id="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <div id="error" class="error"></div>
    </form>
  `;

  const form = document.getElementById("loginForm") as HTMLFormElement;
  const errorDiv = document.getElementById("error")!;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = (document.getElementById("identifier") as HTMLInputElement).value;
    const pw = (document.getElementById("password") as HTMLInputElement).value;

    errorDiv.textContent = "";
    try {
      await login(id, pw);
      renderDashboard();
    } catch (err) {
      errorDiv.textContent = (err as Error).message;
    }
  });
}

async function renderDashboard() {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) return renderLogin();

  try {
    const user = await fetchUserData(jwt);
    const container = document.createElement("div");
    container.className = "dashboard";

    const heading = document.createElement("h2");
    heading.textContent = `Hello, ${user.firstName} ${user.lastName}!`;

    const email = document.createElement("p");
    email.textContent = `Email: ${user.email}`;

    const campus = document.createElement("p");
    campus.textContent = `Campus: ${user.campus}`;

    const login = document.createElement("p");
    login.textContent = `Username: ${user.login}`;

    const id = document.createElement("p");
    id.textContent = `ID: ${user.id}`;

    const auditRatio = document.createElement("p");
    const ratio = user.auditRatio?.toFixed(1) || "N/A";
    auditRatio.textContent = `Audit Ratio: ${ratio}`;

    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logoutBtn";
    logoutBtn.textContent = "Logout";

    container.appendChild(heading);
    container.appendChild(email);
    container.appendChild(campus);
    container.appendChild(login);
    container.appendChild(id);
    container.appendChild(auditRatio);
    container.appendChild(logoutBtn);

    root.innerHTML = "";
    root.appendChild(container);


    document.getElementById("logoutBtn")!.addEventListener("click", () => {
      logout();
      renderLogin();
    });
  } catch (err) {
    localStorage.removeItem("jwt");
    renderLogin();
  }
}

function initApp() {
  const jwt = localStorage.getItem("jwt");
  jwt ? renderDashboard() : renderLogin();
}

initApp();