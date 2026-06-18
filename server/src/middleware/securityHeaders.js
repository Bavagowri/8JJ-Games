// // server/src/middleware/securityHeaders.js



// const securityHeaders = (req, res, next) => {
//   // Strict-Transport-Security
//   res.setHeader(
//     'Strict-Transport-Security',
//     'max-age=31536000; includeSubDomains; preload'
//   );
//  X-Content-Type-Options,Referrer-Policy
//   // Content-Security-Policy
//   res.setHeader(
//     'Content-Security-Policy',
//     [
//       "default-src 'self'",
//       "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
//       "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
//       "font-src 'self' https://fonts.gstatic.com",
//       "img-src 'self' data: https:",
//       "connect-src 'self' https://www.google-analytics.com",
//       "frame-ancestors 'none'"
//     ].join('; ')
//   );

//   // X-Content-Type-Options
//   res.setHeader('X-Content-Type-Options', 'nosniff');

//   // Referrer-Policy
//   res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

//   // X-Frame-Options
//   res.setHeader('X-Frame-Options', 'DENY');

//   // X-XSS-Protection (for older browsers)
//   res.setHeader('X-XSS-Protection', '1; mode=block');

//   next();
// };

// module.exports = securityHeaders;




// server/src/middleware/securityHeaders.js

const securityHeaders = (req, res, next) => {
  // Strict-Transport-Security
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Content-Security-Policy
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",

      // Scripts: self + GTM + GA
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://appleid.cdn-apple.com",

      // Styles: self + inline + Google Fonts (still needed — fonts loaded lazily via JS createElement)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

      // Fonts: self + Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",

      // Images: self + data URIs + all HTTPS (covers assets.8jjgames.com, staging, prod)
      "img-src 'self' data: https:",

      // Connections: self + GA + assets CDN + staging + production API
      "connect-src 'self' https://www.google-analytics.com https://assets.8jjgames.com https://staging.8jjgames.com https://8jjgames.com",

      // Media: self + assets CDN (for banner videos)
      "media-src 'self' https://assets.8jjgames.com",

      // Frames: blocked (no iframes)
      "frame-ancestors 'none'",

      // Workers: self only
      "worker-src 'self'",
    ].join('; ')
  );

  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Referrer-Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');

  // X-XSS-Protection (for older browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Permissions-Policy — disable unused browser features
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  next();
};

module.exports = securityHeaders;