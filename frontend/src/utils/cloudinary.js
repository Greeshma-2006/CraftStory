export const uploadToCloudinary = async (file, folder = 'craftstory') => {
  try {
    const API_URL = process.env.REACT_APP_BACKEND_URL;
    
    const sigResponse = await fetch(`${API_URL}/api/upload/signature?folder=${folder}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!sigResponse.ok) {
      throw new Error('Failed to get upload signature');
    }
    
    const sigData = await sigResponse.json();
    const { signature, timestamp, cloudName, apiKey, folder: uploadFolder } = sigData.data;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', uploadFolder);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!cloudinaryResponse.ok) {
      throw new Error('Failed to upload to Cloudinary');
    }

    const result = await cloudinaryResponse.json();
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};