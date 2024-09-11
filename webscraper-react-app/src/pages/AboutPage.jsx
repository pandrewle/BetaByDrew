import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

function AboutPage() {
  return (
    <div
      className="aboutpage-container bg-primaryaccent flex flex-col gap-8 items-center lg:items-center lg:justify-start py-4"
      id="about"
    >
      <div className="about-section flex flex-col gap-4 items-center md:px-16 px-8">
        <h1 className="text-6xl font-extrabold text-center mt-20 ">
          ABOUT BETA BY DREW
        </h1>
        <h2 className="text-3xl text-slate-200 text-center font-semibold italic">
          {" "}
          "Built for climbers by climbers"
        </h2>
        <p className="text-2xl text-slate-200 text-center w-full font-medium">
          A web scraper built to help you find the best deals for outdoor gear.
          <br />
          Curated from trusted sellers.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 px-2">
          <a
            href="https://www.rei.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="assets/logos/rei-logo.png"
              alt="REI"
              className="aspect-auto w-[100px] h-[100px] lg:w-[160px] lg:h-[140px] object-contain py-4"
              loading="lazy"
            />
          </a>
          <a
            href="https://www.backcountry.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="assets/logos/Backcountry-Logos.png"
              alt="Backcountry"
              className="aspect-auto w-[100px] h-[100px] lg:w-[160px] lg:h-[140px] object-contain py-4"
              loading="lazy"
            />
          </a>

          <a
            href="https://www.publiclands.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="assets/logos/publiclands-logo.png"
              alt="Public Lands"
              className="aspect-auto w-[100px] h-[100px] lg:w-[160px] lg:h-[140px] object-contain py-4"
              loading="lazy"
            />
          </a>
          <a
            href="https://www.steepandcheap.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="assets/logos/steepandcheap-logo.png"
              alt="Steep and Cheap"
              className="aspect-auto w-[100px] h-[100px] lg:w-[160px] lg:h-[140px] object-contain py-4"
              loading="lazy"
            />
          </a>
          <a
            href="https://www.gearx.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="assets/logos/outdoorgearexchange-logo.png"
              alt="Outdoor Gear Exchange"
              className="aspect-auto w-[100px] h-[100px] lg:w-[160px] lg:h-[140px] object-contain py-4"
              loading="lazy"
            />
          </a>
        </div>
      </div>
      <div className="w-full flex flex-col lg:gap-16 justify-center items-center lg:flex-row mt-4 rounded-sm bg-primarycolor lg:py-16 md:px-16 md:py-4 py-16 px-8">
        <div className="lg:w-1/3 flex flex-col gap-4 justify-center items-center relative py-4">
          <h1 className="text-5xl font-bold text-slate-200 text-center">
            FROM THE CREATOR
          </h1>
          <p className="text-2xl font-medium text-slate-200 text-center w-[100%] my-4">
            Hi! I'm Andrew (Drew), a student studying Computer Science that
            loves the outdoors and rock climbing.
          </p>
          <p className="text-2xl font-medium text-slate-200 text-center w-[100%]">
            Beta By Drew is my first ever full-stack web application, and I'm
            really excited to share it with you!
          </p>
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center relative">
          <div className="lg:h-[500px] p-4">
            <img
              src="/assets/DrewPortrait.JPG"
              alt="Andrew"
              className="w-full h-full object-contain rounded-md"
            />
          </div>
          <div className="lg:h-[500px] p-4">
            <img
              src="/assets/DrewPortrait2.jpg"
              alt="Andrew2"
              className="w-full h-full object-contain rounded-md"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div className="contact-container flex flex-col gap-8 items-center md:px-16 px-8 md:px-16 md:py-4 py-16 px-8">
        <h1
          className="text-6xl font-extrabold text-slate-200 text-center mt-8 lg:mt-12"
          id="contact"
        >
          CONTACT
        </h1>
        <p className="text-2xl font-medium text-slate-200 text-center">
          As my first personal project, I hold a deep passion for Beta, so I
          will continue to build upon it. <br />
          Please let me know any suggestions you have!
        </p>
        <div className="flex flex-row gap-4 mb-8">
          <a
            href="https://www.linkedin.com/in/andrewphule/"
            className="hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={48} loading="lazy" />
          </a>
          <a
            href="https://www.instagram.com/andrew.ascents/"
            className="hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={48} loading="lazy" />
          </a>
          <a
            href="mailto:cnt.andrewle@gmail.com"
            className="hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope size={48} loading="lazy" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
