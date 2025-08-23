import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Footer Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Quick Links */}
          <div>
            <h4 className="text-lg md:text-xl text-blue-700 font-semibold mb-8">
              QUICK LINKS
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-blue-700 transition-colors"
                >
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-blue-700 transition-colors"
                >
                  CONTACT US
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-600 hover:text-blue-700 transition-colors"
                >
                  FAQ's
                </Link>
              </li>
              <li>
                <Link
                  to="/agreement"
                  className="text-gray-600 hover:text-blue-700 transition-colors"
                >
                  PROFESSIONAL AGREEMENT DETAILS
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-gray-600 hover:text-blue-700 transition-colors"
                >
                  PRNV SERVICES REFUND POLICY
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-lg md:text-xl text-blue-700 font-semibold mb-8">
              CONTACT US
            </h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-700 mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-600 text-sm">
                  301, Sai Manor Apartments, Near Umesh Chandra Statue, Beside
                  Metro Station S.R. Nagar, Hyderabad - 500038
                </p>
              </div>

              <div className="flex items-center">
                <Phone className="w-5 h-5 text-blue-700 mr-3" />
                <p className="text-gray-600">9059789177, 9603558369</p>
              </div>

              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-700 mr-3" />
                <p className="text-gray-600">prnvservices@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg md:text-xl text-blue-700 font-semibold mb-8">
              SOCIAL LINKS
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy-policy"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                PRIVACY POLICY
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                to="/terms"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                TERMS & CONDITIONS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
