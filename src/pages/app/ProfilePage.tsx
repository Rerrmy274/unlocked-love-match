import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, MapPin, User, LogOut, CheckCircle2, Plus, X, Settings, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { motion, AnimatePresence } from 'framer-motion';

export function ProfilePage() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: '',
    age: '',
    bio: '',
    location: '',
    photos: [],
    interests: [],
    gender: '',
    verified: false
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age || '',
        bio: profile.bio || '',
        location: profile.location || '',
        photos: profile.photos || [],
        interests: profile.interests || [],
        gender: profile.gender || '',
        verified: profile.verified || false
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          age: parseInt(formData.age),
          bio: formData.bio,
          location: formData.location,
          gender: formData.gender,
          interests: formData.interests,
          photos: formData.photos,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (formData.photos.length >= 6) {
      toast.error('Maximum 6 photos allowed');
      return;
    }

    setSaving(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      const updatedPhotos = [...formData.photos, publicUrl];
      
      await supabase.from('profiles').update({ photos: updatedPhotos }).eq('id', user.id);
      
      setFormData((prev: any) => ({
        ...prev,
        photos: updatedPhotos
      }));
      
      toast.success('Photo added!');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error('Error uploading image');
    } finally {
      setSaving(false);
    }
  };

  const removePhoto = async (index: number) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    
    if (user) {
      try {
        await supabase.from('profiles').update({ photos: newPhotos }).eq('id', user.id);
        setFormData({ ...formData, photos: newPhotos });
        toast.success('Photo removed');
      } catch (err) {
        toast.error('Failed to remove photo');
      }
    }
  };

  return (
    <div className="bg-gray-50/50 pt-4 pb-12">
      <div className="container max-w-2xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col items-center text-center gap-4 relative">
             <div className="absolute top-0 right-0">
               <Button variant="ghost" size="icon" className="rounded-full">
                 <Settings className="w-5 h-5 text-gray-400" />
               </Button>
             </div>
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105">
                <AvatarImage src={formData.photos?.[0]} className="object-cover" />
                <AvatarFallback className="text-2xl bg-violet-100 text-violet-600 font-bold">
                  {formData.name?.[0] || user?.email?.[0]}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 p-2.5 bg-violet-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-violet-700 transition-all border-2 border-white hover:scale-110 active:scale-90">
                <Camera className="w-5 h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{formData.name || 'Set your name'}</h1>
                {formData.verified && <CheckCircle2 className="w-5 h-5 text-violet-600 fill-violet-50" />}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-medium">
                 {profile?.role === 'admin' ? (
                   <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                     <Shield className="w-3 h-3" /> Admin
                   </span>
                 ) : (
                   <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Member</span>
                 )}
                 <span>&bull;</span>
                 <span>{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 font-bold">
                  <User className="w-5 h-5 text-violet-600" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="e.g. Sarah J."
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="h-11 focus-visible:ring-violet-600 bg-gray-50/50 border-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-xs font-bold uppercase tracking-wider text-gray-400">Age</Label>
                      <Input 
                        id="age" 
                        type="number" 
                        placeholder="18"
                        value={formData.age}
                        onChange={e => setFormData({...formData, age: e.target.value})}
                        className="h-11 focus-visible:ring-violet-600 bg-gray-50/50 border-none rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-gray-400">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <Input 
                        id="location" 
                        placeholder="Nairobi, Kenya"
                        className="h-11 pl-11 focus-visible:ring-violet-600 bg-gray-50/50 border-none rounded-xl" 
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-gray-400">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Write a little something about yourself..."
                      className="min-h-[120px] focus-visible:ring-violet-600 shadow-none border-none bg-gray-50/50 rounded-2xl resize-none p-4"
                      value={formData.bio}
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold h-12 rounded-2xl shadow-lg shadow-violet-100 transition-all hover:scale-[1.01] active:scale-95"
                    disabled={saving}
                  >
                    {saving ? <Spinner className="w-4 h-4 mr-2" /> : null}
                    {saving ? 'Saving...' : 'Update Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">My Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <AnimatePresence>
                    {formData.photos?.map((photo: string, index: number) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={photo} 
                        className="aspect-square rounded-2xl overflow-hidden relative group border border-gray-100 shadow-sm"
                      >
                        <img src={photo} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button 
                            variant="destructive" 
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {formData.photos?.length < 6 && (
                    <label className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-violet-50 transition-all hover:border-violet-300 group">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-violet-600" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-violet-600">Add Photo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                  )}
                </div>
                <p className="mt-4 text-[11px] text-gray-400 text-center font-medium">You can upload up to 6 photos. The first photo will be your main profile picture.</p>
              </CardContent>
            </Card>

            <Button 
              variant="ghost" 
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 py-7 transition-colors rounded-2xl font-bold uppercase tracking-widest text-xs"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out Account
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}