import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

function AboutPage() {
  return (
    <div
      className="aboutpage-container flex flex-col gap-8 items-center lg:items-center lg:justify-start px-16 py-4"
      id="about"
    >
      <h1 className="text-5xl font-bold bg-purple-500 text-center mt-20">
        ABOUT BETA BY DREW
      </h1>
      <p className="text-2xl bg-purple-500 text-slate-200 text-center w-full lg:w-[70%]">
        A web scraper built to help you find the best deals for outdoor gear.
        Curated from trusted retailers and resellers, such as REI, Backcountry,
        and more.
      </p>
      <div className="flex flex-col gap-8 justify-center items-center lg:flex-row lg:w-full lg:items-center">
        <div className="bg-red-400 lg:w-1/2 flex flex-col gap-8 justify-center items-center relative">
          <h1 className="text-5xl text-slate-200 text-center">
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
      <h1 className="text-5xl text-slate-200 text-center" id="contact">
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
