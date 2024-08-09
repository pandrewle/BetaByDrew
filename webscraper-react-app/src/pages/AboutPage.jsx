import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

function AboutPage() {
  return (
    <div
      className="aboutpage-container flex flex-col gap-8 items-center lg:items-center lg:justify-start md:px-16 px-8 py-4"
      id="about"
    >
      <h1 className="text-6xl font-extrabold bg-purple-500 text-center mt-20">
        ABOUT BETA BY DREW
      </h1>
      <h2 className="text-3xl text-slate-200 text-center font-medium italic">
        {" "}
        "Built for climbers by climbers"
      </h2>
      <p className="text-2xl bg-purple-500 text-slate-200 text-center w-full lg:w-[70%]">
        A web scraper built to help you find the best deals for outdoor gear.
        <br />
        Curated from trusted retailers and resellers.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 px-2">
        <img
          src="assets/logos/rei-logo.png"
          alt="REI"
          className="aspect-auto w-[100px] h-[80px] lg:w-[160px] lg:h-[140px] object-contain"
          loading="lazy"
        />
        <img
          src="assets/logos/Backcountry-Logo.png"
          alt="Backcountry"
          className="aspect-auto w-[100px] h-[80px] lg:w-[160px] lg:h-[140px] object-contain"
          loading="lazy"
        />
        <img
          src="assets/logos/moosejaw-logo.png"
          alt="Moosejaw"
          className="aspect-auto w-[100px] h-[80px] lg:w-[160px] lg:h-[140px] object-contain"
          loading="lazy"
        />
        <img
          src="assets/logos/steepandcheap-logo.png"
          alt="Steep and Cheap"
          className="aspect-auto w-[100px] h-[80px] lg:w-[160px] lg:h-[140px] object-contain"
          loading="lazy"
        />
        <img
          src="assets/logos/outdoorgearexchange-logo.png"
          alt="Outdoor Gear Exchange"
          className="aspect-auto w-[100px] h-[80px] lg:w-[160px] lg:h-[140px] object-contain"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-8 justify-center items-center lg:flex-row lg:w-full lg:items-center mt-4">
        <div className="bg-red-400 lg:w-1/2 flex flex-col gap-8 justify-center items-center relative">
          <h1 className="text-5xl font-semibold text-slate-200 text-center">
            FROM THE CREATOR
          </h1>
          <p className="text-2xl bg-red-500 text-slate-200 text-center w-[100%]">
            Hi! I'm Andrew (Drew), a student studying Computer Science that
            loves the outdoors and rock climbing. Beta By Drew is my first ever
            full-stack web application, and I'm really excited to share it with
            you!
          </p>
          <p className="text-2xl bg-red-500 text-slate-200 text-center w-[100%]">
            As my first personal project, I hold a deep passion for Beta, so I
            will continue to build upon it. Please let me know any suggestions
            you have!
          </p>
        </div>
        <div className="bg-blue-400 lg:w-1/2 flex flex-col gap-8 justify-center items-center relative">
          <div className="w-full h-full lg:h-[500px]">
            <img
              src="/assets/DSCF3171.JPG"
              alt="Andrew"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>
      </div>
      <h1
        className="text-6xl font-extrabold text-slate-200 text-center mt-8 lg:mt-12"
        id="contact"
      >
        CONTACT
      </h1>
      <div className="flex flex-row gap-4 mb-8">
        <a
          href="https://www.linkedin.com/in/andrew-le-a78833286/"
          className="hover:text-white"
        >
          <FaLinkedin size={48} />
        </a>
        <a
          href="https://www.instagram.com/andrew.ascents/"
          className="hover:text-white"
        >
          <FaInstagram size={48} />
        </a>
        <a href="mailto:cnt.andrewle@gmail.com" className="hover:text-white">
          <FaEnvelope size={48} />
        </a>
      </div>
    </div>
  );
}

export default AboutPage;
