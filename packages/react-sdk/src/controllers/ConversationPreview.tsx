import type { Conversation } from "@xmtp/xmtp-js";
import { SortDirection } from "@xmtp/xmtp-js";
import { useCallback, useEffect, useState } from "react";
import { ConversationPreviewCard } from "../components/ConversationPreviewCard";

export type ConversationPreviewProps = {
  /**
   * Conversation to preview
   */
  conversation: Conversation;
  /**
   * Is conversation selected?
   */
  isSelected?: boolean;
  /**
   * What happens when you click on the conversation?
   */
  onClick?: (conversation: Conversation) => void;
};

/**
 * This component fetches the most recent conversation message and uses it to
 * render a conversation preview.
 */
export const ConversationPreview: React.FC<ConversationPreviewProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMostRecentMessage = async () => {
      setIsLoading(true);
      const messages = await conversation.messages({
        limit: 1,
        direction: SortDirection.SORT_DIRECTION_DESCENDING,
      });
      setIsLoading(false);
      setMessage(messages.length > 0 ? (messages[0].content as string) : "");
    };
    void fetchMostRecentMessage();
  }, [conversation]);

  const handlePreviewClick = useCallback(() => {
    onClick?.(conversation);
  }, [conversation, onClick]);

  return (
    <ConversationPreviewCard
      datetime={conversation.createdAt}
      displayAddress={conversation.peerAddress}
      isLoading={isLoading}
      isSelected={isSelected}
      onClick={handlePreviewClick}
      text={message}
    />
  );
};
