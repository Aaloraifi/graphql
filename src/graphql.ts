// import { USER_INFO_QUERY, Audit_Ratio } from './queries';
import type { User } from './types';

export async function fetchUserData(jwt: string): Promise<User> {
  const res = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    },
    body: JSON.stringify({ 
      query: `
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
      `
    })
  }); 

  const { data } = await res.json();
  return data.user[0];
}
