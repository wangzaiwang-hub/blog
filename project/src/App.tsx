import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './lib/context/AuthContext';
import { MusicProvider } from './lib/context/MusicContext';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MusicProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/article/:slug" element={<ArticleDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Router>
        </MusicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;