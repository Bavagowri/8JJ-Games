// react-app/src/pages/Community/CommunityPage.jsx

import ChatContainer from '../../components/Chat/ChatContainer';
import SEO from '../../components/SEO/SEO';
import './CommunityPage.css';

export default function CommunityPage() {
  return (
    <>
      <SEO
        title="Community Chat - 8jj-games"
        description="Join the 8jj-games community! Chat with other players, share tips, and discuss your favorite games in real-time."
        keywords="gaming community, game chat, online gaming community, player chat"
      />

      <div className="community-page">
        <div className="community-header">
          <h1>💬 Community Chat</h1>
          <p>Connect with other players in real-time!</p>
        </div>

        <ChatContainer />
      </div>
    </>
  );
}