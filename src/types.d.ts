export type Result<T> = readonly [T, null] | readonly [null, Error];

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  campus: string;
  login: string;
  id: number;
  auditRatio: number;
  attrs?: { [key: string]: any };
}

export interface Audit {
  group: {
    captainLogin: string;
    path: string;
  };
}

export interface AuditRatio {
  auditRatio: number;
  totalUp: number;
  totalDown: number;
}

export interface UserSkill {
  amount: number;
  type: string;
}

export interface UserTech {
  amount: number;
  type: string;
}

export interface IAuditStatus {
  validAudits: {
    nodes: {
      group: {
        captainLogin: string;
        path: string;
      };
    }[];
  };
  failedAudits: {
    nodes: {
      group: {
        captainLogin: string;
        path: string;
      };
    }[];
  };
}

export interface ITotalXp {
  aggregate: {
    sum: {
      amount: number;
    };
  };
}

export interface LastProject {
  name: string;
  createdAt: string;
  amount: number;
}