import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import OmniMall from "./ui/OmniMall";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-medium text-white flex items-center gap-3">
              <OmniMall className={"size-2"} />
            </h2>

            <p className="mt-8 sm:text-lg text-md leading-relaxed max-w-sm">
              Your all-in-one destination for curated products delivered to your
              door.
              <br />
              <br />
              Quality meets convenience.
            </p>

            <div className="flex gap-5 mt-10">
              {[FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter].map(
                (Icon, index) => (
                  <button
                    key={index}
                    className="p-2 rounded-full border border-gray-700 flex items-center justify-center hover:border-white transition"
                  >
                    <Icon size={20} />
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Shop */}

          <div>
            <h3 className="uppercase text-sm tracking-[0.25em] text-gray-500 mb-8">
              Shop
            </h3>

            <ul className="space-y-5 sm:text-2xl text-lg">
              <li>
                <a href="#" className="hover:text-white transition">
                  New arrivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Best sellers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Deals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Gift cards
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="uppercase text-sm tracking-[0.25em] text-gray-500 mb-8">
              Support
            </h3>

            <ul className="space-y-5 sm:text-2xl text-lg">
              <li>
                <a href="#" className="hover:text-white transition">
                  Help center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Track order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Shipping info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="uppercase text-sm tracking-[0.25em] text-gray-500 mb-8">
              Stay Updated
            </h3>

            <p className="text-lg leading-relaxed mb-10">
              Get deals and new arrivals in your inbox.
            </p>

            <div className="flex">
              <button className="h-10 px-4 border border-gray-700 rounded-xl text-white text-lg hover:bg-white hover:text-black transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-16 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-lg">© 2026 OmniMall. All rights reserved.</p>

            <div className="flex gap-10 text-lg">
              <a href="#" className="hover:text-white transition">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms
              </a>
              <a href="#" className="hover:text-white transition">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
