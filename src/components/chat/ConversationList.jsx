import Image from "next/image";

export default function ConversationList({
  conversations,
  selectedConversationId,
  onSelect,
}) {
  if (!conversations?.length) {
    return (
      <div className="p-4 text-sm text-gray-400">
        No accepted conversations found.
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1">
      {conversations.map((conversation) => {
        const isSelected = selectedConversationId === conversation.id;

        return (
          <div
            key={conversation.id}
            className={`flex items-center p-3 cursor-pointer transition duration-200 border-l-4 ${
              isSelected ? "border-blue-500 bg-[#1A1C20]" : "border-transparent"
            }`}
            onClick={() => onSelect(conversation.id)}
          >
            <Image
              src={conversation.image || "/images/user.jpg"}
              height={40}
              width={40}
              alt={conversation.name || "User"}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />

            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {conversation.name || "Unknown"}
              </p>

              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-400 truncate">
                  {conversation.lastMessage || "No messages yet"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
              <span className="text-xs text-gray-500">
                {conversation.time || ""}
              </span>
              {conversation.unreadCount > 0 && (
                <span className="text-[10px] bg-blue-500 text-white rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
