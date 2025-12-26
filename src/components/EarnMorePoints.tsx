import { useState } from 'react';
import { FaShareAlt } from 'react-icons/fa';
import { CiStar } from 'react-icons/ci';
import EarnMoreCard from './EarnMoreCard';

export default function EarnMorePoints() {
  const [modalContent, setModalContent] = useState<string | null>(null);

  const openModal = (content: string) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Refer & Earn*/}
      <EarnMoreCard
        title={
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 text-purple-700">
              <CiStar className="w-5 h-5" />
            </div>

            {/* Title */}
            <span className="text-base font-semibold text-gray-900">
              Refer & Earn
            </span>
          </div>
              }
        description={
          <div className="mt-3 space-y-4">
            {/* Reward emphasis */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-purple-700">10,000</span>
              <span className="text-sm text-gray-500">points prize</span>
            </div>

            {/* Details */}
            <p className="text-sm text-gray-600 leading-relaxed">
              Invite <b>3 friends</b> by <b>Nov 20</b> for a chance to be one of
              <b> 5 winners</b>. Friends must complete onboarding to qualify.
            </p>

            {/* Passive CTA (no modal) */}
            <div className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 bg-gray-50 px-3 py-1.5 rounded-lg">
              <CiStar className="w-4 h-4" />
              Auto-tracked via your referral link
            </div>
          </div>
        }
      />

        {/* Share Your Stacks*/}
        <EarnMoreCard
          title={
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-100 text-purple-600">
                <FaShareAlt className="w-5 h-5" />
              </div>
              <span className="text-base font-semibold text-gray-900">
                Share Your Stacks
              </span>
            </div>
          }
          description={
            <div className="mt-3 space-y-4">
              {/* Reward highlight */}
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-purple-600">+25</span>
                <span className="text-sm text-gray-500">points per share</span>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 text-bold">
                  Share your tool stack with others
                </p>

                <button
                  type="button"
                  onClick={() => openModal('Share your stacks to earn extra points!')}
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2 rounded-lg
                    bg-purple-600 text-white text-sm font-medium
                    hover:bg-purple-700 active:scale-95
                    transition-all
                    shadow-sm hover:shadow-md cursor-pointer
                  "
                >
                  <FaShareAlt className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          }
        />
      </div>
        {modalContent && (
          <>
            <div
              className="
                fixed inset-0 z-40
                bg-black/30
                backdrop-blur-sm
              "
              onClick={closeModal}
            />
            <div
              className="
                fixed z-50
                top-1/2 left-1/2
                -translate-x-1/2 -translate-y-1/2
                w-88
                bg-white
                rounded-2xl
                shadow-2xl
                p-6
                animate-fade-in
              "
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Share your stack
              </h3>

              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                {modalContent}
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="
                    px-4 py-2 text-sm
                    rounded-lg
                    text-gray-600
                    hover:bg-gray-100
                    cursor-pointer
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={closeModal}
                  className="
                    px-4 py-2 text-sm
                    rounded-lg
                    bg-purple-600 text-white
                    hover:bg-purple-700
                    cursor-pointer
                  "
                >
                  Continue
                </button>
              </div>
            </div>
          </>
        )}
    </section>
  );
}
