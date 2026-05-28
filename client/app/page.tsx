import { Landmark, Shield, Clock, Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: "Immutable Records",
      description: "Land records cannot be altered or tampered with once registered",
    },
    {
      icon: Clock,
      title: "Instant Verification",
      description: "Verify land ownership instantly with transparent history",
    },
    {
      icon: Globe,
      title: "Borderless Access",
      description: "Access land records from anywhere in the world",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <Landmark className="h-16 w-16 text-green-600" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Blockchain Land Registry
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Secure, transparent, and immutable land ownership registration powered by blockchain technology
        </p>
        <div className="mt-8 space-x-4">
          <Link href="/register" className="inline-block btn-primary">
            Register Land
          </Link>
          <Link href="/verify" className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            Verify Ownership
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="card text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Icon className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold mb-2">100%</div>
            <div className="text-green-100">Immutable Security</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">Instant</div>
            <div className="text-green-100">Verification Time</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">Blockchain</div>
            <div className="text-green-100">Powered</div>
          </div>
        </div>
      </div>
    </div>
  );
}