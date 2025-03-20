import { FaFacebook, FaInstagram } from "react-icons/fa";

const NavbarComponent = () => {
  return (
    <footer className="border-t mt-8 sm:mt-12 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center sm:text-left">
            <h2 className="text-purple-600 font-semibold mb-4">Labour Link</h2>
            <p className="text-sm text-gray-600">
              Our job is to find you Mazdoor with at your Door Step on just a
              Phone call with free of cost.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4 mt-4">
              <a href="#" className="text-purple-600">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <FaInstagram size={20} />
                </div>
              </a>
              <a href="#" className="text-purple-600">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <FaFacebook size={20} />
                </div>
              </a>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-4">About</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>About Us</div>
              <div>Features</div>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-4">Company</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Why Labour Link?</div>
              <div>FAQ</div>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <p className="text-sm text-gray-600 mb-2">Question or feedback?</p>
            <p className="text-sm text-gray-600 mb-4">
              We'd love to hear from you
            </p>
            <div className="relative max-w-xs mx-auto sm:max-w-none sm:mx-0">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-4 pr-10 py-2 border rounded-full text-sm"
              />
              <button className="absolute right-3 top-2" aria-label="Submit">
                <svg
                  className="h-4 w-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t text-center text-sm text-gray-600">
          Copyright All Rights Reserved Labour Link.pk
        </div>
      </div>
    </footer>
  );
};

export default NavbarComponent;
