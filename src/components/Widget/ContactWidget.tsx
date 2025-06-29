"use client";

import Link from "next/link";
import Image from "next/image";

const ContactWidget = () => {
  return (
    <Link
      href="https://www.youtube.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="fixed bottom-20 right-5 bg-secondary-100 border border-secondary-100 text-white p-3 rounded-full cursor-pointer hover:bg-primary-400 transition-colors flex items-center justify-center">
        <Image
          src="/images/logo_bcoffee.svg"
          alt="Contact Icon"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
    </Link>
  );
};

export default ContactWidget;
