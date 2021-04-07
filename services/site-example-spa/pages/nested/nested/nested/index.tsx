import Head from "next/head";
import styles from "../../../../styles/Home.module.css";

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nested 3 page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Nested 3 page</h1>
    </div>
  );
}
