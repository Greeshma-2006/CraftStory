import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { artisanService } from '../services';
import ImageUploader from '../components/upload/ImageUploader';
import { CheckCircle } from 'lucide-react';

// ── Single image picker ───────────────────────────────────────────────────────
const ImagePicker = ({ images, selected, onSelect, label, hint }) => {
  if (!images || images.length === 0) return null;
  return (
    <div>
      <p className="text-sm font-semibold text-[#6B3E2E] mb-1">{label}</p>
      <p className="text-xs text-[#6B3E2E]/60 mb-3">{hint}</p>
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <button key={i} type="button" onClick={() => onSelect(url)}
            className={`relative w-20 h-20 rounded-xl overflow-hidden border-4 transition-all ${
              selected === url
                ? 'border-[#C96A4A] scale-105 shadow-lg'
                : 'border-[#E5D4C8] hover:border-[#C96A4A]/50'
            }`}
          >
            <img src={url} alt={`option-${i+1}`} className="w-full h-full object-cover" />
            {selected === url && (
              <div className="absolute inset-0 bg-[#C96A4A]/20 flex items-center justify-center">
                <CheckCircle size={20} className="text-white drop-shadow" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ArtisanProfileSetup = () => {
  const [loading,         setLoading]         = useState(false);
  const [profileExists,   setProfileExists]   = useState(false);
  const [status,          setStatus]          = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const [formData, setFormData] = useState({
    firstName:            '',
    lastName:             '',
    email:                '',
    phone:                '',
    story:                '',
    artisanImages:        [],
    craftImages:          [],
    featuredArtisanImage: '',
    featuredCraftImage:   '',
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res     = await artisanService.getMyProfile();
      const profile = res.data.data;
      setProfileExists(true);

      const artisanImgs = Array.isArray(profile.artisanImages)
        ? profile.artisanImages
        : profile.artisanImage ? [profile.artisanImage] : [];

      const craftImgs = Array.isArray(profile.craftImages)
        ? profile.craftImages
        : profile.craftImage ? [profile.craftImage] : [];

      setFormData({
        firstName:            profile.firstName            || '',
        lastName:             profile.lastName             || '',
        email:                profile.email                || '',
        phone:                profile.phone                || '',
        story:                profile.story                || '',
        artisanImages:        artisanImgs,
        craftImages:          craftImgs,
        featuredArtisanImage: profile.featuredArtisanImage || artisanImgs[0] || '',
        featuredCraftImage:   profile.featuredCraftImage   || craftImgs[0]   || '',
      });

      setStatus(profile.status);
      setRejectionReason(profile.rejectionReason || '');
    } catch {
      setProfileExists(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.story) {
      toast.error('Please complete all text fields'); return false;
    }
    if (formData.artisanImages.length < 2) {
      toast.error('Please upload at least 2 Artisan / Workplace images'); return false;
    }
    if (formData.craftImages.length < 2) {
      toast.error('Please upload at least 2 Craft / Product / Work images'); return false;
    }
    if (!formData.featuredArtisanImage) {
      toast.error('Please select a profile circle image from your artisan photos'); return false;
    }
    if (!formData.featuredCraftImage) {
      toast.error('Please select a cover background image from your craft photos'); return false;
    }
    return true;
  };

  const handleArtisanImagesChange = (urls) => {
    // If selected featured was removed, reset it
    const featured = urls.includes(formData.featuredArtisanImage)
      ? formData.featuredArtisanImage
      : urls[0] || '';
    setFormData({ ...formData, artisanImages: urls, featuredArtisanImage: featured });
  };

  const handleCraftImagesChange = (urls) => {
    const featured = urls.includes(formData.featuredCraftImage)
      ? formData.featuredCraftImage
      : urls[0] || '';
    setFormData({ ...formData, craftImages: urls, featuredCraftImage: featured });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      if (profileExists) {
        await artisanService.updateProfile(formData);
        toast.success('Profile updated successfully');
      } else {
        await artisanService.createProfile(formData);
        setProfileExists(true);
        setStatus('pending');
        toast.success('Profile submitted for approval');
      }
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = async () => {
    try {
      setLoading(true);
      await artisanService.updateProfile(formData);
      await artisanService.resubmitProfile();
      setStatus('pending');
      setRejectionReason('');
      toast.success('Profile resubmitted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Resubmission failed');
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (!profileExists)        return 'Ask For Approval';
    if (status === 'approved') return 'Update Profile';
    if (status === 'pending')  return 'Update Pending Profile';
    if (status === 'revoked')  return 'Update Profile';
    if (status === 'rejected') return 'Save Changes';
    return 'Submit';
  };

  const bothUploaded = formData.artisanImages.length >= 2 && formData.craftImages.length >= 2;

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-20">
      <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl p-10">

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#6B3E2E] mb-4">
            Complete Your Artisan Profile
          </h1>
          <p className="text-[#6B3E2E]/80">
            Share your story, craft heritage, inspirations and handmade journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* NAME */}
          <div className="grid md:grid-cols-2 gap-6">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
              placeholder="First Name"
              className="w-full border border-[#E5D4C8] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
              placeholder="Last Name"
              className="w-full border border-[#E5D4C8] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" />
          </div>

          {/* CONTACT */}
          <div className="grid md:grid-cols-2 gap-6">
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Email Address"
              className="w-full border border-[#E5D4C8] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border border-[#E5D4C8] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" />
          </div>

          {/* STORY */}
          <textarea rows="10" name="story" value={formData.story} onChange={handleChange}
            placeholder="Tell your artisan journey, craft heritage, inspirations, handmade products, and your story..."
            className="w-full border border-[#E5D4C8] rounded-3xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" />

          {/* ROW 1 — ARTISAN / WORKPLACE IMAGES */}
          <ImageUploader
            label="Artisan / Workplace Images"
            values={formData.artisanImages}
            onUpload={handleArtisanImagesChange}
            minImages={2}
            maxImages={5}
          />

          {/* ROW 2 — CRAFT / WORK IMAGES */}
          <ImageUploader
            label="Craft / Product / Work Images"
            values={formData.craftImages}
            onUpload={handleCraftImagesChange}
            minImages={2}
            maxImages={5}
          />

          {/* ROW 3 — CHOOSE FEATURED IMAGES (only shown once both sets uploaded) */}
          {bothUploaded && (
            <div className="bg-[#FFF9F3] border-2 border-[#E5D4C8] rounded-[24px] p-6 space-y-6">

              <div>
                <h3 className="text-lg font-bold text-[#6B3E2E] mb-1">
                  Choose Your Article Images
                </h3>
                <p className="text-sm text-[#6B3E2E]/60">
                  These two images will represent you on the Explore page.
                </p>
              </div>

              {/* Profile circle picker */}
              <ImagePicker
                images={formData.artisanImages}
                selected={formData.featuredArtisanImage}
                onSelect={(url) => setFormData({ ...formData, featuredArtisanImage: url })}
                label="🔵 Profile Circle Image"
                hint="This appears as the small round photo on your article card."
              />

              {/* Cover background picker */}
              <ImagePicker
                images={formData.craftImages}
                selected={formData.featuredCraftImage}
                onSelect={(url) => setFormData({ ...formData, featuredCraftImage: url })}
                label="🖼 Cover Background Image"
                hint="This appears as the large background image on your article card."
              />

            </div>
          )}

          {/* SUBMIT */}
          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white font-semibold text-lg transition-all duration-300 disabled:opacity-60">
            {loading ? 'Processing...' : getButtonText()}
          </button>

        </form>

        {/* STATUS BANNER */}
        {status && (
          <div className="mt-8">
            <div className={`p-5 rounded-2xl text-center font-bold ${
              status === 'approved' ? 'bg-green-100 text-green-700'
              : status === 'rejected' ? 'bg-red-100 text-red-700'
              : status === 'revoked' ? 'bg-gray-200 text-gray-700'
              : 'bg-yellow-100 text-yellow-700'
            }`}>
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>

            {rejectionReason && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4">
                <h3 className="font-bold text-red-700">Rejection Reason</h3>
                <p className="mt-2 text-red-600">{rejectionReason}</p>
              </div>
            )}

            {status === 'rejected' && (
              <button onClick={handleResubmit} disabled={loading}
                className="w-full mt-6 py-4 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white font-semibold transition-all duration-300 disabled:opacity-60">
                Resubmit For Approval
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ArtisanProfileSetup;
