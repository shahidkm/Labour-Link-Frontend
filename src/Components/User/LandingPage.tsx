import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <div className="bg-gradient-to-b from-white to-purple-50 min-h-screen flex flex-col items-center w-full">
     
      <nav className="w-full bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="font-extrabold text-purple-600">Labour Link</h1>
          <div className="hidden md:flex space-x-6">
            <button className="text-gray-600 hover:text-purple-600 transition">About</button>
            <button className="text-gray-600 hover:text-purple-600 transition">How it Works</button>
            <button className="text-gray-600 hover:text-purple-600 transition">Contact</button>
            <button 
              className="bg-purple-600 h-8 text-white px-4 py-1 shadow-lg rounded-lg hover:bg-purple-700 transition"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </div>
          <button 
            className="md:hidden text-gray-700"
            onClick={toggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>


        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg px-6 py-4">
            <div className="flex flex-col space-y-4">
              <button className="text-gray-600 hover:text-purple-600 transition py-2 border-b border-gray-100">About</button>
              <button className="text-gray-600 hover:text-purple-600 transition py-2 border-b border-gray-100">How it Works</button>
              <button className="text-gray-600 hover:text-purple-600 transition py-2 border-b border-gray-100">Contact</button>
              <button 
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition w-full"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </div>
          </div>
        )}
      </nav>

      
      <section className="w-full bg-white py-16">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-6">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Find the <span className="text-purple-600">Perfect Job</span> or Hire Skilled Workers
            </h2>
            <p className="text-gray-600 mt-4 text-lg max-w-lg">
              Connecting laborers and employers for a seamless hiring experience. Join our platform today and transform your career or business.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition transform hover:-translate-y-1">
                Get Started
              </button>
              <button className="border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition transform hover:-translate-y-1">
                Learn More
              </button>
            </div>
          </div>

       
          <div className="md:w-1/2 mt-10 md:mt-0 px-4">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="relative rounded-xl overflow-hidden h-48 transform transition hover:scale-105">
                <img
                  src="https://img.freepik.com/free-vector/illustration-us-labor-day-celebration_52683-128337.jpg?ga=GA1.1.1910338959.1738123276&semt=ais_hybrid"
                  alt="Worker"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-purple-900 via-purple-900/60 to-transparent">
                  <p className="text-white text-xl font-semibold">Skilled Laborers</p>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden h-48 transform transition hover:scale-105">
                <img
                  src="https://img.freepik.com/free-vector/architects-builders-learn-house-plan-desk_107791-13361.jpg?ga=GA1.1.1910338959.1738123276&semt=ais_hybrid"
                  alt="Employer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-purple-900 via-purple-900/60 to-transparent">
                  <p className="text-white text-xl font-semibold">Top Employers</p>
                </div>
              </div>
              <div className="relative col-span-2 rounded-xl overflow-hidden h-48 transform transition hover:scale-105">
                <img
                  src="https://img.freepik.com/free-vector/flat-employment-agency-search-new-employees-hire_88138-802.jpg?ga=GA1.1.1910338959.1738123276&semt=ais_hybrid"
                  alt="Hiring Process"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-purple-900 via-purple-900/60 to-transparent">
                  <p className="text-white text-xl font-semibold">Seamless Hiring Process</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  
      <section className="w-full bg-purple-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">How It Works</h3>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Our platform makes it easy to connect laborers with employers through a simple process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl text-purple-600 font-bold">1</span>
              </div>
              <h4 className="text-xl font-semibold text-center">Create Profile</h4>
              <p className="text-gray-600 mt-2 text-center">Sign up and create your detailed profile highlighting your skills or requirements.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl text-purple-600 font-bold">2</span>
              </div>
              <h4 className="text-xl font-semibold text-center">Connect</h4>
              <p className="text-gray-600 mt-2 text-center">Browse through opportunities or talents and find the perfect match.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl text-purple-600 font-bold">3</span>
              </div>
              <h4 className="text-xl font-semibold text-center">Collaborate</h4>
              <p className="text-gray-600 mt-2 text-center">Finalize details, communicate directly, and start working together.</p>
            </div>
          </div>
        </div>
      </section>

     
      <section className="w-full bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">What People Say</h3>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Hear from workers and employers who found success with Labour Link.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-purple-700 font-bold">MN</span>
                </div>
                <div>
                  <p className="font-bold text-purple-600">Muhammed Nifras</p>
                  <p className="text-sm text-gray-500">Employer</p>
                </div>
              </div>
              <p className="text-gray-800 italic">"Labour Link helped me find the best talent quickly! The platform's intuitive interface made posting jobs and reviewing applications a breeze."</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-purple-700 font-bold">S</span>
                </div>
                <div>
                  <p className="font-bold text-purple-600">Sadin</p>
                  <p className="text-sm text-gray-500">Worker</p>
                </div>
              </div>
              <p className="text-gray-800 italic">"I landed my dream job within a week! The matching algorithm really understands my skills and connects me with relevant opportunities."</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-purple-700 font-bold">H</span>
                </div>
                <div>
                  <p className="font-bold text-purple-600">Hakeem</p>
                  <p className="text-sm text-gray-500">Employer</p>
                </div>
              </div>
              <p className="text-gray-800 italic">"Super easy to post a job and get qualified candidates! The verification system ensures I only get serious applicants."</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-purple-700 font-bold">M</span>
                </div>
                <div>
                  <p className="font-bold text-purple-600">Maria</p>
                  <p className="text-sm text-gray-500">Worker</p>
                </div>
              </div>
              <p className="text-gray-800 italic">"I was struggling to find work, and this platform changed my life! Now I have consistent jobs and have built a trusted network of employers."</p>
            </div>
          </div>
        </div>
      </section>

    
      <section className="w-full bg-purple-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-white">Ready to Get Started?</h3>
          <p className="text-purple-100 mt-2 max-w-2xl mx-auto">
            Join thousands of happy users today and revolutionize how you find work or hire talent.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-purple-600 px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1"
              onClick={() => navigate("/login")}
            >
              Log In Now
            </button>
            <button className="bg-purple-700 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-purple-800 transition transform hover:-translate-y-1"
             onClick={() => navigate("/registration")}
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </section>

     
      <footer className="w-full bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-2xl font-bold text-purple-400">Labour Link</h1>
              <p className="mt-2 text-gray-400 max-w-md">
                Connecting skilled workers with quality employers since 2023.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h5 className="text-lg font-semibold mb-4">For Workers</h5>
                <ul className="space-y-2">
                  <li><button className="text-gray-400 hover:text-purple-400 transition">Find Jobs</button></li>
                  <li><button className="text-gray-400 hover:text-purple-400 transition">Create Profile</button></li>
                  <li><button className="text-gray-400 hover:text-purple-400 transition">Success Stories</button></li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-lg font-semibold mb-4">For Employers</h5>
                <ul className="space-y-2">
                  <li><button className="text-gray-400 hover:text-purple-400 transition">Post Jobs</button></li>
                  <li><button className="text-gray-400 hover:text-purple-400 transition">Browse Workers</button></li>
                  <li><button className="text-gray-400 hover:text-purple-400 transition">Hiring Guide</button></li>
                </ul>
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <h5 className="text-lg font-semibold mb-4">Contact</h5>
                <ul className="space-y-2">
                  <li className="text-gray-400">support@labourlink.com</li>
                  <li className="text-gray-400">+1 (123) 456-7890</li>
                  <li className="flex space-x-4 mt-4">
                    <button className="text-gray-400 hover:text-purple-400 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-purple-400 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/>
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-purple-400 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                      </svg>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-500">© 2025 Labour Link. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;