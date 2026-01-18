import React from 'react';

interface SplashScreenProps {
  onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center w-full max-w-3xl transform transition-all duration-500 ease-in-out animate-fadeInUp">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-600 mb-8">
          Poultry Feed Formulation App
        </h1>

        <div className="space-y-8 mb-10">
          
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Supervised by</h2>
            <p className="font-semibold text-amber-700 text-lg">
                Dr. Zelal Alsaftli & Eng. Batoul Almer Suliman
            </p>
          </div>
        </div>

        <p className="text-md text-gray-600 mt-4 mb-10">
          Animal Production Department - Agricultural Engineering Faculty - Hama University
        </p>

        <button
          onClick={onStart}
          className="bg-teal-600 text-white font-bold py-3 px-10 rounded-full hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-300"
        >
          Start Application
        </button>
      </div>
      <style>{`
        @keyframes fadeInAndUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInAndUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;