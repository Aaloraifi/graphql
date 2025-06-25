// it works without it

// import { fetchUserData } from "./graphql";

// export async function showDashboard(app: HTMLElement, jwt: string) {
//   const user = await fetchUserData(jwt);

//   const firstName = user.firstName || '';
//   const lastName = user.lastName || '';
//   const email = user.email || '';
//   const campus = user.campus || '';
//   const login = user.login || '';
//   const id = user.id || '';
//   const auditRatio = user.auditRatio?.toFixed(1) || 'N/A';

//   app.innerHTML = `
//     <div>
//       <h1>Hello, ${firstName} ${lastName}!</h1>
//       <p>Email: ${email}</p>
//       <p>Campus: ${campus}</p>
//       <p>Username: ${login}</p>
//       <p>ID: ${id}</p>
//       <p>Audit Ratio: ${auditRatio}</p>
//       <button id="logoutBtn">Logout</button>
//     </div>
//   `;

//   document.getElementById("logoutBtn")?.addEventListener("click", () => {
//     localStorage.removeItem("jwt");
//     location.reload(); // Back to login
//   });
// }
