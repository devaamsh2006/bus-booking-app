import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="text-lg font-bold">BusBuddy</h1>
          <p className="text-sm">Your trusted bus booking platform.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <a href="#about" className="hover:text-gray-400">About Us</a>
          <a href="#contact" className="hover:text-gray-400">Contact</a>
          <a href="#privacy" className="hover:text-gray-400">Privacy Policy</a>
          <a href="#faq" className="hover:text-gray-400">FAQ</a>
        </div>

        <div className="mt-4 md:mt-0">
          <p className="text-sm">&copy; {new Date().getFullYear()} BusBuddy. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
