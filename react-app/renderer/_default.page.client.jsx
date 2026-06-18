// // renderer/_default.page.client.jsx
// import { hydrateRoot } from 'react-dom/client'
// import { HelmetProvider } from 'react-helmet-async'
// import { AuthProvider } from '../src/context/AuthContext'
// import { ProfileProvider } from '../src/context/ProfileContext'
// import { SearchProvider } from '../src/context/SearchContext'
// import { GoogleOAuthProvider } from '@react-oauth/google'
// import App from '../src/App'
// import '../src/index.css'
// // import '../src/App.css'

// export function render(pageContext) {
//   hydrateRoot(
//     document.getElementById('root'),
//     <HelmetProvider>
//       <AuthProvider>
//         <ProfileProvider>
//             <SearchProvider>
//               <App />
//             </SearchProvider>
//         </ProfileProvider>
//       </AuthProvider>
//     </HelmetProvider>
//   )
// }

import { hydrateRoot, createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '../src/context/AuthContext'
import { ProfileProvider } from '../src/context/ProfileContext'
import { SearchProvider } from '../src/context/SearchContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from '../src/App'
import '../src/index.css'

export function render(pageContext) {
  const container = document.getElementById('root')

  const app = (
    <HelmetProvider>
      <AuthProvider>
        <ProfileProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
        </ProfileProvider>
      </AuthProvider>
    </HelmetProvider>
  )

  // If root has no SSR content, do a fresh render instead of hydrating
  if (!container.hasChildNodes()) {
    createRoot(container).render(app)
  } else {
    hydrateRoot(container, app)
  }
}