import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { X, ZoomIn } from 'lucide-react';
import { adminService } from '../services';

const AdminPendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason]     = useState('');

  // Lightbox
  const [lightbox, setLightbox] = useState(null); // url string

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const r = await adminService.getPendingRequests();
      setRequests(r.data.data || []);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id) => {
    try {
      await adminService.approveArtisan(id);
      toast.success('Artisan approved successfully');
      fetchRequests();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Approval failed');
    }
  };

  const rejectRequest = async (id) => {
    if (!reason.trim()) { toast.error('Rejection reason is required'); return; }
    try {
      await adminService.rejectArtisan(id, { reason });
      toast.success('Artisan rejected');
      setRejectId(null);
      setReason('');
      fetchRequests();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Rejection failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F3]">
      <div className="w-16 h-16 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-14">
          <h1 className="text-5xl font-bold text-[#6B3E2E] mb-4">Pending Artisan Requests</h1>
          <p className="text-[#6B3E2E]/80">Review artisan authenticity, stories, cultural heritage, and uploaded works.</p>
        </div>

        {requests.length === 0 && (
          <div className="bg-white rounded-[35px] shadow-xl p-12 text-center">
            <h2 className="text-2xl font-bold text-[#6B3E2E]">No Pending Requests</h2>
          </div>
        )}

        <div className="space-y-10">
          {requests.map((req) => {

            // Support both old single-string and new array format
            const artisanImgs = Array.isArray(req.artisanImages) && req.artisanImages.length
              ? req.artisanImages
              : req.artisanImage ? [req.artisanImage] : [];

            const craftImgs = Array.isArray(req.craftImages) && req.craftImages.length
              ? req.craftImages
              : req.craftImage ? [req.craftImage] : [];

            return (
              <div key={req._id} className="bg-white rounded-[35px] shadow-xl overflow-hidden">

                <div className="p-8 border-b border-[#F0E4DA]">

                  {/* ARTISAN IMAGES */}
                  {artisanImgs.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-[#6B3E2E]/60 uppercase tracking-wider mb-3">
                        Artisan / Workplace Images
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {artisanImgs.map((url, i) => (
                          <div
                            key={i}
                            className="relative group w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden border border-[#E5D4C8] cursor-pointer shadow-md"
                            onClick={() => setLightbox(url)}
                          >
                            <img src={url} alt={`Artisan ${i + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn size={20} className="text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CRAFT IMAGES */}
                  {craftImgs.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-[#6B3E2E]/60 uppercase tracking-wider mb-3">
                        Craft / Product Images
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {craftImgs.map((url, i) => (
                          <div
                            key={i}
                            className="relative group w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden border border-[#E5D4C8] cursor-pointer shadow-md"
                            onClick={() => setLightbox(url)}
                          >
                            <img src={url} alt={`Craft ${i + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn size={20} className="text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {artisanImgs.length === 0 && craftImgs.length === 0 && (
                    <div className="text-[#6B3E2E]/40 italic text-sm">No images uploaded</div>
                  )}
                </div>

                {/* ARTISAN INFO + ACTIONS */}
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-[#6B3E2E]">
                    {req.firstName} {req.lastName}
                  </h2>
                  <p className="mt-1 text-[#A44A32]">{req.email}</p>
                  <p className="text-[#A44A32] mb-4">{req.phone}</p>

                  <div className="max-h-48 overflow-y-auto bg-[#FFF9F3] rounded-2xl p-4 border border-[#EDE0D8]">
                    <p className="text-[#6B3E2E]/80 leading-relaxed text-sm">{req.story}</p>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => approveRequest(req._id)}
                      className="px-8 py-3 rounded-full bg-[#6D8B5A] hover:bg-[#567046] text-white transition-all font-semibold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectId(req._id)}
                      className="px-8 py-3 rounded-full bg-[#A44A32] hover:bg-[#8B3B28] text-white transition-all font-semibold"
                    >
                      Reject
                    </button>
                  </div>

                  {rejectId === req._id && (
                    <div className="mt-6">
                      <textarea
                        rows="4"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                        className="w-full border border-[#E5D4C8] rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[#C96A4A]"
                      />
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => rejectRequest(req._id)}
                          className="px-6 py-3 rounded-full bg-[#A44A32] text-white font-semibold"
                        >
                          Confirm Reject
                        </button>
                        <button
                          onClick={() => { setRejectId(null); setReason(''); }}
                          className="px-6 py-3 rounded-full bg-gray-100 text-gray-600 font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition"
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>
          <img
            src={lightbox}
            alt="Preview"
            className="max-w-3xl max-h-[85vh] object-contain rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default AdminPendingRequests;
