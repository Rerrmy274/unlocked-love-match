import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, Info, MapPin, Briefcase, Filter, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  location: string;
  gender: string;
  interests: string[];
}

export function DiscoveryPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  const fetchProfiles = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // First, get IDs of people the user has already interacted with (liked/passed)
      const { data: interactedIds } = await supabase
        .from('matches')
        .select('user1_id, user2_id')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      const excludedIds = [user.id];
      if (interactedIds) {
        interactedIds.forEach(m => {
          excludedIds.push(m.user1_id === user.id ? m.user2_id : m.user1_id);
        });
      }

      // Query profiles that are NOT in the excluded list
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${excludedIds.join(',')})`)
        .limit(20);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Fallback to demo data if no more matches found in DB
        setProfiles([
          {
            id: 'demo-1',
            name: 'Sarah',
            age: 24,
            bio: "Adventure seeker and coffee enthusiast. I love hiking and photography. Nairobi based.",
            photos: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/70919663-df63-472c-a5c3-f705cfa318e9/sarah-profile-photo-b678ff26-1775369840684.webp'],
            location: 'Nairobi',
            gender: 'female',
            interests: ['Travel', 'Art', 'Coffee']
          },
          {
            id: 'demo-2',
            name: 'David',
            age: 28,
            bio: "Tech by day, musician by night. Always down for a live concert and beach walks.",
            photos: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/70919663-df63-472c-a5c3-f705cfa318e9/david-profile-photo-6aef50a3-1775369840641.webp'],
            location: 'Mombasa',
            gender: 'male',
            interests: ['Music', 'Coding', 'Beaches']
          },
          {
            id: 'demo-3',
            name: 'Elena',
            age: 22,
            bio: "Law student with a passion for cooking and wine tasting. Let's explore!",
            photos: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/70919663-df63-472c-a5c3-f705cfa318e9/elena-profile-photo-6160ebe4-1775369840254.webp'],
            location: 'Kisumu',
            gender: 'female',
            interests: ['Cooking', 'Books', 'Wine']
          },
          {
            id: 'demo-4',
            name: 'Michael',
            age: 26,
            bio: "Creative mind working in digital design. Passionate about fitness and local art.",
            photos: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/70919663-df63-472c-a5c3-f705cfa318e9/michael-profile-photo-4da0df6d-1775369839933.webp'],
            location: 'Nairobi',
            gender: 'male',
            interests: ['Design', 'Gym', 'Art']
          }
        ]);
      } else {
        setProfiles(data as Profile[]);
      }
    } catch (error: any) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile || !user) return;

    if (direction === 'right') {
      try {
        // Use RPC handle_like for atomicity and match detection
        const { data: matchResult, error } = await supabase.rpc('handle_like', {
          target_user_id: currentProfile.id
        });

        if (error) throw error;

        if (matchResult === 'match') {
          toast.success(`It's a Match! You and ${currentProfile.name} liked each other.`, {
            icon: <Heart className="w-5 h-5 text-rose-500 fill-current" />,
            duration: 5000,
          });
        } else {
          toast.success(`Liked ${currentProfile.name}!`);
        }
      } catch (err: any) {
        console.error('Error liking profile:', err);
        toast.error('Could not send like');
      }
    } else {
      // If passing, still record it in matches with status 'rejected'
      try {
        await supabase.from('matches').insert({
          user1_id: user.id,
          user2_id: currentProfile.id,
          status: 'rejected'
        });
      } catch (err) {
        console.error('Error recording pass:', err);
      }
    }

    setCurrentIndex(prev => prev + 1);
    x.set(0);
  };

  const activeProfile = profiles[currentIndex];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Spinner className="size-10 text-violet-600 mx-auto" />
          <p className="text-gray-500 font-medium">Finding people nearby...</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 text-violet-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">No more profiles!</h2>
            <p className="text-gray-500">You've seen everyone in your area. Check back later or adjust your filters.</p>
          </div>
          <Button 
            onClick={() => { setCurrentIndex(0); fetchProfiles(); }}
            className="bg-violet-600 hover:bg-violet-700 w-full rounded-full h-12 transition-all hover:scale-105 active:scale-95"
          >
            Refresh Feed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pt-4 pb-24 overflow-hidden min-h-screen">
      <div className="container max-w-lg mx-auto h-[calc(100vh-14rem)] flex flex-col items-center justify-center px-4 relative">
        <div className="w-full flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Discover
          </h1>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-white/50 rounded-full">
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        <div className="relative w-full aspect-[3/4] max-h-[550px]">
          <AnimatePresence>
            {activeProfile && (
              <motion.div
                key={activeProfile.id}
                style={{ x, rotate, opacity }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_e, info) => {
                  if (info.offset.x > 100) handleSwipe('right');
                  else if (info.offset.x < -100) handleSwipe('left');
                }}
                className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
              >
                <Card className="h-full w-full overflow-hidden border-none shadow-2xl rounded-3xl relative">
                  <img
                    src={activeProfile.photos?.[0] || 'https://via.placeholder.com/400x600'}
                    alt={activeProfile.name}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2 pointer-events-none">
                    <div className="flex items-end gap-3">
                      <h2 className="text-3xl font-bold">{activeProfile.name}, {activeProfile.age}</h2>
                      <div className="bg-green-500 w-3 h-3 rounded-full mb-2 border-2 border-white shadow-sm" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-200">
                      <MapPin className="w-4 h-4" />
                      {activeProfile.location || 'Nearby'}
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{activeProfile.bio}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-black/20 backdrop-blur-md text-white border-none hover:bg-black/40 rounded-full z-20"
                    onClick={() => setSelectedProfile(activeProfile)}
                  >
                    <Info className="w-5 h-5" />
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {currentIndex + 1 < profiles.length && (
            <div className="absolute inset-0 z-0 scale-95 opacity-50 translate-y-4">
              <Card className="h-full w-full overflow-hidden border-none shadow-xl rounded-3xl">
                <img
                  src={profiles[currentIndex + 1].photos?.[0] || 'https://via.placeholder.com/400x600'}
                  alt="Next profile"
                  className="w-full h-full object-cover"
                />
              </Card>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-8 mt-10 w-full">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 hover:text-red-600 border border-gray-100 transition-colors"
          >
            <X className="w-8 h-8" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('right')}
            className="w-20 h-20 rounded-full bg-violet-600 shadow-xl shadow-violet-200 flex items-center justify-center text-white hover:bg-violet-700 transition-colors"
          >
            <Heart className="w-10 h-10 fill-current" />
          </motion.button>
        </div>
      </div>

      <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-3xl">
          {selectedProfile && (
            <div className="max-h-[80vh] overflow-y-auto scrollbar-hide">
              <div className="aspect-[3/4] relative">
                <img
                  src={selectedProfile.photos?.[0] || 'https://via.placeholder.com/400x600'}
                  alt={selectedProfile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-3xl font-bold">{selectedProfile.name}, {selectedProfile.age}</h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-violet-600" />
                    About Me
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProfile.bio || 'No bio provided yet.'}</p>
                </div>
                
                {selectedProfile.interests && selectedProfile.interests.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.interests.map(interest => (
                        <span key={interest} className="px-3 py-1 bg-violet-50 text-violet-600 text-xs font-semibold rounded-full border border-violet-100">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3 border border-gray-100">
                    <MapPin className="w-5 h-5 text-violet-600" />
                    <span className="text-sm font-medium">{selectedProfile.location || 'Nairobi'}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3 border border-gray-100">
                    <Briefcase className="w-5 h-5 text-violet-600" />
                    <span className="text-sm font-medium">Professional</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-12 shadow-lg shadow-violet-100 transition-all hover:scale-[1.02] active:scale-95"
                    onClick={() => {
                      handleSwipe('right');
                      setSelectedProfile(null);
                    }}
                  >
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Send Like
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-12 w-12 rounded-xl p-0 border-gray-200"
                    onClick={() => {
                      toast.info("Instant messaging is coming soon!");
                    }}
                  >
                    <MessageSquare className="w-5 h-5 text-gray-500" />
                  </Button>
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                  onClick={async () => {
                    if (!user) return;
                    try {
                      await supabase.from('reports').insert({
                        reporter_id: user.id,
                        reported_id: selectedProfile.id,
                        reason: 'Reported from profile modal'
                      });
                      toast.error(`Reported ${selectedProfile.name}`);
                      setSelectedProfile(null);
                      handleSwipe('left');
                    } catch (err) {
                      toast.error('Failed to report');
                    }
                  }}
                >
                  Report User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}