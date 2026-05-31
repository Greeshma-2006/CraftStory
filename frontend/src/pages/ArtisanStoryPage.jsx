import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { artisanService } from '../services';

// Helper: pick first valid image from array field, fallback to singular field
const firstImage = (arr, singular, fallback) =>
  (Array.isArray(arr) && arr.length > 0 ? arr[0] : null) || singular || fallback;

const ArtisanStoryPage = () => {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchArtisan(); }, [id]);

  const fetchArtisan = async () => {
    try {
      const response = await artisanService.getApprovedArtisan(id);
      setArtisan(response.data.data);
    } catch {
      toast.error('Artisan story not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F3]">
        <div className="w-16 h-16 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F3]">
        <h2 className="text-3xl font-bold text-[#6B3E2E]">Artisan Story Not Found</h2>
      </div>
    );
  }

  // Resolve images — supports both arrays (new) and singular fields (legacy)
  const heroImage    = artisan.featuredCraftImage
    || firstImage(artisan.craftImages, artisan.craftImage, '/placeholder-craft.jpg');

  const artisanAvatar = artisan.featuredArtisanImage
    || firstImage(artisan.artisanImages, artisan.artisanImage, '/placeholder-artisan.jpg');

  // All artisan workspace images for gallery
  const artisanGallery = artisan.artisanImages?.length > 0
    ? artisan.artisanImages
    : artisan.artisanImage ? [artisan.artisanImage] : [];

  const craftGallery = artisan.craftImages?.length > 0
    ? artisan.craftImages
    : artisan.craftImage ? [artisan.craftImage] : [];

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* HERO */}
        <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl">
          <img
            src={heroImage}
            alt="Craft"
            className="h-[500px] w-full object-cover"
            onError={(e) => { e.target.src = '/placeholder-craft.jpg'; }}
          />

          <div className="p-10 lg:p-14">
            <p className="uppercase tracking-[5px] text-[#A44A32] font-semibold mb-4">
              Artisan Heritage Story
            </p>

            <div className="flex items-center gap-5 mb-8">
              <img
                src={artisanAvatar}
                alt="Artisan"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#F5E6D3] flex-shrink-0"
                onError={(e) => { e.target.src = '/placeholder-artisan.jpg'; }}
              />
              <div>
                <h1 className="text-5xl font-bold text-[#6B3E2E]">
                  {artisan.firstName} {artisan.lastName}
                </h1>
                <p className="text-[#A44A32] mt-2">Approved CraftStory Artisan</p>
              </div>
            </div>

            <div className="bg-[#FFF9F3] rounded-[30px] p-8">
              <p className="text-[#6B3E2E]/90 leading-relaxed text-lg whitespace-pre-line">
                {artisan.story}
              </p>
            </div>
          </div>
        </div>

        {/* ARTISAN IMAGES GALLERY */}
        {artisanGallery.length > 0 && (
          <div className="mt-14">
            <h2 className="text-3xl font-bold text-[#6B3E2E] mb-6">Artisan Gallery</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {artisanGallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Artisan ${i + 1}`}
                  className="rounded-[20px] shadow-lg h-60 object-cover w-full"
                  onError={(e) => { e.target.src = '/placeholder-artisan.jpg'; }}
                />
              ))}
            </div>
          </div>
        )}

        {/* CRAFT IMAGES GALLERY */}
        {craftGallery.length > 0 && (
          <div className="mt-14">
            <h2 className="text-3xl font-bold text-[#6B3E2E] mb-6">Craft Works</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {craftGallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Craft ${i + 1}`}
                  className="rounded-[20px] shadow-lg h-60 object-cover w-full"
                  onError={(e) => { e.target.src = '/placeholder-craft.jpg'; }}
                />
              ))}
            </div>
          </div>
        )}

        {/* HERITAGE SECTION */}
        <div className="bg-white rounded-[35px] shadow-xl p-10 mt-14">
          <h2 className="text-4xl font-bold text-[#6B3E2E] mb-6">
            Cultural Heritage & Craft Journey
          </h2>
          <p className="text-[#6B3E2E]/80 leading-relaxed text-lg">
            Every approved artisan on CraftStory represents authentic handmade heritage,
            cultural identity, traditional skills, innovation, craftsmanship and rural creativity.
          </p>
          <p className="text-[#6B3E2E]/80 leading-relaxed text-lg mt-6">
            This artisan's story has been reviewed and approved through
            CraftStory's authenticity verification process.
          </p>
        </div>

        {/* FUTURE PRODUCTS */}
        <div className="bg-white rounded-[35px] shadow-xl p-10 mt-14">
          <h2 className="text-4xl font-bold text-[#6B3E2E] mb-4">Artisan Creations</h2>
          <p className="text-[#6B3E2E]/70">Approved artisan products will appear here.</p>
        </div>

      </div>
    </div>
  );
};

export default ArtisanStoryPage;
