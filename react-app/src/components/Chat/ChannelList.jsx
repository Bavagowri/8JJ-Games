// react-app/src/components/Chat/ChannelList.jsx

import './ChannelList.css';

export default function ChannelList({ channels, currentChannel, onChannelChange }) {
  return (
    <div className="channel-list">
      <div className="channel-list-header">
        <h3>Channels</h3>
      </div>

      <div className="channel-items">
        {channels.map(channel => (
          <div
            key={channel.id}
            className={`channel-item ${currentChannel === channel.id ? 'active' : ''}`}
            onClick={() => onChannelChange(channel.id)}
            style={{ '--channel-color': channel.color }}
          >
            <span className="channel-icon">{channel.icon}</span>
            <div className="channel-info">
              <span className="channel-name">{channel.name}</span>
              <span className="channel-desc">{channel.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="channel-list-footer">
        <div className="user-status">
          <div className="status-indicator online"></div>
          <span>Online</span>
        </div>
      </div>
    </div>
  );
}