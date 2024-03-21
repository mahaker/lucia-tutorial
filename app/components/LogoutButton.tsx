import { lucia, validateRequest } from "../auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function LogoutButton() {
  return (
    <form action={logout}>
      <button>Sign out</button>
    </form>
  );
}

async function logout(): Promise<ActionResult> {
  "use server";
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  // 既存のcookieを削除するため、すぐ無効になるcookieを作成
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/login");
}

interface ActionResult {
  error: string;
}
