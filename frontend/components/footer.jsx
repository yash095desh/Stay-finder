import React from "react";

const Footer = () => {
  return (
    <footer className=" bg-slate-50 w-full ">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 px-6 py-12 container mx-auto text-sm text-muted-foreground ">

      <div className="col-span-1 ">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          StayFinder
        </h2>
        <p className="leading-snug">
          Your gateway to unforgettable stays. Book comfortable, curated homes
          in prime locations with ease and confidence.
        </p>
      </div>

      {/* Right: Get In Touch */}
      <div>
        <h3 className="text-md font-semibold text-foreground mb-2">
          Get In Touch
        </h3>
        <ul className="space-y-1">
          <li>Email: support@stayfinder.com</li>
          <li>Phone: +1 234 567 890</li>
          <li>Location: Mumbai, India</li>
        </ul>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-md font-semibold text-foreground mb-2">
          Quick Links
        </h3>
        <ul className="space-y-1">
          <li>Home</li>
          <li>Explore</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>

      {/* Our Services */}
      <div>
        <h3 className="text-md font-semibold text-foreground mb-2">
          Our Services
        </h3>
        <ul className="space-y-1">
          <li>Flexible Booking</li>
          <li>Verified Hosts</li>
          <li>24/7 Support</li>
          <li>Secure Payments</li>
        </ul>
      </div>
      
      </div>
    </footer>
  );
};

export default Footer;
