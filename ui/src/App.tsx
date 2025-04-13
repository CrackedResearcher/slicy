"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader, X } from "lucide-react";

const Upload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processedUrls, setProcessedUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setProcessedUrls([]);

    const payload = new FormData();
    payload.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();

      const jobId = data.jobId;

      // poll starts
      const pollJob = async () => {
        const pollRes = await fetch(
          `http://localhost:3000/api/job-status?id=${jobId}`
        );
        const pollData = await pollRes.json();

        if (pollData.status === "completed") {
          setProcessedUrls(pollData.imageUrls);
          setIsUploading(false);
        } else {
          // retry  3s
          setTimeout(pollJob, 3000);
        }
      };

      pollJob();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload the image.");
      setIsUploading(false);
    } finally {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const groupedImages = processedUrls.reduce((acc, url) => {
    const sizeMatch = url.match(/-(\d+)\.webp$/);
    const size = sizeMatch ? sizeMatch[1] : 'unknown';
    
    if (!acc[size]) {
      acc[size] = [];
    }
    acc[size].push(url);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 py-8">
      <div className="bg-white/5 backdrop-blur-md border border-white/20 p-8 rounded-sm shadow-2xl w-full max-w-md text-center space-y-6">
        <h2 className="text-xl font-bold text-white">Resize Images for free</h2>
        <p className="text-white/70 text-xs">
          Click below to select an image file to upload.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-white/20 rounded-sm p-6 hover:bg-white/10 transition"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              width={100}
              height={100}
              className="mx-auto rounded-md object-cover h-24 w-24"
            />
          ) : (
            <p className="text-gray-400 text-xs">
              Click here to choose an image
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-sm cursor-pointer font-medium transition ${
            isUploading
              ? "bg-white/20 cursor-not-allowed"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {isUploading ? (
            <>
              <Loader className="animate-spin w-5 h-5" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5" />
              Upload Now
            </>
          )}
        </button>
      </div>

      {/*  processed images */}
      {processedUrls.length > 0 && (
        <div className="mt-12 w-full max-w-4xl">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Processed Images</h3>
          <div className="bg-white/5 backdrop-blur-md border border-white/20 p-6 rounded-sm">
            {/* Image sizes tabs */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {Object.keys(groupedImages).sort((a, b) => Number(a) - Number(b)).map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 text-xs rounded ${size === selectedImage ? 'bg-white/20 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                  onClick={() => setSelectedImage(size)}
                >
                  {size}px
                </button>
              ))}
            </div>

            {/* image view or gallery grid */}
            {selectedImage ? (
              <div className="relative">
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-black/50 p-1 rounded-full hover:bg-black/70"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="flex justify-center">
                  {groupedImages[selectedImage] && groupedImages[selectedImage].map((url, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3000${url}`}
                      alt={`Image at ${selectedImage}px`}
                      className="max-w-full h-auto rounded mx-auto"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.entries(groupedImages)
                  .sort(([sizeA], [sizeB]) => Number(sizeA) - Number(sizeB))
                  .map(([size, urls]) => (
                    <div 
                      key={size} 
                      className="bg-white/10 p-2 rounded cursor-pointer hover:bg-white/15 transition"
                      onClick={() => setSelectedImage(size)}
                    >
                      <img
                        src={`http://localhost:3000${urls[0]}`}
                        alt={`Thumbnail ${size}px`}
                        className="w-full h-auto rounded"
                      />
                      <p className="text-white/70 text-xs mt-2 text-center">{size}px</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;