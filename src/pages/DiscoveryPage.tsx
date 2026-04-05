import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Info, MapPin, SlidersHorizontal, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function DiscoveryPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    // Fetch profiles that are NOT the current user and NOT already matched/passed
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .neq("id", user?.id)
      .limit(10);

    if (error) {
      toast.error("Failed to load profiles");
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  const handleLike = async () => {
    if (currentIndex >= profiles.length) return;
    const likedUser = profiles[currentIndex];
    
    // Check for mutual like (already exists a pending match from them)
    const { data: existingMatch } = await supabase
      .from("matches")
      .select("*")
      .eq("user1_id", likedUser.id)
      .eq("user2_id", user?.id)
      .single();

    if (existingMatch) {
      // It's a match!
      await supabase
        .from("matches")
        .update({ status: "accepted" })
        .eq("id", existingMatch.id);
      
      toast.success(`It's a match with ${likedUser.name}!`, {
        description: "You can now send them a message.",
        duration: 5000,
      });
    } else {
      // Create a pending match
      await supabase
        .from("matches")
        .insert({
          user1_id: user?.id as string,
          user2_id: likedUser.id,
          status: "pending"
        });
      toast.info(`Liked ${likedUser.name}`);
    }
    
    setCurrentIndex(prev => prev + 1);
  };

  const handlePass = () => {
    setCurrentIndex(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Finding profiles near you...</p>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center">
          <Search className="w-10 h-10 text-violet-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">You've seen everyone!</h2>
          <p className="text-gray-500 mt-2">Adjust your filters or check back later for new profiles.</p>
        </div>
        <Button onClick={() => { setCurrentIndex(0); fetchProfiles(); }} className="bg-violet-600">
          Refresh Discovery
        </Button>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="h-full max-w-lg mx-auto flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Discovery</h1>
        <Button variant="outline" size="icon" className="rounded-full">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        </Button>
      </div>

      <div className="relative flex-1 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile.id}
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -50 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full h-full min-h-[500px]"
          >
            <Card className="w-full h-full overflow-hidden relative shadow-xl border-none">
              {/* Profile Photo */}
              <div className="absolute inset-0 bg-gray-200">
                {currentProfile.photos?.[0] ? (
                  <img
                    src={currentProfile.photos[0]}
                    alt={currentProfile.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-violet-50">
                    <User className="w-24 h-24 text-violet-200" />
                  </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
              </div>

              {/* Profile Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                      {currentProfile.name}, {currentProfile.age}
                      {currentProfile.verified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                          </svg>
                        </div>
                      )}
                    </h2>
                    <div className="flex items-center gap-1 text-white/80 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{currentProfile.location || "Nearby"}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                    <Info className="w-6 h-6" />
                  </Button>
                </div>
                <p className="text-white/90 line-clamp-2 text-sm leading-relaxed">
                  {currentProfile.bio || "No bio yet."}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {currentProfile.interests?.slice(0, 3).map((interest) => (
                    <span key={interest} className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePass}
          className="w-16 h-16 bg-white shadow-lg rounded-full flex items-center justify-center text-red-500 border border-red-50"
        >
          <X className="w-8 h-8" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 shadow-xl shadow-violet-200 rounded-full flex items-center justify-center text-white"
        >
          <Heart className="w-10 h-10 fill-current" />
        </motion.button>
      </div>
    </div>
  );
}