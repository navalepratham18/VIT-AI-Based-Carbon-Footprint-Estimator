import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GetStartedButton = ({ className }) => {
  return (
    <>
      <Link to="/app" className={`gs-btn ${className || ''}`}>
        Get started
        <div className="gs-icon">
          <ArrowRight className="w-5 h-5" />
        </div>
      </Link>

      <style>{`
        .gs-btn {
          background: #000000;
          color: white;
          font-family: inherit;
          padding: 0.35em;
          padding-left: 1.2em;
          font-size: 17px;
          font-weight: 500;
          border-radius: 0.9em;
          border: none;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          box-shadow: inset 0 0 1.6em -0.6em #ffffff;
          overflow: hidden;
          position: relative;
          height: 2.8em;
          padding-right: 3.3em;
          cursor: pointer;
          text-decoration: none;
        }

        .gs-icon {
          background: white;
          margin-left: 1em;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 2.2em;
          width: 2.2em;
          border-radius: 0.7em;
          box-shadow: 0.1em 0.1em 0.6em 0.2em #000000;
          right: 0.3em;
          transition: all 0.3s;
          color: black;
        }

        .gs-btn:hover .gs-icon {
          width: calc(100% - 0.6em);
        }

        .gs-btn:active .gs-icon {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
};

export default GetStartedButton;
