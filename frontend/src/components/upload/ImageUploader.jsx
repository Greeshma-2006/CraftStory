import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';

// Multi-image uploader: min 2, max 5 square-rounded thumbnails
const ImageUploader = ({ label, values = [], onUpload, minImages = 2, maxImages = 5 }) => {
  const inputRef  = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragging,  setDragging]  = useState(false);

  const validateFile = (file) => {
    const allowed = ['image/jpeg','image/jpg','image/png','image/webp'];
    if (!allowed.includes(file.type)) { toast.error('Only JPG, PNG, WEBP allowed'); return false; }
    if (file.size / 1024 / 1024 > 5)  { toast.error('Max file size is 5 MB');       return false; }
    return true;
  };

  const uploadFile = async (file) => {
    if (!validateFile(file)) return null;
    const formData = new FormData();
    formData.append('file', file);
    const r = await api.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return r.data.url;
  };

  const handleFiles = async (files) => {
    const arr = Array.from(files);
    if (values.length + arr.length > maxImages) { toast.error(`Maximum ${maxImages} images allowed`); return; }
    setUploading(true);
    try {
      const urls = [];
      for (const f of arr) { const u = await uploadFile(f); if (u) urls.push(u); }
      if (urls.length) {
        onUpload([...values, ...urls]);
        toast.success(urls.length === 1 ? 'Image uploaded' : `${urls.length} images uploaded`);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (index) => onUpload(values.filter((_, i) => i !== index));

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const canAdd = values.length < maxImages;

  return (
    <div>
      {/* Label + counter */}
      <div className="flex items-center justify-between mb-3">
        <label className="block text-[#6B3E2E] font-semibold">{label}</label>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${values.length >= minImages ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          {values.length}/{maxImages}{values.length < minImages ? ` (min ${minImages})` : ''}
        </span>
      </div>

      {/* Thumbnails — square with rounded edges, consistent size */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {values.map((url, i) => (
            <div key={i} className="relative group w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#E5D4C8] shadow-md flex-shrink-0">
              <img src={url} alt={`img-${i+1}`} className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                <X size={11} />
              </button>
              <div className="absolute bottom-1 left-1 w-4 h-4 bg-black/50 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {i+1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {canAdd && (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 cursor-pointer transition-all text-center
            ${dragging  ? 'border-[#C96A4A] bg-[#F5E6D3]' : 'border-[#D8C2B2] bg-[#FFF9F3] hover:border-[#C96A4A] hover:bg-[#FFF3EE]'}
            ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-[3px] border-[#C96A4A] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-[#6B3E2E] font-medium text-sm">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload size={32} className="text-[#C96A4A] mb-3" />
              <p className="text-[#6B3E2E] font-medium text-sm">Drag & Drop or Click to Browse</p>
              <p className="text-xs text-[#A58A78] mt-1">JPG · PNG · WEBP · Max 5MB</p>
              <p className="text-xs text-[#C96A4A] mt-1 font-semibold">
                {maxImages - values.length} slot{maxImages - values.length !== 1 ? 's' : ''} remaining
              </p>
            </div>
          )}
        </div>
      )}

      {values.length < minImages && (
        <p className="text-amber-600 text-xs mt-2 font-medium">⚠ Upload at least {minImages} images ({values.length} uploaded)</p>
      )}
      {values.length >= maxImages && (
        <p className="text-green-600 text-xs mt-2 font-medium">✓ Maximum images added</p>
      )}

      <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple hidden
        onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); }} />
    </div>
  );
};

export default ImageUploader;
