import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, Mail, MapPin,
  Facebook, Twitter, Linkedin, Instagram, X
} from 'lucide-react';

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <footer className="bg-gray-900 text-gray-300 relative z-10">
      <div className="max-w-[1200px] mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Sreemeditec</h3>
            <p className="mb-5 text-[15px] leading-relaxed">
              Supporting healthcare with trusted medical technology since 2005. Your vision, our mission.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="hover:text-[#1d7d69] transition-colors duration-300 hover:scale-110"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-[15px]">
              <li><Link to="/index" className="hover:text-[#1d7d69] transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#1d7d69] transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-[#1d7d69] transition-colors">Services</Link></li>
              <li><Link to="/contact" className="hover:text-[#1d7d69] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Our Services</h3>
            <ul className="space-y-2 text-[15px]">
              <li><Link to="/services#software" className="hover:text-[#1d7d69] transition-colors">Equipment</Link></li>
              <li><Link to="/services#design" className="hover:text-[#1d7d69] transition-colors">Furniture</Link></li>
              <li><Link to="/services#consulting" className="hover:text-[#1d7d69] transition-colors">Pipeline</Link></li>
              <li><Link to="/services#cloud" className="hover:text-[#1d7d69] transition-colors">Get Service Request</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4 text-[15px]">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-[#1d7d69]" />
                <span>No:18/2, Bajanai Koil Street, Rajakilpakkam, Chennai-600073</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-[#1d7d69]" />
                <span>+91 98848 18398</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-[#1d7d69]" />
                <span>sreemeditec@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2025 A.S.T.R.A.L Corp . All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <button onClick={() => setShowPrivacy(true)} className="hover:text-[#1d7d69] transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setShowTerms(true)} className="hover:text-[#1d7d69] transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {(showPrivacy || showTerms) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white/90 backdrop-blur-lg text-gray-800 rounded-2xl w-[90%] max-w-2xl p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowPrivacy(false);
                setShowTerms(false);
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-black transition"
            >
              <X size={22} />
            </button>

            {showPrivacy && (
              <>
                <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
                <p className="mb-4">
                  We value your privacy and handle your data responsibly. All personal data is collected only with your
                  consent and used strictly for service-related purposes.
                </p>
                <p className="mb-4">
                  Your information is encrypted and stored securely. You have full control over your data and may
                  request access or deletion at any time.
                </p>
                <p>Contact us for any privacy-related queries at <b>sreemeditec@gmail.com</b>.</p>
              </>
            )}

            {showTerms && (
              <>
                <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
                <p className="mb-4">
                  By using our services, you agree to comply with all applicable laws. All content provided is owned by
                  Sreemeditec and may not be reproduced without permission.
                </p>
                <p className="mb-4">
                  We reserve the right to update or terminate services at any time. Continued use implies agreement.
                </p>
                <p>Please reach out if you have any concerns regarding these terms.</p>
              </>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
