import React, { useState } from 'react';
import { CiGift } from 'react-icons/ci';
import { FiCalendar } from 'react-icons/fi';
import { supabase } from '../lib/supabase';

type FeaturedCardProps = {
  title: string;
  subtitleLabel?: string;
  subtitle?: string;
  buttonText?: string;
  signupLink?: string;
  pointsToClaim?: number;
  userId?: string;
};

export default function FeaturedCard({
  title,
  subtitleLabel = 'Reclaim',
  subtitle = `Automate and Optimize Your Schedule
Reclaim.ai is an AI-powered calendar assistant that automatically schedules your tasks, meetings, and breaks to boost productivity. Free to try — earn Flowva Points when you sign up!`,
  buttonText = 'Claim 50 pts',
  signupLink = 'https://go.reclaim.ai/ur9i6g5eznps',
  pointsToClaim = 25,
  userId,
}: FeaturedCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !file || !userId) {
      alert('Please provide your email, screenshot, and make sure you are logged in.');
      return;
    }

    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reclaim-screenshots')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('reward_claims')
        .insert({
          user_id: userId,
          email,
          screenshot_path: uploadData.path,
          points: pointsToClaim,
          reward_title: title,
        });

      if (insertError) throw insertError;

      alert(`Claim submitted! You will receive ${pointsToClaim} Flowva Points after verification.`);
      setIsModalOpen(false);
      setEmail('');
      setFile(null);
    } catch (error: any) {
      console.error(error);
      alert('Error submitting claim: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Card */}
      <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-xl overflow-hidden p-6 flex flex-col justify-between md:flex-row md:items-start md:gap-6">
        {/* Left side */}
        <div className="flex flex-col md:flex-1">
          <span className="text-xs bg-white/30 px-3 py-1 rounded-full font-medium inline-block mb-2">Featured</span>
          <h2 className="text-3xl font-bold">{title}</h2>
          <h4 className="text-md font-semibold mt-2">{subtitleLabel}</h4>

          {/* Subtitle text */}
          <div className="bg-white text-black p-4 mt-2 rounded-xl flex flex-col md:flex-row md:items-start md:gap-4">
            <FiCalendar className="w-16 h-16 mt-1 md:mt-0 opacity-90 flex-shrink-0" />
            <p className="text-sm whitespace-pre-line">{subtitle}</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row md:justify-between items-stretch gap-3 mt-6">
            <a
              href={signupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-purple-700 px-5 py-3 rounded-full text-sm font-medium hover:bg-gray-300 transition shadow-md text-center"
            >
              Sign up
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-full text-sm font-medium text-white flex items-center gap-2 justify-center shadow-md"
              style={{ background: 'linear-gradient(45deg, #9013fe, #ff8687)' }}
            >
              <CiGift className="w-5 h-5" />
              {buttonText}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-lg">
          <div className="bg-white/95 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <h3 className="text-xl font-bold mb-2">Claim Your {pointsToClaim} Points</h3>
            <p className="text-sm mb-4">
              Sign up for Reclaim (free, no payment needed), then fill the form below:
            </p>
            <ol className="list-decimal list-inside text-sm mb-4 space-y-2">
              <li>Enter your Reclaim sign-up email.</li>
              <li>Upload a screenshot of your Reclaim profile showing your email.</li>
            </ol>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Email used on Reclaim</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Upload screenshot (mandatory)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  required
                  className="border rounded-lg p-1"
                />
                {file && <p className="text-xs mt-1 text-gray-500 truncate">{file.name}</p>}
              </div>

              <div className="flex flex-col md:flex-row justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 justify-center transition ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ background: 'linear-gradient(45deg, #9013fe, #ff8687)' }}
                >
                  {uploading ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
