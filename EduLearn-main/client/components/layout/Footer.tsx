import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white mt-16" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="container-max py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-3 text-white/80">
            <li><Link to="/" onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="hover:text-white">Home</Link></li>
            <li><Link to="/about" onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-3 text-white/80">
            <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Connect</h3>
          <ul className="space-y-3 text-white/80">
            <li><a href="#" aria-label="Facebook" className="hover:text-white">Facebook</a></li>
            <li><a href="#" aria-label="Twitter" className="hover:text-white">Twitter</a></li>
            <li><a href="#" aria-label="Instagram" className="hover:text-white">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-max py-6 text-center text-white/70 text-sm">
          © 2025 EduLearn. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
