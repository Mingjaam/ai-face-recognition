import React, { useState, useCallback } from 'react';
import { type RegisteredFace } from './types';
import { compareFaces } from './services/geminiService';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { RegisteredFaceCard } from './components/RegisteredFaceCard';
import { Spinner } from './components/Spinner';

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export default function App() {
  const [registeredFaces, setRegisteredFaces] = useState<RegisteredFace[]>([]);
  const [registrationName, setRegistrationName] = useState('');
  const [registrationFile, setRegistrationFile] = useState<File | null>(null);

  const [recognitionFile, setRecognitionFile] = useState<File | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = useCallback(async () => {
    if (!registrationFile || !registrationName.trim()) {
      setError('Please provide a name and an image to register.');
      return;
    }
    setError(null);

    try {
      const imageBase64 = await fileToBase64(registrationFile);
      const newFace: RegisteredFace = {
        id: crypto.randomUUID(),
        name: registrationName.trim(),
        imageBase64,
        mimeType: registrationFile.type,
      };
      setRegisteredFaces((prev) => [...prev, newFace]);
      setRegistrationName('');
      setRegistrationFile(null); // This should clear the uploader via a key change
    } catch (e) {
      setError('Failed to process image file.');
      console.error(e);
    }
  }, [registrationFile, registrationName]);

  const handleRecognize = useCallback(async () => {
    if (!recognitionFile) {
      setError('Please select an image to recognize.');
      return;
    }
    if (registeredFaces.length === 0) {
      setError('No faces registered. Please register a face first.');
      return;
    }

    setIsLoading(true);
    setRecognitionResult(null);
    setError(null);

    try {
      const recognitionImageBase64 = await fileToBase64(recognitionFile);
      const imageToRecognize = {
        data: recognitionImageBase64,
        mimeType: recognitionFile.type,
      };

      let foundMatch = false;
      for (const face of registeredFaces) {
        setRecognitionResult(`Comparing with ${face.name}...`);
        const registeredImage = {
          data: face.imageBase64,
          mimeType: face.mimeType,
        };
        const isMatch = await compareFaces(imageToRecognize, registeredImage);
        if (isMatch) {
          setRecognitionResult(`Match found: ${face.name}`);
          foundMatch = true;
          break;
        }
      }

      if (!foundMatch) {
        setRecognitionResult('No match found in the registry.');
      }
    } catch (e: any) {
      console.error(e);
      setError(`An error occurred during recognition: ${e.message}`);
      setRecognitionResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [recognitionFile, registeredFaces]);

  const handleDeleteFace = useCallback((id: string) => {
    setRegisteredFaces((prev) => prev.filter((face) => face.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />

      {error && (
        <div className="w-full max-w-5xl bg-red-800/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Registration Column */}
        <section className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 flex flex-col gap-4 shadow-lg">
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">1. Register Face</h2>
          <ImageUploader key={`reg-${registrationFile === null}`} onImageSelect={setRegistrationFile} id="register-uploader" />
          <input
            type="text"
            value={registrationName}
            onChange={(e) => setRegistrationName(e.target.value)}
            placeholder="Enter name..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />
          <button
            onClick={handleRegister}
            disabled={!registrationFile || !registrationName.trim()}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all duration-300 shadow-md hover:shadow-cyan-500/30"
          >
            Register
          </button>
        </section>

        {/* Recognition Column */}
        <section className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 flex flex-col gap-4 shadow-lg">
          <h2 className="text-2xl font-bold text-teal-400 mb-2">2. Recognize Face</h2>
          <ImageUploader key={`rec-${recognitionFile === null}`} onImageSelect={setRecognitionFile} id="recognize-uploader" />
          <button
            onClick={handleRecognize}
            disabled={isLoading || !recognitionFile || registeredFaces.length === 0}
            className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all duration-300 shadow-md hover:shadow-teal-500/30"
          >
            {isLoading ? <Spinner /> : 'Recognize'}
          </button>
          {recognitionResult && (
            <div className="mt-4 text-center bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold text-lg">{recognitionResult}</p>
            </div>
          )}
        </section>
      </main>

      {/* Registered Faces Gallery */}
      {registeredFaces.length > 0 && (
        <section className="w-full max-w-5xl mt-12">
          <h2 className="text-2xl font-bold text-gray-300 mb-4 text-center">Face Registry</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {registeredFaces.map((face) => (
              <RegisteredFaceCard key={face.id} face={face} onDelete={handleDeleteFace} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
