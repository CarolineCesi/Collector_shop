import { useState } from "react";
import { Search, MoreVertical, Send, Paperclip, CheckCheck, DollarSign } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useUser } from "../context/UserContext";
import { useI18n } from "../context/I18nContext";

type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerAmount?: string;
};

type Conversation = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  itemImage: string;
  itemTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
};

// Données mock en dur
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    userId: "user2",
    userName: "RetroVault",
    userAvatar: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxsZXIlMjBwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODcxNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    itemImage: "https://images.unsplash.com/photo-1576884456974-5d4f358a61c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXJlJTIwdmludGFnZSUyMHNuZWFrZXIlMjBzaG9lfGVufDF8fHx8MTc3MTg3MTQ2NHww&ixlib=rb-4.1.0&q=80&w=1080",
    itemTitle: "Nike Air Jordan 1 Original (1985)",
    lastMessage: "Je peux vous faire une offre à $7,800 ?",
    lastMessageTime: "14:32",
    unreadCount: 2,
    messages: [
      { id: "m1", senderId: "user2", text: "Bonjour ! Est-ce que la paire est toujours disponible ?", timestamp: "14:20" },
      { id: "m2", senderId: "me", text: "Oui, elle est toujours en vente. Mint condition, dans sa boîte d'origine.", timestamp: "14:25" },
      { id: "m3", senderId: "user2", text: "Super ! L'état a l'air impeccable sur les photos.", timestamp: "14:28" },
      { id: "m4", senderId: "user2", text: "Je peux vous faire une offre à $7,800 ?", timestamp: "14:32", isOffer: true, offerAmount: "$7,800" },
    ],
  },
  {
    id: "conv2",
    userId: "user3",
    userName: "ToyGalaxy",
    userAvatar: "https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODUyMjg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    itemImage: "https://images.unsplash.com/photo-1759680190851-199358b2cd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYWN0aW9uJTIwZmlndXJlJTIwdG95fGVufDF8fHx8MTc3MTgyNzc0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    itemTitle: "Star Wars Kenner Action Figure (1978)",
    lastMessage: "Merci pour l'envoi rapide ! 🙏",
    lastMessageTime: "Hier",
    unreadCount: 0,
    messages: [
      { id: "m5", senderId: "me", text: "La figurine a été expédiée aujourd'hui, vous devriez la recevoir dans 3-5 jours.", timestamp: "10:15" },
      { id: "m6", senderId: "user3", text: "Merci pour l'envoi rapide ! 🙏", timestamp: "10:45" },
    ],
  },
  {
    id: "conv3",
    userId: "user4",
    userName: "PixelVault",
    userAvatar: "https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODUyMjg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    itemImage: "https://images.unsplash.com/photo-1605134550917-5fe8cf25a125?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGdhbWUlMjBjb25zb2xlJTIwdGVjaHxlbnwxfHx8fDE3NzE4NzE0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    itemTitle: "Nintendo NES (Sealed in Box)",
    lastMessage: "Est-ce que vous acceptez les échanges ?",
    lastMessageTime: "Lun",
    unreadCount: 1,
    messages: [
      { id: "m7", senderId: "user4", text: "Salut ! Superbe NES. Je suis très intéressé.", timestamp: "09:00" },
      { id: "m8", senderId: "me", text: "Merci ! N'hésitez pas si vous avez des questions.", timestamp: "09:30" },
      { id: "m9", senderId: "user4", text: "Est-ce que vous acceptez les échanges ?", timestamp: "10:00" },
    ],
  },
];

