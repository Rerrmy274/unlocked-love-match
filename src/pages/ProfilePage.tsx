import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Camera, Plus, X, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    bio: "",
    interests: [] as string[],
    photos: [] as string[],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        location: profile.location || "",
        bio: profile.bio || "",
        interests: profile.interests || [],
        photos: profile.photos || [],
      });
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender as any,
        location: formData.location,
        bio: formData.bio,
        interests: formData.interests,
        photos: formData.photos,
      })
      .eq("id", user?.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated successfully!");
      refreshProfile();
    }
    setLoading(false);
  };

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, publicUrl]
      }));
      
      toast.success("Photo uploaded!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (url: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p !== url)
    }));
  };

  const addInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = e.currentTarget.value.trim();
      if (val && !formData.interests.includes(val)) {
        setFormData(prev => ({ ...prev, interests: [...prev.interests, val] }));
        e.currentTarget.value = "";
      }
    }
  };

  const removeInterest = (val: string) => {
    setFormData(prev => ({ ...prev, interests: prev.interests.filter(i => i !== val) }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-500 mt-2">Manage your dating profile and how others see you.</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8">
        {/* Photos Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Photos ({formData.photos.length}/6)</Label>
            {profile?.verified && (
              <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
            {formData.photos.map((url, i) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 group"
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                {i === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-violet-600 text-white text-[10px] font-bold py-1 text-center">
                    MAIN PHOTO
                  </div>
                )}
              </motion.div>
            ))}
            {formData.photos.length < 6 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-violet-300 hover:bg-violet-50 transition-all">
                <input type="file" className="hidden" accept="image/*" onChange={uploadPhoto} disabled={uploading} />
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
                ) : (
                  <>
                    <div className="p-3 bg-violet-50 rounded-full mb-2">
                      <Camera className="w-6 h-6 text-violet-600" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500">Add Photo</span>
                  </>
                )}
              </label>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6 shadow-sm">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="How others see you"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Bio & Interests */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6 shadow-sm">
          <h3 className="text-lg font-semibold">Bio & Interests</h3>
          <div className="space-y-2">
            <Label htmlFor="bio">About You</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell people about yourself..."
              className="min-h-[120px] resize-none"
            />
          </div>
          <div className="space-y-4">
            <Label>Interests</Label>
            <Input
              placeholder="Type and press Enter to add interests"
              onKeyDown={addInterest}
            />
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {interest}
                  <button type="button" onClick={() => removeInterest(interest)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {formData.interests.length === 0 && (
                <p className="text-sm text-gray-400">Add interests like "Hiking", "Cooking", "Travel"...</p>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-lg font-bold" disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          Save Changes
        </Button>
      </form>
    </div>
  );
}