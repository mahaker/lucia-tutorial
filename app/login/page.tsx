import client from "../db";
import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { lucia } from "../auth";
import { redirect } from "next/navigation";

export default function Page() {
  return (
    <>
      <h1>Sign In</h1>
      <form action={login}>
        <label htmlFor="username">Username</label>
        <input name="username" id="username" required />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" required />
        <br />
        <button>Continue</button>
      </form>
    </>
  );
}

async function login(formData: FormData): Promise<ActionResult> {
  "use server";

  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const selectUserRes = await client!.query(
    "SELECT  * FROM lucia_demo.auth_user WHERE username = $1;",
    [username]
  );
  if (selectUserRes.rowCount === 0) {
    return {
      error: "Invalid username or password",
    };
  }

  const user = selectUserRes.rows[0];
  console.log(user.hashed_password, password);
  const validPassword = await new Argon2id().verify(
    user.hashed_password,
    password
  );
  if (!validPassword) {
    return {
      error: "Invalid username or password",
    };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}

interface ActionResult {
  error: string;
}
