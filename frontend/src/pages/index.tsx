import MessageForm from 'components/MessageForm';
import MessagesList from 'components/MessageList';
import { NextPage } from 'next';
import { ChatProvider } from 'utils/useChatContext';
import Layout from '../components/Layout';

const IndexPage: NextPage = () => {
  return (
    <ChatProvider>
      <Layout>
        <MessagesList />
        <MessageForm />
      </Layout>
    </ChatProvider>
  );
};

export default IndexPage;