export function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [activeTab, setActiveTab] = useState("All");
  const [messageInput, setMessageInput] = useState("");
  const { userId } = useUser();
  const { t } = useI18n();

  const selectedConversation = conversations.find((c: Conversation) => c.id === selectedConversationId);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessageText = messageInput;
    setMessageInput("");

    const newMsg: Message = {
      id: "msg-" + Date.now(),
      senderId: userId || "me",
      text: newMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations((prev: Conversation[]) => prev.map((conv: Conversation) => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          lastMessage: newMessageText,
          lastMessageTime: newMsg.timestamp,
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-80px)]">
      <div className="flex h-full bg-cyan-900/20 border border-cyan-800/50 rounded-2xl overflow-hidden shadow-2xl">

        {/* Left Sidebar: Conversation List */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-cyan-800/50 flex flex-col bg-cyan-950/50 ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-cyan-800/50">
            <h1 className="text-xl font-bold text-stone-100 mb-4">{t('messages.title')}</h1>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/60" size={16} />
              <input
                type="text"
                placeholder={t('messages.searchInbox')}
                className="w-full bg-cyan-900/40 border border-cyan-800 rounded-lg py-2 pl-9 pr-4 text-sm text-stone-100 focus:outline-none focus:border-amber-400 placeholder:text-cyan-400/40"
              />
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-cyan-900/40 rounded-lg">
              {[{ key: 'all', label: t('messages.all') }, { key: 'buying', label: t('messages.buying') }, { key: 'selling', label: t('messages.selling') }].map(({ key, label: tabLabel }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all
                    ${activeTab === key
                      ? "bg-cyan-800 text-stone-100 shadow-sm"
                      : "text-cyan-400 hover:text-stone-200"}`}
                >
                  {tabLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv: Conversation) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`w-full p-4 flex gap-3 border-b border-cyan-800/30 hover:bg-cyan-900/30 transition-colors text-left
                  ${selectedConversationId === conv.id ? "bg-cyan-900/40 border-l-2 border-l-amber-400" : "border-l-2 border-l-transparent"}`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-cyan-700">
                    <ImageWithFallback src={conv.userAvatar} alt={conv.userName} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-md overflow-hidden border border-cyan-950 shadow-sm">
                    <ImageWithFallback src={conv.itemImage} alt="item" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="font-semibold text-stone-100 truncate text-sm">{conv.userName}</span>
                    <span className="text-xs text-cyan-400 whitespace-nowrap ml-2">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-cyan-300 truncate mb-1">{conv.itemTitle}</p>
                  <p className={`text-sm truncate ${conv.unreadCount > 0 ? "text-stone-100 font-medium" : "text-stone-400"}`}>
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Main: Chat Area */}
        <div className={`flex-1 flex flex-col h-full bg-cyan-950 ${!selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
          {/* Chat Header */}
          <div className="h-16 border-b border-cyan-800/50 flex items-center justify-between px-6 bg-cyan-900/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedConversationId("")}
                className="md:hidden text-cyan-400 mr-2"
              >
                {t('messages.back')}
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-700">
                {selectedConversation ? <ImageWithFallback src={selectedConversation.userAvatar} alt={selectedConversation.userName} className="w-full h-full object-cover" /> : null}
              </div>
              <div>
                <h2 className="font-bold text-stone-100 text-sm">{selectedConversation?.userName || t('messages.selectConversation')}</h2>
                <div className="flex items-center gap-1.5 text-xs text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {t('messages.online')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="hidden sm:flex items-center gap-2 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-amber-400/20 transition-colors">
                <DollarSign size={16} />
                {t('messages.makeOffer')}
              </button>
              <button className="text-cyan-400 hover:text-stone-100">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {selectedConversation?.messages.map((msg: Message) => {
              const isMe = msg.senderId === userId || msg.senderId === "me";
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] sm:max-w-[60%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm relative
                        ${isMe
                          ? "bg-amber-400 text-cyan-950 rounded-tr-sm font-medium"
                          : "bg-cyan-800 text-stone-100 rounded-tl-sm"}`}
                    >
                      {msg.text}
                      {msg.isOffer && (
                        <div className="mt-3 bg-white/20 p-3 rounded-lg backdrop-blur-sm border border-black/5">
                          <p className="font-bold text-lg">{msg.offerAmount}</p>
                          <p className="text-xs opacity-80">{t('messages.offerReceived')}</p>
                          {!isMe && (
                            <div className="flex gap-2 mt-2">
                              <button className="bg-cyan-950 text-white px-3 py-1 rounded text-xs font-bold">{t('messages.accept')}</button>
                              <button className="bg-transparent border border-cyan-950/30 px-3 py-1 rounded text-xs font-bold">{t('messages.decline')}</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-cyan-500/60 mt-1 px-1 flex items-center gap-1">
                      {msg.timestamp}
                      {isMe && <CheckCheck size={12} className="text-amber-400/70" />}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-cyan-900/10 border-t border-cyan-800/50">
            <div className="flex items-end gap-2 bg-cyan-900/40 border border-cyan-800 rounded-xl p-2 focus-within:border-amber-400/50 focus-within:ring-1 focus-within:ring-amber-400/30 transition-all">
              <button className="p-2 text-cyan-400 hover:text-stone-100 rounded-lg hover:bg-cyan-800/50 transition-colors">
                <Paperclip size={20} />
              </button>
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={t('messages.typePlaceholder')}
                className="flex-1 bg-transparent border-none focus:ring-0 text-stone-100 text-sm py-2 max-h-32 resize-none placeholder:text-cyan-400/40"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="p-2 bg-amber-400 text-cyan-950 rounded-lg font-bold hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
