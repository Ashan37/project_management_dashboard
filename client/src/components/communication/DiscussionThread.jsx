import { useState, useEffect, useRef } from 'react';
import { createDiscussion, getDiscussionsByProject, deleteDiscussion, addReaction } from '../../api/discussionApi';
import { useAuthStore } from '../../store/authStore';
import MentionInput from './MentionInput';

export default function DiscussionThread({ projectId, taskId = null }) {
  const [discussions, setDiscussions] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const { user } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchDiscussions();
  }, [projectId, taskId]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const res = await getDiscussionsByProject(projectId, taskId);
      setDiscussions(res.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      setSending(true);
      let finalMessage = message.trim();
      
      // If replying to someone, prepend their mention
      if (replyingTo) {
        finalMessage = `@[${replyingTo.author.name}](${replyingTo.author._id}) ${finalMessage}`;
      }
      
      await createDiscussion({
        project: projectId,
        task: taskId || undefined,
        message: finalMessage,
      });
      setMessage('');
      setReplyingTo(null);
      await fetchDiscussions();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (discussionId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteDiscussion(discussionId);
      await fetchDiscussions();
    } catch (error) {
      console.error('Error deleting discussion:', error);
      alert('Failed to delete message');
    }
  };

  const handleReaction = async (discussionId, emoji) => {
    try {
      await addReaction(discussionId, emoji);
      await fetchDiscussions();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const renderMessage = (msg) => {
    // Replace mention markup with styled spans
    const mentionRegex = /@\[([^\]]+)\]\(([a-f\d]{24})\)/g;
    return msg.replace(mentionRegex, '<span class="mention" style="color: #2563eb; font-weight: 600; background-color: #dbeafe; padding: 2px 6px; border-radius: 4px; margin: 0 2px;">@$1</span>');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading discussions...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-900">Discussion Thread</h3>
        <p className="text-xs text-gray-500">{discussions.length} messages</p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96">
        {discussions.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          discussions.map((discussion) => (
            <div
              key={discussion._id}
              className={`flex gap-3 ${
                discussion.author._id === user?._id ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  {discussion.author.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Message Content */}
              <div className={`flex-1 max-w-md ${discussion.author._id === user?._id ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {discussion.author.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(discussion.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {discussion.isEdited && (
                    <span className="text-xs text-gray-400">(edited)</span>
                  )}
                </div>

                <div
                  className={`p-3 rounded-lg ${
                    discussion.author._id === user?._id
                      ? 'bg-[#82BAC4] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div
                    className="text-sm whitespace-pre-wrap break-words"
                    dangerouslySetInnerHTML={{ __html: renderMessage(discussion.message) }}
                  />

                  {/* Attachments */}
                  {discussion.attachments && discussion.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {discussion.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs underline hover:no-underline"
                        >
                          📎 {att.filename}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reactions */}
                {discussion.reactions && discussion.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(
                      discussion.reactions.reduce((acc, r) => {
                        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(discussion._id, emoji)}
                        className="px-2 py-1 text-xs bg-white border rounded-full hover:bg-gray-50"
                      >
                        {emoji} {count}
                      </button>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setReplyingTo(discussion)}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  >
                    ↩️ Reply
                  </button>
                  <button
                    onClick={() => handleReaction(discussion._id, '👍')}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleReaction(discussion._id, '❤️')}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    ❤️
                  </button>
                  {discussion.author._id === user?._id && (
                    <button
                      onClick={() => handleDelete(discussion._id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50">
        {replyingTo && (
          <div className="flex items-center justify-between p-2 mb-2 text-sm bg-blue-50 border border-blue-200 rounded">
            <span className="text-blue-800">
              ↩️ Replying to <strong>{replyingTo.author.name}</strong>: "{replyingTo.message.substring(0, 50)}{replyingTo.message.length > 50 ? '...' : ''}"
            </span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-blue-600 hover:text-blue-800 font-bold"
            >
              ✕
            </button>
          </div>
        )}
        <MentionInput
          value={message}
          onChange={setMessage}
          onSubmit={handleSend}
          placeholder={replyingTo ? "Type your reply..." : "Type @ to mention someone..."}
          disabled={sending}
          projectId={projectId}
        />
      </div>
    </div>
  );
}
