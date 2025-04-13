import { useRef, useState } from "react";
import { UploadCloud, Loader } from "lucide-react";

const Upload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);

    setTimeout(() => {
      alert(`Uploaded: ${selectedFile.name}`);
      setIsUploading(false);
    }, 2000);
  };

  return (
    <div className="bg-black h-screen flex justify-center items-center">
      <div className="bg-black p-8 rounded-xl shadow-xl w-full max-w-lg text-center space-y-6">
        <h2 className="text-2xl font-semibold text-white">Upload Your File</h2>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer p-8 border-2 border-dashed border-white/30 rounded-lg hover:bg-white/10 transition"
        >
          <p className="text-white text-lg">
            {selectedFile ? selectedFile.name : "Click here to choose an image"}
          </p>
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className={`flex items-center text-black justify-center gap-2 px-6 py-3 rounded-lg text-white text-lg font-medium transition ${
            isUploading
              ? "bg-white/30 cursor-not-allowed"
              : "bg-white hover:bg-white/70"
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
    </div>
  );
};

export default Upload;