import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>文成公主</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          我是 文成公主!
        </h1>

        <p className={styles.description}>
          会写作，会学习，我是基于GPT4的智能助手。
        </p>

        <div className={styles.grid}>
          <Link href="/chat" className={styles.card}>
            <h3>聊天 &rarr;</h3>
            <p>陪你说什么话题都行</p>
          </Link>

          <Link href="/ingest" className={styles.card}>
            <h3>投喂 &rarr;</h3>
            <p>我的食物就是新知识</p>
          </Link>

          <Link href="/writing" className={styles.card}>
            <h3>写作 &rarr;</h3>
            <p>协助你编写文档</p>
          </Link>

          <Link href="/train" className={styles.card}>
            <h3>训练 &rarr;</h3>
            <p>
              帮你理解和掌握
            </p>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        Powered by{' '} 薛宏伟 / 43801@qq.com
      </footer>
    </div>
  )
}
