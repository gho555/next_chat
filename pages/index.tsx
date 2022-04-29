import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Message, { MessageType } from "../components/Message";
import SocketIOClient from "../components/SocketIOClient";
import { Heading } from "@chakra-ui/react";
import { User } from "./api/user";
import { withSessionSsr } from "../lib/withSession";
import useMessages from "../lib/useMessages";

const Home = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { messages } = useMessages(user)

  return (
    <div className={styles.container}>
      <Head>
        <title>Devin Chat App</title>
        <meta
          name="description"
          content="This is for the almighty Devin Chat App"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading as='h1' size='3xl'>
          Chat App
        </Heading>
        <Heading as='h4' size='lg'>
          Logged in as: {user?.username}
        </Heading>
        {messages.map((message: MessageType) => (
          <div key={message.id} className="message">
            <Message message={message} />
          </div>
        ))}
      </main>
      <SocketIOClient />
      <footer className={styles.footer}>Apperators 2022</footer>
    </div>
  );
};

export default Home;

export const getServerSideProps = withSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user
  console.log('🤹‍♂️ user session:', user)
  if (user === undefined) {
    res.setHeader('location', '/login')
    res.statusCode = 302
    res.end()
    return {
      props: {
        user: { isLoggedIn: false, username: '' } as User,
      },
    }
  }

  return {
    props: { user: req.session.user },
  }
})
