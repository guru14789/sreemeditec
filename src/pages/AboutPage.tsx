import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Users, Award, TrendingUp } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Sreemeditec</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              We are a team of experts committed to providing hospitals with reliable and high-quality medical equipment.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/meet.jpeg"
                alt="Our Story"
                className="rounded-lg shadow-lg w-full object-cover max-h-[500px]"
              />
            </div>
            <div className="space-y-5">
              <h2 className="text-3xl font-bold text-gray-800">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2005, Sreemeditec set out with one goal: to provide hospitals and healthcare facilities with reliable and high-quality medical equipment.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Over the years, we've partnered with hundreds of healthcare providers, equipping them with the technology needed to enhance patient care and streamline operations.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, with a growing team, we continue to expand our range of products and services, ensuring healthcare professionals have the right tools to deliver exceptional care.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Core Values</h2>
              <p className="text-gray-600 text-lg">
                These principles guide our work and define our culture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users size={32} />,
                  title: "Quality & Reliability",
                  description:
                    "We prioritize delivering only the highest quality, most reliable medical equipment to help healthcare professionals provide the best patient care.",
                },
                {
                  icon: <Award size={32} />,
                  title: "Customer-Centric Service",
                  description:
                    "We are committed to continuously supporting our clients with personalized service, maintenance, and expertise to ensure optimal equipment performance.",
                },
                {
                  icon: <TrendingUp size={32} />,
                  title: "Dependability",
                  description:
                    "Our clients trust us for the quality and longevity of the equipment we provide, ensuring that healthcare professionals have reliable tools when needed most.",
                },
              ].map(({ icon, title, description }, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-primary rounded-full mb-6">
                    {icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-primary transition">
                    {title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
