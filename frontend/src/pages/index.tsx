import { NextPage } from 'next';
import { ChatProvider } from 'utils/useChatContext';
import LayoutClean from '../components/LayoutClean';

const IndexPage: NextPage = () => {
  return (
    <ChatProvider>
      <LayoutClean />
    </ChatProvider>
  );
};

export default IndexPage;
