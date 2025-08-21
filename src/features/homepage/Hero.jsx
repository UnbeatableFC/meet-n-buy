import { Button } from "../../components/ui/button";

const Hero = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex flex-col justify-center items-center text-center max-w-4xl px-4 sm:px-6 md:px-12">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col space-y-6">
          <h1 className="text-5xl sm:text-5xl md:text-7xl font-extrabold leading-tight text-primary drop-shadow-lg">
            Meet'N'Buy
          </h1>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold text-accent-content max-w-xl mx-auto">
            Buy, Chat, and Meet Up to Get What You Need
          </h2>
          <p className="py-4 text-base sm:text-lg text-base-content max-w-md mx-auto">
            A smarter marketplace where buyers and sellers connect
            easily. Discover great deals and make meaningful
            connections.
          </p>
          <div className="flex sm:flex-row gap-6 sm:gap-8 justify-center mt-6">
            <button className="btn btn-primary btn-lg shadow-lg hover:scale-105 transform transition duration-300 w-fit sm:w-auto">
              Start Buying Now
            </button>
            <button className="btn btn-secondary btn-lg shadow-lg hover:scale-105 transform transition duration-300 w-fit sm:w-auto">
              Sell Your Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
