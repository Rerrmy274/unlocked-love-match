import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Image as ImageIcon, MoreVertical, ChevronLeft, Flag, Ban, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

interface Match {
  id: string;
  other_user: {
    id: string;
    name: string;
    photos: string[];
  };
  last_message?: string;
  last_message_time?: string;
}

export function ChatPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMatches();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedMatch) {
      fetchMessages(selectedMatch.id);
      
      const channel = supabase
        .channel(`match:${selectedMatch.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${selectedMatch.id}`
        }, (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => {
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedMatch]);

  const fetchMatches = async () => {
    if (!user) return;
    try {
      // Fetch matches where status is 'accepted'
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          user1_id,
          user2_id,
          user1:profiles!matches_user1_id_fkey(id, name, photos),
          user2:profiles!matches_user2_id_fkey(id, name, photos)
        `)
        .eq('status', 'accepted')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Only show demo if no real matches exist
        setMatches([
          {
            id: 'demo-m1',
            other_user: { id: 'u1', name: 'Sarah', photos: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/70919663-df63-472c-a5c3-f705cfa318e9/sarah-profile-photo-b678ff26-1775369840684.webp'] },
            last_message: 'Hey, how are you?',
            last_message_time: new Date().toISOString()
          },
          {
            id: 'demo-m2',
            other_user: { id: 'u2', name: 'Elena', photos: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/70919663-df63-472c-a5c3-f705cfa318e9/elena-profile-photo-6160ebe4-1775369840254.webp'] },
            last_message: 'That sounds great!',
            last_message_time: new Date().toISOString()
          }
        ]);
      } else {
        const formattedMatches = data.map((m: any) => ({
          id: m.id,
          other_user: m.user1_id === user.id ? m.user2 : m.user1,
          last_message: 'Click to start chatting',
          last_message_time: new Date().toISOString()
        }));
        setMatches(formattedMatches);
      }
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (matchId: string) => {
    if (matchId.startsWith('demo')) {
      setMessages([
        { id: '1', sender_id: 'u1', text: 'Hey there! Nice to meet you.', created_at: new Date(Date.now() - 10000).toISOString() },
        { id: '2', sender_id: user?.id || 'me', text: 'Hey Sarah! How is it going?', created_at: new Date(Date.now() - 5000).toISOString() }
      ]);
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }
    setMessages(data || []);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch || !user) return;

    if (selectedMatch.id.startsWith('demo')) {
      const demoMsg: Message = {
        id: Math.random().toString(),
        sender_id: user.id,
        text: newMessage,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, demoMsg]);
      setNewMessage('');
      return;
    }

    const messageText = newMessage;
    setNewMessage('');

    const { error } = await supabase.from('messages').insert({
      match_id: selectedMatch.id,
      sender_id: user.id,
      text: messageText,
    });

    if (error) {
      toast.error('Failed to send message');
      setNewMessage(messageText);
    }
  };

  const handleBlock = async () => {
    if (!selectedMatch || !user) return;
    try {
      await supabase.from('blocked_users').insert({
        blocker_id: user.id,
        blocked_id: selectedMatch.other_user.id
      });
      toast.success(`${selectedMatch.other_user.name} blocked`);
      setSelectedMatch(null);
      fetchMatches();
    } catch (err) {
      toast.error('Failed to block user');
    }
  };

  const handleReport = async () => {
    if (!selectedMatch || !user) return;
    try {
      await supabase.from('reports').insert({
        reporter_id: user.id,
        reported_id: selectedMatch.other_user.id,
        reason: 'Reported from chat'
      });
      toast.success('Report submitted');
    } catch (err) {
      toast.error('Failed to report user');
    }
  };

  return (
    <div className="bg-gray-50/30 pt-4 pb-4 h-[calc(100vh-10rem)]">
      <div className="container mx-auto h-full flex shadow-xl border border-gray-100 rounded-3xl overflow-hidden bg-white">
        {/* Match List Sidebar */}
        <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${selectedMatch ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
              <span className="text-xs font-bold text-violet-600">{matches.length}</span>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              <AnimatePresence>
                {matches.map(match => (
                  <motion.button
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={match.id}
                    onClick={() => setSelectedMatch(match)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
                      selectedMatch?.id === match.id 
                        ? 'bg-violet-50 ring-1 ring-violet-100' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12 ring-2 ring-violet-100 shrink-0">
                        <AvatarImage src={match.other_user.photos?.[0]} />
                        <AvatarFallback className="bg-violet-100 text-violet-600 font-bold">{match.other_user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 text-left overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 truncate">{match.other_user.name}</h3>
                        <span className="text-[10px] text-gray-400">12:30</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{match.last_message}</p>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
              {matches.length === 0 && !loading && (
                <div className="p-10 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No matches yet. <br/>Keep swiping to find someone!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 flex flex-col ${!selectedMatch ? 'hidden md:flex bg-gray-50/50' : 'flex'}`}>
          {selectedMatch ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col h-full"
            >
              <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden" 
                    onClick={() => setSelectedMatch(null)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Avatar className="w-10 h-10 ring-2 ring-violet-50">
                    <AvatarImage src={selectedMatch.other_user.photos?.[0]} />
                    <AvatarFallback>{selectedMatch.other_user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedMatch.other_user.name}</h3>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 rounded-full">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem onClick={handleReport} className="text-gray-600 cursor-pointer">
                      <Flag className="w-4 h-4 mr-2" /> Report User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBlock} className="text-red-500 focus:text-red-500 cursor-pointer">
                      <Ban className="w-4 h-4 mr-2" /> Block User
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-600 cursor-pointer">
                      <Trash2 className="w-4 h-4 mr-2" /> Clear Chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <ScrollArea className="flex-1 p-4 md:p-6 bg-gray-50/30">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <span className="text-[10px] bg-white border border-gray-100 text-gray-400 font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                      Today
                    </span>
                  </div>
                  
                  {messages.map((msg, index) => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        key={msg.id || index}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] md:max-w-[70%] group relative`}>
                          <div className={`px-4 py-3 rounded-2xl text-[13px] shadow-sm leading-relaxed ${
                            isMe 
                              ? 'bg-violet-600 text-white rounded-tr-none' 
                              : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'
                          }`}>
                            <p>{msg.text}</p>
                          </div>
                          <p className={`text-[9px] mt-1 font-bold ${isMe ? 'text-violet-400 text-right' : 'text-gray-400 text-left'}`}>
                            {format(new Date(msg.created_at), 'HH:mm')}
                            {isMe && <span className="ml-1 opacity-60">✓✓</span>}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={sendMessage} className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-violet-600 rounded-full">
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-gray-50 border-none h-11 focus-visible:ring-violet-600 rounded-full px-5 text-sm shadow-inner"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className={`rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-all ${
                      newMessage.trim() 
                        ? 'bg-violet-600 text-white shadow-violet-200' 
                        : 'bg-gray-100 text-gray-400 shadow-none'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/50">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 bg-violet-100/50 rounded-full flex items-center justify-center mb-6"
              >
                <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center shadow-xl shadow-violet-200">
                  <MessageSquare className="w-8 h-8 text-white fill-current" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900">Your Connections</h3>
              <p className="text-gray-500 max-w-xs mt-2 text-sm leading-relaxed">
                Select a match from the sidebar to start chatting. <br/>Your next great connection is just a message away.
              </p>
              <Button 
                variant="outline" 
                className="mt-8 rounded-full border-violet-200 text-violet-600 hover:bg-violet-50"
                onClick={() => toast.info("Check back later for new notifications!")}
              >
                View Notifications
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}