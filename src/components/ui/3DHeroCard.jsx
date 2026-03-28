import React from 'react';
import CountUp from 'react-countup';

const ThreeDHeroCard = () => {
  return (
    <>
      <div className="parent-3d w-full h-full relative cursor-pointer perspective-1000">
        <div className="card-3d w-full h-full relative">
          
          <div className="content-box-3d flex flex-col items-center">
            <span className="card-title-3d text-[#808080] font-medium mb-4 tracking-wider uppercase text-sm block text-center">Real-time Carbon Avoided</span>
            
            <div className="flex items-baseline gap-2 justify-center">
                <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-md">
                    <CountUp
                        start={0}
                        end={1950}
                        duration={3.5}
                        separator=","
                        useEasing={true}
                        delay={0.5}
                    />
                </span>
                <span className="text-2xl font-bold text-white">kg</span>
            </div>
            <span className="card-content-3d mt-2 text-3xl font-bold text-white/40 block text-center">CO₂</span>

            <div className="see-more-3d mt-12 w-full max-w-[200px] h-2 bg-[#333333] rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-gradient-to-r from-[#008B8B] to-[#00FFFF] w-full origin-left animate-[scale-x_2s_ease-out_forwards]" style={{ transform: 'scaleX(0)' }}></div>
            </div>
          </div>
          
          <div className="date-box-3d">
            <span className="month-3d">GOAL</span>
            <span className="date-3d">2K</span>
          </div>
        </div>
      </div>

      <style>{`
        .parent-3d {
          width: 100%;
          height: 100%;
          padding: 20px;
          perspective: 1000px;
          margin: 0 auto;
        }

        .card-3d {
          padding-top: 15%;
          border: 3px solid #00FFFF;
          transform-style: preserve-3d;
          background: linear-gradient(135deg, transparent 18.75%, #333333 0 31.25%, transparent 0),
              repeating-linear-gradient(45deg, #333333 -6.25% 6.25%, #1A1A1A 0 18.75%);
          background-size: 60px 60px;
          background-position: 0 0, 0 0;
          background-color: #1A1A1A;
          box-shadow: rgba(0, 255, 255, 0.1) 0px 30px 30px -10px;
          transition: all 0.5s ease-in-out;
          border-radius: 24px;
        }

        .parent-3d:hover .card-3d {
          transform: rotate3d(1, 1, 0, 30deg);
          box-shadow: rgba(0, 255, 255, 0.3) 30px 50px 25px -40px, rgba(0, 255, 255, 0.1) 0px 30px 30px -10px;
        }

        .content-box-3d {
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(0, 255, 255, 0.2);
          transition: all 0.5s ease-in-out;
          padding: 10% 25px 25px 25px;
          transform-style: preserve-3d;
          margin: 0 5% 5% 5%;
          height: 85%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .parent-3d:hover .content-box-3d {
          transform: translate3d(0px, 0px, 50px);
        }

        .date-box-3d {
          position: absolute;
          top: 6%;
          right: 6%;
          height: 60px;
          width: 60px;
          background: #1A1A1A;
          border: 2px solid #00FFFF;
          border-radius: 12px;
          padding: 8px;
          transform: translate3d(0px, 0px, 60px);
          box-shadow: rgba(0, 0, 0, 0.5) 0px 15px 10px -5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.5s ease-in-out;
        }

        .parent-3d:hover .date-box-3d {
            transform: translate3d(0px, 0px, 100px) rotate(5deg);
        }

        .date-box-3d span {
          display: block;
          text-align: center;
          line-height: 1;
        }

        .date-box-3d .month-3d {
          color: #008B8B;
          font-size: 10px;
          font-weight: 800;
          margin-bottom: 2px;
        }

        .date-box-3d .date-3d {
          font-size: 22px;
          font-weight: 900;
          color: #00FFFF;
        }

        @keyframes scale-x {
          to { transform: scaleX(0.975); }
        }
      `}</style>
    </>
  );
};

export default ThreeDHeroCard;
