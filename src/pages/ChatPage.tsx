import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Image as ImageIcon, Smile, MessageCircle, ChevronLeft, User, ShieldAlert, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { Database } from "@/types/database.types";

type Match = Database["public"]["Tables"]["matches"]["Row"] & {
  profiles: Database["public"]["Tables"]["profiles"]["Row"];
};

type Message = Database["public"]["Tables"]["messages"]["Row"];

export function ChatPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMatches, setLoadingMatches] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchMessages(selectedMatch.id);
      
      // Subscribe to real-time messages
      const channel = supabase
        .channel(`match-${selectedMatch.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `match_id=eq.${selectedMatch.id}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedMatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMatches = async () => {
    setLoadingMatches(true);
    // Find matches where user is either user1 or user2 and status is accepted
    const { data, error } = await supabase
      .from("matches")
      .select(`
        *,
        user1_profile:profiles!matches_user1_id_fkey(*),
        user2_profile:profiles!matches_user2_id_fkey(*)
      `)
      .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
      .eq("status", "accepted");

    if (error) {
      toast.error("Failed to load matches");
    } else {
      const processedMatches = data.map(m => ({
        ...m,
        profiles: m.user1_id === user?.id ? (m as any).user2_profile : (m as any).user1_profile
      })) as unknown as Match[];
      setMatches(processedMatches);
    }
    setLoadingMatches(false);
  };

  const fetchMessages = async (matchId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("match_id", matchId)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Failed to load messages");
    } else {
      setMessages(data || []);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch) return;

    const messageToSend = newMessage;
    setNewMessage("");

    const { error } = await supabase.from("messages").insert({
      match_id: selectedMatch.id,
      sender_id: user?.id as string,
      text: messageToSend,
    });

    if (error) {
      toast.error("Failed to send message");
      setNewMessage(messageToSend);
    }
  };

  const handleReport = async () => {
    if (!selectedMatch) return;
    const { error } = await supabase.from("reports").insert({
      reporter_id: user?.id as string,
      reported_id: selectedMatch.profiles.id,
      reason: "User misconduct during chat",
    });

    if (error) toast.error("Report failed");
    else toast.success("User reported. Our safety team will review.");
  };

  return (
    <div className="h-full max-w-5xl mx-auto flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
      {/* Matches List */}
      <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${selectedMatch ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-gray-50">
          <h1 className="text-xl font-bold text-gray-900">Matches</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingMatches ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-500">Loading your matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm font-medium">No matches yet. Keep swiping!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {matches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className={`w-full p-4 flex items-center gap-4 transition-colors hover:bg-gray-50 ${
                    selectedMatch?.id === match.id ? 'bg-violet-50/50' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
                      {match.profiles?.photos?.[0] ? (
                        <img src={match.profiles.photos[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-full h-full p-2 text-gray-400" />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">{match.profiles?.name || "Member"}</p>
                    <p className="text-xs text-gray-500 truncate">Tap to message</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-white ${!selectedMatch ? 'hidden md:flex' : 'flex'}`}>
        {selectedMatch ? (
          <>
            {/* Chat Header */}
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedMatch(null)}>
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {selectedMatch.profiles?.photos?.[0] ? (
                    <img src={selectedMatch.profiles.photos[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-full h-full p-2 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedMatch.profiles?.name || "Member"}</h3>
                  <p className="text-xs text-green-500 font-medium">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={handleReport} title="Report User">
                  <ShieldAlert className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50/30">
              {messages.map((msg) => {
                const isMine = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] space-y-1`}>
                      <div className={`px-4 py-2 rounded-2xl shadow-sm ${
                        isMine 
                          ? 'bg-violet-600 text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}>
                        <p className="text-[15px] leading-relaxed">{msg.text}</p>
                      </div>
                      <p className={`text-[10px] ${isMine ? 'text-right' : 'text-left'} text-gray-400 font-medium`}>
                        {formatDistanceToNow(new Date(msg.created_at || ""), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <form onSubmit={sendMessage} className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="text-gray-400 shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 shrink-0">
                  <Smile className="w-5 h-5" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border-gray-100 focus-visible:ring-violet-600 h-11 rounded-full"
                />
                <Button type="submit" disabled={!newMessage.trim()} className="rounded-full bg-violet-600 w-11 h-11 p-0 shrink-0">
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 text-violet-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Conversations</h2>
            <p className="text-gray-500 max-w-xs">
              Select a match from the sidebar to start chatting and get to know them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}