import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Page 1</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Page 1</h1>
    </div>
  );
}
