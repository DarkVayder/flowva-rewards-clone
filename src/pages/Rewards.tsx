import { useAuth } from '../hooks/useAuth';

import PointsCard from '../components/PointsCard';
import StreakCard from '../components/StreakCard';
import EarnMorePoints from '../components/EarnMorePoints';
import ReferAndEarn from '../components/ReferAndEarn';
import Loader from '../components/Loader';
import PageHeader from '../components/PageHeader';
import FeaturedCard from '../components/FeatureCard';

import {
  FaFacebook,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
} from 'react-icons/fa';

export default function Rewards() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <div className="space-y-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Rewards Hub"
        subtitle="Earn points, unlock rewards, and celebrate your progress!"
        activeTab="earn"
      />

      {/* Your Rewards Journey */}
      <section>
        <h2 className="text-lg font-semibold mb-4 border-l-4 border-purple-600 pl-3">
          Your Rewards Journey
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <PointsCard />
          <StreakCard />
          <FeaturedCard
            title="Top Tool Spotlight"
            buttonText="Claim 50 pts"
          />
        </div>
      </section>

      {/* Earn More Points */}
      <section>
        <h2 className="text-lg font-semibold mb-4 border-l-4 border-purple-600 pl-3">
          Earn More Points
        </h2>
        <EarnMorePoints />
      </section>

      {/* Refer and Earn */}
      <section>
        <h2 className="text-lg font-semibold mb-4 border-l-4 border-purple-600 pl-3">
          Refer and Earn
        </h2>
        <ReferAndEarn />
      </section>

      {/* Footer social icons */}
      <footer className="flex flex-wrap justify-center gap-4 sm:gap-6 text-2xl text-gray-500">
        <FaFacebook className="hover:text-blue-600 transition-colors" />
        <FaWhatsapp className="hover:text-green-500 transition-colors" />
        <FaTwitter className="hover:text-blue-400 transition-colors" />
        <FaLinkedin className="hover:text-blue-700 transition-colors" />
      </footer>
    </div>
  );
}
