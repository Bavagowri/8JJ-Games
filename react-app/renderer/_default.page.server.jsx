// renderer/_default.page.server.jsx
import ReactDOMServer from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '../src/context/AuthContext'
import { ProfileProvider } from '../src/context/ProfileContext'
import { SearchProvider } from '../src/context/SearchContext'
import App from '../src/App'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'

export function render(pageContext) {
  const { urlPathname } = pageContext
  // Skip SSR for admin routes — auth-gated, no SEO value
  if (urlPathname.startsWith('/admin')) {
    return {
      documentHtml: escapeInject`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
            <link rel="icon" type="image/png" href="/images/8JJ_games.png" />
            <style>html { overscroll-behavior: none; }</style>
          </head>
          <body>
            <div id="root"></div>
          </body>
        </html>`,
      pageContext: {}
    }
  }
  const helmetContext = {}
  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <AuthProvider>
        <ProfileProvider>
          <SearchProvider>
            <App url={urlPathname} />
          </SearchProvider>
        </ProfileProvider>
      </AuthProvider>
    </HelmetProvider>
  )

  // ADD THIS — check what helmet contains
  console.log('helmetContext keys:', Object.keys(helmetContext))
  console.log('helmet:', helmetContext.helmet)

  const { helmet } = helmetContext

  return {
    documentHtml: escapeInject`<!DOCTYPE html>
      <html ${dangerouslySkipEscape(helmet.htmlAttributes.toString())}>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <!-- Critical styles -->
          <style>html { overscroll-behavior: none; }</style>

          <!-- Preconnect -->
          <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin="anonymous" />
          <link rel="preconnect" href="https://accounts.google.com" crossorigin="anonymous" />
          <link rel="dns-prefetch" href="https://appleid.cdn-apple.com" />
          <link rel="preconnect" href="https://assets.8jjgames.com" crossorigin="anonymous" />
          <link rel="dns-prefetch" href="https://assets.8jjgames.com" />

          <!-- Preload critical image -->

          <!-- Self-hosted font -->
          <link rel="preload" as="font" type="font/woff2" href="/fonts/nunito-variable.woff2" crossorigin="anonymous" />

          <!-- Favicon -->
          <link rel="icon" type="image/png" href="/images/8JJ_games.png" />
          <link rel="apple-touch-icon" href="/images/8JJ_games.png" />

          ${dangerouslySkipEscape(`
          <!-- Google tag (gtag.js) -->
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-CJKGMQP0L0"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CJKGMQP0L0', {
              page_path: window.location.pathname,
            });
          </script>
          `)}

          <!-- Helmet tags (title, meta, etc.) -->
          ${dangerouslySkipEscape(helmet.title.toString())}
          ${dangerouslySkipEscape(helmet.meta.toString())}
          ${dangerouslySkipEscape(helmet.link.toString())}
          ${dangerouslySkipEscape(helmet.script.toString())}
        </head>
        <body>
          <div id="root">${dangerouslySkipEscape(html)}</div>
        </body>
      </html>`,
    pageContext: {}
  }
}