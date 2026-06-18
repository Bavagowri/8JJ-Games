// src/components/mobile/MobileBreadcrumb/MobileBreadcrumb.jsx

import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./MobileBreadcrumb.css";

/**
 * MobileBreadcrumb Component
 * 
 * A modern, card-stack style breadcrumb navigation for mobile pages
 * 
 * @param {Array} items - Array of breadcrumb items
 * @param {string} items[].label - Display text
 * @param {string} items[].path - Navigation path (optional for last item)
 * @param {string} items[].icon - Icon emoji or image path (optional)
 * 
 * @example
 * <MobileBreadcrumb 
 *   items={[
 *     { label: "Home", path: "/", icon: "🏠" },
 *     { label: "All Games", path: "/all-8jj-games", icon: "🎮" },
 *     { label: "Action", icon: "⚡" }
 *   ]}
 * />
 */

export default function MobileBreadcrumb({ items = [] }) {
  const navigate = useNavigate();

  if (!items || items.length === 0) return null;

  const handleClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <nav className="mobile-breadcrumb-stack" aria-label="Breadcrumb">
      <div className="breadcrumb-stack-container">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = isLast;

          return (
            <div key={index} className="breadcrumb-stack-wrapper">
              {/* Breadcrumb Card */}
              <button
                className={`breadcrumb-card ${isCurrent ? 'breadcrumb-card-current' : ''}`}
                onClick={() => handleClick(item.path)}
                disabled={isCurrent}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`${item.label}${isCurrent ? ' (current page)' : ''}`}
              >
                {item.icon && (
                  <span className="breadcrumb-card-icon" aria-hidden="true">
                    {item.icon.startsWith('/') || item.icon.startsWith('http') ? (
                      <img 
                        src={item.icon} 
                        alt="" 
                        className="breadcrumb-card-icon-img"
                      />
                    ) : (
                      item.icon
                    )}
                  </span>
                )}
                <span className="breadcrumb-card-label">{item.label}</span>
              </button>

              {/* Arrow separator (except for last item) */}
              {!isLast && (
                <span className="breadcrumb-arrow" aria-hidden="true">
                  ➜
                </span>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

MobileBreadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
      icon: PropTypes.string,
    })
  ).isRequired,
};