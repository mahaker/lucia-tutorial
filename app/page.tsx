import styles from "./page.module.css";
import { validateRequest } from "./auth";
import { redirect } from "next/navigation";
import LogoutButton from "./components/LogoutButton";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  return (
    <main className={styles.main}>
      <div>
        <h2>You are logged in.</h2>
        <p>username: {user.username}</p>
        <p>address: {user.address}</p>
        <div style={{ marginTop: "5px" }}>
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
