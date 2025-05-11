"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRecycle,
  FaStore,
  FaSync,
  FaLeaf,
  FaInfoCircle,
  FaExternalLinkAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import EcoLoader from "@/components/EcoLoader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AnalysisResult {
  imageUrl: string;
  s3Url: string;
  predictedClass: string;
  confidence: number;
  analysis: {
    resalable: {
      is_resalable: boolean;
      platforms: string[];
      condition: string;
      value: string;
      tips: string;
    };
    recyclable: {
      is_recyclable: boolean;
      centers: string[];
      material: string;
      process: string;
      impact: string;
    };
    reusable: {
      is_reusable: boolean;
      ways: string[];
      durability: string;
      benefits: string;
      tutorial: string;
    };
    biodegradable: boolean;
    time_to_degrade: string;
    description: string;
  };
}

type PlatformType = "OLX" | "Facebook Marketplace" | "Quickr";

const platformMap: Record<PlatformType, string> = {
  OLX: "https://www.olx.in",
  "Facebook Marketplace": "https://www.facebook.com/marketplace",
  Quickr: "https://www.quikr.com",
};

const getPlatformUrl = (platform: string): string => {
  return platformMap[platform as PlatformType] || "#";
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the result from localStorage
    const storedResult = localStorage.getItem("analysisResult");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-green-900/10 via-teal-900/70 to-green-900/40 flex items-center justify-center pt-16">
          <EcoLoader message="Loading your results..." />
        </div>
        <Footer />
      </>
    );
  }

  if (!result) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-green-900/10 via-teal-900/70 to-green-900/40 flex items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="text-2xl text-white mb-4">No results found</h1>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Go Back Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-900/10 via-teal-900/70 to-green-900/40 pt-16">
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Image and Basic Info */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-4 space-y-6"
            >
              {/* Image Card */}
              <motion.div
                variants={cardVariants}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-green-500/20 p-4 overflow-hidden"
              >
                <div className="relative group aspect-square">
                  <img
                    src={result.imageUrl}
                    alt="Analyzed Item"
                    className="w-full h-full object-cover rounded-lg shadow-xl transition-transform group-hover:scale-[1.02] duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>

              {/* Basic Info Card */}
              <motion.div
                variants={cardVariants}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-green-500/20"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <FaInfoCircle className="text-green-400 text-xl" />
                  <h3 className="font-semibold text-lg text-white">
                    Basic Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <p className="text-green-100">
                    <span className="font-medium text-green-400">
                      Predicted Class:{" "}
                    </span>
                    {result.predictedClass}
                  </p>
                  <div>
                    <p className="text-green-100 mb-2">
                      <span className="font-medium text-green-400">
                        Confidence:{" "}
                      </span>
                      {result.confidence.toFixed(2)}%
                    </p>
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-green-900/50">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Description Card */}
              <motion.div
                variants={cardVariants}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-green-500/20"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <FaInfoCircle className="text-green-400 text-xl" />
                  <h3 className="font-semibold text-lg text-white">
                    Description
                  </h3>
                </div>
                <p className="text-green-100">{result.analysis.description}</p>
              </motion.div>
            </motion.div>

            {/* Right Column - Analysis Results */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 h-fit"
            >
              {/* Resalable Section */}
              <motion.div
                variants={cardVariants}
                className="bg-blue-900/30 backdrop-blur-md p-6 rounded-xl border border-blue-500/20 h-full"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <FaStore className="text-blue-400 text-xl" />
                  <h3 className="font-semibold text-lg text-white">
                    Resale Potential
                  </h3>
                </div>
                {result.analysis.resalable.is_resalable ? (
                  <div className="space-y-3 text-blue-100">
                    <p>
                      <span className="font-medium text-blue-400">
                        Condition:
                      </span>{" "}
                      {result.analysis.resalable.condition}
                    </p>
                    <p>
                      <span className="font-medium text-blue-400">Value:</span>{" "}
                      {result.analysis.resalable.value}
                    </p>
                    <div>
                      <p className="font-medium text-blue-400 mb-2">
                        Platforms:
                      </p>
                      <ul className="list-none space-y-2">
                        {result.analysis.resalable.platforms.map(
                          (platform, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-2"
                            >
                              <a
                                href={getPlatformUrl(platform)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-blue-800/20 p-2 rounded-lg w-full group hover:bg-blue-700/30 transition-all duration-300"
                              >
                                <span className="w-2 h-2 bg-blue-400 rounded-full group-hover:w-3 group-hover:h-3 transition-all duration-300" />
                                <span className="flex-grow">{platform}</span>
                                <FaExternalLinkAlt
                                  className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  size={12}
                                />
                              </a>
                            </motion.li>
                          )
                        )}
                      </ul>
                    </div>
                    <p className="mt-3">
                      <span className="font-medium text-blue-400">Tips:</span>{" "}
                      {result.analysis.resalable.tips}
                    </p>
                  </div>
                ) : (
                  <p className="text-blue-200/70">
                    This item is not recommended for resale.
                  </p>
                )}
              </motion.div>

              {/* Recyclable Section */}
              <motion.div
                variants={cardVariants}
                className="bg-green-900/30 backdrop-blur-md p-6 rounded-xl border border-green-500/20 h-full"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <FaRecycle className="text-green-400 text-xl" />
                  <h3 className="font-semibold text-lg text-white">
                    Recycling Information
                  </h3>
                </div>
                {result.analysis.recyclable.is_recyclable ? (
                  <div className="space-y-3 text-green-100">
                    <p>
                      <span className="font-medium text-green-400">
                        Material:
                      </span>{" "}
                      {result.analysis.recyclable.material}
                    </p>
                    <p>
                      <span className="font-medium text-green-400">
                        Process:
                      </span>{" "}
                      {result.analysis.recyclable.process}
                    </p>
                    <p>
                      <span className="font-medium text-green-400">
                        Impact:
                      </span>{" "}
                      {result.analysis.recyclable.impact}
                    </p>
                    <div>
                      <p className="font-medium text-green-400 mb-2">
                        Centers:
                      </p>
                      <ul className="list-none space-y-2">
                        {result.analysis.recyclable.centers.map(
                          (center, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-2 bg-green-800/20 p-2 rounded-lg"
                            >
                              <span className="w-2 h-2 bg-green-400 rounded-full" />
                              {center}
                            </motion.li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-green-200/70">
                    This item is not recyclable.
                  </p>
                )}
              </motion.div>

              {/* Reusable Section */}
              <motion.div
                variants={cardVariants}
                className="bg-purple-900/30 backdrop-blur-md p-6 rounded-xl border border-purple-500/20 h-full"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <FaSync className="text-purple-400 text-xl" />
                  <h3 className="font-semibold text-lg text-white">
                    Reuse Options
                  </h3>
                </div>
                {result.analysis.reusable.is_reusable ? (
                  <div className="space-y-3 text-purple-100">
                    <p>
                      <span className="font-medium text-purple-400">
                        Durability:
                      </span>{" "}
                      {result.analysis.reusable.durability}
                    </p>
                    <p>
                      <span className="font-medium text-purple-400">
                        Benefits:
                      </span>{" "}
                      {result.analysis.reusable.benefits}
                    </p>
                    <div>
                      <p className="font-medium text-purple-400 mb-2">
                        Ways to Reuse:
                      </p>
                      <ul className="list-none space-y-2">
                        {result.analysis.reusable.ways.map((way, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-2 bg-purple-800/20 p-2 rounded-lg"
                          >
                            <span className="w-2 h-2 bg-purple-400 rounded-full" />
                            {way}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <p className="mt-3">
                      <span className="font-medium text-purple-400">
                        Tutorial:
                      </span>{" "}
                      {result.analysis.reusable.tutorial}
                    </p>
                  </div>
                ) : (
                  <p className="text-purple-200/70">
                    This item is not suitable for reuse.
                  </p>
                )}
              </motion.div>

              {/* Biodegradable Section */}
              <motion.div
                variants={cardVariants}
                className="bg-yellow-900/30 backdrop-blur-md p-6 rounded-xl border border-yellow-500/20 h-full"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <FaLeaf className="text-yellow-400 text-xl" />
                  <h3 className="font-semibold text-lg text-white">
                    Biodegradability
                  </h3>
                </div>
                <div className="space-y-3 text-yellow-100">
                  <p>
                    <span className="font-medium text-yellow-400">
                      Status:{" "}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        result.analysis.biodegradable
                          ? "bg-yellow-400/20 text-yellow-200"
                          : "bg-red-400/20 text-red-200"
                      }`}
                    >
                      {result.analysis.biodegradable
                        ? "Biodegradable"
                        : "Non-biodegradable"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-yellow-400">
                      Time to Degrade:
                    </span>{" "}
                    {result.analysis.time_to_degrade}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
