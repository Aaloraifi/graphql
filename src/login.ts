import { login } from "./auth.ts";

export function showLoginForm(container: HTMLElement) {
  // Remove floating avatar/logout if present
  const floating = document.getElementById("floating-user-avatar");
  if (floating) floating.remove();

  container.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "login-wrapper";
  const heading = document.createElement("h1");
  heading.textContent = "Login";
  const form = document.createElement("form");
  form.id = "loginForm";
  const identifierinput = document.createElement("input");
  identifierinput.type = "text";
  identifierinput.id = "identifier";
  identifierinput.placeholder = "Username";
  identifierinput.required = true;
  const passwordinput = document.createElement("input");
  passwordinput.type = "password";
  passwordinput.id = "password";
  passwordinput.placeholder = "Password";
  passwordinput.required = true;
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Login";
  const errorDiv = document.createElement("div");
  errorDiv.id = "error";
  errorDiv.className = "error";
  form.append(identifierinput, passwordinput, submitButton, errorDiv);
  wrapper.append(heading, form);
  container.appendChild(wrapper);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = (document.getElementById("identifier") as HTMLInputElement)
      .value;
    const pw = (document.getElementById("password") as HTMLInputElement).value;
    errorDiv.textContent = "";
    try {
      await login(id, pw);
    } catch (err) {
  console.error("Login error:", err);
      if (err instanceof Error) {
        errorDiv.textContent = err.message;
      } else if (typeof err === "object" && err !== null) {
        errorDiv.textContent = (err as any).error || JSON.stringify(err);
      } else {
        errorDiv.textContent = String(err);
      }
    }
  });
}
