// login.ts
import { login } from "./auth.ts";

export function showLoginForm(container: HTMLElement) {
  container.innerHTML = `
    <div class="login-wrapper">
      <h1>Login</h1>
      <form id="loginForm">
        <input type="text" id="identifier" placeholder="Username or Email" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Log In</button>
        <div id="error" class="error"></div>
      </form>
    </div>
  `;

  const form = document.getElementById("loginForm") as HTMLFormElement;
  const errorDiv = document.getElementById("error") as HTMLDivElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = (document.getElementById("identifier") as HTMLInputElement).value;
    const pw = (document.getElementById("password") as HTMLInputElement).value;

    errorDiv.textContent = "";

    try {
      await login(id, pw);
    } catch (err) {
      console.error("Login error:", err);
      errorDiv.textContent = (err as Error).message;
    }
  });
}

