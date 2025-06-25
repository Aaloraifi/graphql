import { USER_INFO_QUERY, TRANSACTION_QUERY, AUDIT_QUERY, TOTAL_XP, User_Technical_Skills, User_Technologies, Audit_Ratio} from "./queries";
import type { Result, User, AuditRatio, IAuditStatus, UserTech, UserSkill} from "./types";

const baseUrl = "https://learn.reboot01.com/api/graphql-engine/v1/graphql";
export async function fetchUserData(jwt: string): Promise<User> {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      query: USER_INFO_QUERY,
    }),
  });

  const { data } = await res.json();
  console.log(data.user[0]);
  return data.user[0];
}

export async function fetchTransaction(jwt: string): Promise<number>{
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      query: TRANSACTION_QUERY,
    }),
  });

  const { data } = await res.json();
  console.log(data.transaction[0].amount);
  return data.transaction[0].amount;
}

export async function fetchAudit(jwt: string): Promise<IAuditStatus> {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      query: AUDIT_QUERY,
    }),
  });

  const { data } = await res.json();

  const validAudits = data.user[0].validAudits.nodes;
  const failedAudits = data.user[0].failedAudits.nodes;

  console.log(validAudits);
  console.log(failedAudits);


  return {
    validAudits: { nodes: validAudits },
    failedAudits: { nodes: failedAudits },
  };
}

export async function fetchXP(jwt: string): Promise<number> {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ query: TOTAL_XP }),
  });

  const { data } = await res.json();
  console.log(data.transaction_aggregate.aggregate.sum.amount);
  return data.transaction_aggregate.aggregate.sum.amount;
}


export async function fetchUserSkill(jwt: string): Promise<UserSkill[]> {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      query: User_Technical_Skills,
    }),
  });

  const { data } = await res.json();
  console.log(data.transaction);
  return data.transaction as UserSkill[]; 
}

export async function fetchUserTech(jwt: string): Promise<UserTech[]> {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      query: User_Technologies,
    }),
  });

  const { data } = await res.json();
  console.log(data.transaction);
  return data.transaction as UserTech[]; 
}


export async function fetchAuditRatio(jwt: string): Promise<Result<AuditRatio>> {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      query: Audit_Ratio,
    }),
  });

  const { data } = await res.json();
  console.log(data.user[0]);
  return data.user[0];
}


