import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CalculateFootprintButton = ({ className }) => {
  return (
    <>
      <Link to="/app" className={`custom-calc-btn type1 ${className || ''}`}>
        <span className="btn-txt flex items-center gap-2">
          Calculate Footprint
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Link>

      <style>{`
        .custom-calc-btn {
          height: 60px;
          min-width: 240px;
          padding: 0 30px;
          position: relative;
          background-color: #ffffff;
          cursor: pointer;
          border: 2px solid #ffffff;
          overflow: hidden;
          border-radius: 30px;
          color: #000000;
          transition: all 0.5s ease-in-out;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .btn-txt {
          z-index: 10;
          font-weight: 800;
          letter-spacing: 2px;
          position: relative;
        }

        .type1::after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          transition: all 0.5s ease-in-out;
          background-color: #000000;
          border-radius: 30px;
          visibility: hidden;
          height: 10px;
          width: 10px;
          z-index: 1;
        }

        .custom-calc-btn:hover {
          box-shadow: 1px 1px 200px #252525;
          color: #ffffff;
          border: 2px solid #000000;
        }

        .type1:hover::after {
          visibility: visible;
          transform: scale(100) translateX(2px);
        }
      `}</style>
    </>
  );
};

export default CalculateFootprintButton;
