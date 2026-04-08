import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion as Motion } from 'framer-motion';
import { Upload as UploadIcon, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useMockupStore from '../store/mockupStore';
import ConfettiEffect from '../components/ConfettiEffect';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().min(1, 'Price required'),
  category: z.enum(['Packaging', 'Bottles', 'Apparel', 'Beverage', 'Other']),
});

const Upload = () => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const { createMockup, loading } = useMockupStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { category: 'Packaging' }
  });

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 20 * 1024 * 1024,
    multiple: false
  });

  const onSubmit = async (data) => {
    if (!file) return toast.error('Please upload an image!');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('category', data.category);

    const result = await createMockup(formData);
    if (result.success) {
      setSuccess(true);
      toast.success('Mockup uploaded successfully! 🎉');
      setTimeout(() => navigate('/mockups'), 2500);
    } else {
      toast.error('Upload failed!');
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <ConfettiEffect trigger={success} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Upload Mockup</h1>
        <p className="text-white/40 mt-1">Add new mockup to your library</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Info */}
        <div className="glass rounded-2xl p-6 h-fit">
          <h3 className="text-white font-semibold mb-4">Upload Tips</h3>
          <ul className="space-y-3">
            {['Optimized for WebP', 'Auto-tagging enabled', 'Commercial License check'].map((tip) => (
              <li key={tip} className="flex items-center gap-2 text-white/60 text-sm">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          {success ? (
            <Motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
              <h2 className="text-white text-xl font-bold">Uploaded Successfully!</h2>
              <p className="text-white/40 mt-2">Redirecting to mockups...</p>
            </Motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Mockup Name</label>
                <input
                  {...register('title')}
                  placeholder="e.g. Minimalist Coffee Pouch v2"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-primary-500 transition-all"
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Describe the material, finish, and lighting setup..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-primary-500 transition-all resize-none"
                />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Price (USD)</label>
                  <input
                    {...register('price')}
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-primary-500 transition-all"
                  />
                  {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Category</label>
                  <select
                    {...register('category')}
                    className="w-full bg-[#1a1a2e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 transition-all"
                  >
                    {['Packaging', 'Bottles', 'Apparel', 'Beverage', 'Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dropzone */}
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Mockup Preview</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:border-primary-500/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <UploadIcon className="w-10 h-10 text-primary-500/60 mx-auto mb-3" />
                      <p className="text-white/60 text-sm">Click to upload or drag and drop</p>
                      <p className="text-white/30 text-xs mt-1">PNG, JPG or WebP (Max. 20MB)</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/mockups')}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 gradient-bg py-3 rounded-xl text-white font-semibold disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Upload Mockup'}
                </Motion.button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;