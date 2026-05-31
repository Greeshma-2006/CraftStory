import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { artisanService } from '../services';

// Helper: pick first valid image from an array, fallback to placeholder
const firstImage = (arr) =>
  Array.isArray(arr) && arr.length > 0 ? arr[0] : '/placeholder-craft.jpg';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => { fetchArtisans(); }, []);

  const fetchArtisans = async () => {
    try {
      const response = await artisanService.getApprovedArtisans();
      setArtisans(response.data.data || []);
    } catch {
      toast.error('Failed to load artisan stories');
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

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">
          <p className="uppercase tracking-[5px] text-[#A44A32] font-semibold mb-4">
            Heritage Stories
          </p>
          <h1 className="text-5xl font-bold text-[#6B3E2E] mb-6">
            Explore Artisans & Crafts
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-[#6B3E2E]/80">
            Discover authentic artisan journeys, handmade traditions,
            and cultural craftsmanship from passionate creators.
          </p>
        </div>

        {artisans.length === 0 && (
          <div className="bg-white rounded-[35px] shadow-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-[#6B3E2E]">
              No Approved Artisan Stories Yet
            </h2>
            <p className="mt-4 text-[#6B3E2E]/70">
              New artisan stories will appear here after approval.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">
          {artisans.map((artisan) => {
            // Support both array fields (new) and singular fields (legacy)
            const craftBg    = artisan.featuredCraftImage
              || firstImage(artisan.craftImages)
              || artisan.craftImage
              || '/placeholder-craft.jpg';

            const artisanPic = artisan.featuredArtisanImage
              || firstImage(artisan.artisanImages)
              || artisan.artisanImage
              || '/placeholder-artisan.jpg';

            return (
              <div
                key={artisan._id}
                className="bg-white rounded-[30px] overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* CARD BACKGROUND IMAGE */}
                <div className="relative">
                  <img
                    src={craftBg}
                    alt="Craft"
                    className="h-72 w-full object-cover"
                    onError={(e) => { e.target.src = '/placeholder-craft.jpg'; }}
                  />
                  {/* ARTISAN AVATAR */}
                  <img
                    src={artisanPic}
                    alt="Artisan"
                    className="absolute bottom-[-40px] left-8 w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                    onError={(e) => { e.target.src = '/placeholder-artisan.jpg'; }}
                  />
                </div>

                <div className="pt-16 p-8">
                  <h2 className="text-2xl font-bold text-[#6B3E2E]">
                    {artisan.firstName} {artisan.lastName}
                  </h2>
                  <p className="text-[#A44A32] mt-1">Artisan Story</p>
                  <p className="mt-6 text-[#6B3E2E]/80 leading-relaxed">
                    {artisan.story?.length > 140
                      ? artisan.story.substring(0, 140) + '...'
                      : artisan.story}
                  </p>
                  <button
                    onClick={() => navigate(`/artisan/${artisan._id}`)}
                    className="mt-8 px-6 py-3 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white transition-all"
                  >
                    Read More
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ExplorePage;
