(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();async function g(i,r){const o=btoa(`${i}:${r}`),n=await fetch("https://learn.reboot01.com/api/auth/signin",{method:"POST",headers:{Authorization:`Basic ${o}`}}),e=await n.text();let t;try{const a=JSON.parse(e);t=a.token||a.jwt||a}catch{t=e.trim()}if(!n.ok||!t)throw new Error(t||"Login failed");localStorage.setItem("jwt",t)}function h(){localStorage.removeItem("jwt")}async function y(i){const r=await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify({query:`
        {
          user {
            firstName
            lastName
            id
            login
            email
            campus
            auditRatio
          }
        }
      `})}),{data:o}=await r.json();return o.user[0]}const d=document.getElementById("app");function c(){d.innerHTML=`
    <h1>Login</h1>
    <form id="loginForm">
      <input id="identifier" placeholder="Username" required />
      <input id="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <div id="error" class="error"></div>
    </form>
  `;const i=document.getElementById("loginForm"),r=document.getElementById("error");i.addEventListener("submit",async o=>{o.preventDefault();const n=document.getElementById("identifier").value,e=document.getElementById("password").value;r.textContent="";try{await g(n,e),p()}catch(t){r.textContent=t.message}})}async function p(){var r;const i=localStorage.getItem("jwt");if(!i)return c();try{const o=await y(i),n=document.createElement("div");n.className="dashboard";const e=document.createElement("h2");e.textContent=`Hello, ${o.firstName} ${o.lastName}!`;const t=document.createElement("p");t.textContent=`Email: ${o.email}`;const a=document.createElement("p");a.textContent=`Campus: ${o.campus}`;const l=document.createElement("p");l.textContent=`Username: ${o.login}`;const u=document.createElement("p");u.textContent=`ID: ${o.id}`;const m=document.createElement("p"),f=((r=o.auditRatio)==null?void 0:r.toFixed(1))||"N/A";m.textContent=`Audit Ratio: ${f}`;const s=document.createElement("button");s.id="logoutBtn",s.textContent="Logout",n.appendChild(e),n.appendChild(t),n.appendChild(a),n.appendChild(l),n.appendChild(u),n.appendChild(m),n.appendChild(s),d.innerHTML="",d.appendChild(n),document.getElementById("logoutBtn").addEventListener("click",()=>{h(),c()})}catch{localStorage.removeItem("jwt"),c()}}function w(){localStorage.getItem("jwt")?p():c()}w();
