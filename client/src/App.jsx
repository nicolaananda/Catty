import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

// Lazy Load Pages for Performance
const Home = React.lazy(() => import('./pages/Home'));
const Inbox = React.lazy(() => import('./pages/Inbox'));
const Admin = React.lazy(() => import('./pages/Admin'));

function App() {
  const expiredDate = import.meta.env.VITE_EXPIRED_DATE;

  if (expiredDate) {
    const [day, month, year] = expiredDate.split('-').map(Number);
    // Month is 0-indexed in JS Date
    const expiryDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    // Check if current date is strictly after expiry date
    // Set time to 00:00:00 for accurate date comparison
    expiryDate.setHours(23, 59, 59, 999);

    if (currentDate > expiryDate) {
      return (

        <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white font-sans overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-[url('/catsflix-bg.png')] bg-cover bg-center opacity-50 contrast-125"
              style={{
                animation: 'slowZoom 30s infinite alternate ease-in-out'
              }}
            ></div>
            {/* Custom Keyframes Style */}
            <style>{`
                    @keyframes slowZoom {
                        0% { transform: scale(1); }
                        100% { transform: scale(1.1); }
                    }
                `}</style>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>

          <div className="z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center text-center">

            {/* Branding */}
            <div className="mb-8">
              <span className="font-bold text-4xl md:text-5xl tracking-tighter text-amber-500 uppercase drop-shadow-sm">
                Catty
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-tight max-w-4xl drop-shadow-2xl">
              WEB <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">EXPIRED</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 mb-8 font-medium drop-shadow-md max-w-2xl">
              The service period for this application has ended. Access is currently restricted.
            </p>

            <div className="mt-8 px-8 py-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
              <p className="text-lg text-slate-300 font-mono">
                Please contact the administrator for renewal.
              </p>
            </div>
          </div>
        </div>
      );

    }
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-pink-500 font-bold">Loading Catty... 🐈</div>}>
                <Home />
              </React.Suspense>
            } />
            <Route path="/inbox/:user" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-pink-500 font-bold">Loading Inbox... 📩</div>}>
                <Inbox />
              </React.Suspense>
            } />
            <Route path="/admin" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-pink-500 font-bold">Loading Admin... ⚙️</div>}>
                <Admin />
              </React.Suspense>
            } />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

