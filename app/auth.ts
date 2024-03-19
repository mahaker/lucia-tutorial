// https://lucia-auth.com/database/postgresql

import { Lucia } from "lucia";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import pg from "pg";

const pool = new pg.Pool({
  connectionString:
    "postgres://test:password@localhost:5430/lucia_demo_db?currentSchema=lucia_demo",
});

// DBのテーブル名を指定
const adapter = new NodePostgresAdapter(pool, {
  user: "lucia_demo.auth_user",
  session: "lucia_demo.user_session",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attr) => {
    return {
      // TODO fix
      // @ts-ignore
      username: attr.username,
    };
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}

interface DatabaseUserAttributes {
  username: string;
}
