export const USER_INFO_QUERY = `
{
  user {
    firstName
    lastName
    id
    login
    email
    campus
    attrs
  }
}
`;

export const TRANSACTION_QUERY = `
{
  transaction(
    order_by: {amount: desc}
    limit: 1
    where: {
      type: {_eq: "level"},
      path: {_like: "/bahrain/bh-module%"}
    }
  ) {
    amount
  }
}
`;

export const AUDIT_QUERY = `
{
  user {
    validAudits: audits_aggregate(where: {grade: {_gte: 1}}) {
      nodes {
        group {
          captainLogin
          path
        }
      }
    }
    failedAudits: audits_aggregate(where: {grade: {_lt: 1}}) {
      nodes {
        group {
          captainLogin
          path
        }
      }
    }
  }
}
`;

export const TOTAL_XP = `
query {
  transaction_aggregate(
    where: {
      event: { path: { _eq: "/bahrain/bh-module" } }
      type: { _eq: "xp" }
    }
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
}
`;

export const User_Technologies = `
     {
        transaction(
            where: {
                _and: [
                    {type: { _iregex: "(^|[^[:alnum:]_])[[:alnum:]_]*skill_[[:alnum:]_]*($|[^[:alnum:]_])" }},
                    {type: {_like: "%skill%"}},
                    {object: {type: {_eq: "project"}}},
                    {type: {_in: [
                         "skill_git", "skill_go", "skill_js", 
                        "skill_html", "skill_css", "skill_unix", "skill_docker", 
                        "skill_sql"
                    ]}}
                ]
            }
            order_by: [{type: asc}, {createdAt: desc}]
            distinct_on: type
        ) {
            amount
            type
        }
    }
`;

export const User_Technical_Skills = `
{
  transaction(
    where: {
                _and: [
                    {type: { _iregex: "(^|[^[:alnum:]_])[[:alnum:]_]*skill_[[:alnum:]_]*($|[^[:alnum:]_])" }},
                    {type: {_like: "%skill%"}},
                    {object: {type: {_eq: "project"}}},
                    {type: {_in: [
                        "skill_prog", "skill_algo", "skill_front-end", 
                        "skill_back-end", "skill_go", "skill_html" , "skill_js"
                    ]}}
                ]
            }
            order_by: [{type: asc}, {createdAt: desc}]
            distinct_on: type
        ) {
            amount
            type
        }
    }
`;

export const Audit_Ratio = `
{
  user {
    auditRatio
    totalUp
    totalDown
  }
}
`;

// export const LAST_THREE_PROJECTS_QUERY = `
// {
//   transaction(
//     where: {
//       type: { _eq: "xp" },
//       object: { type: { _eq: "project" } }
//     }
//     order_by: { createdAt: desc }
//     limit: 3
//   ) {
//     object {
//       name
//       path
//     }
//     createdAt
//     amount
//   }
// }
// `;
