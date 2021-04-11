import Head from "next/head";
import styles from "../../../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nested 2 page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Nested 2 page</h1>
    </div>
  );
}
