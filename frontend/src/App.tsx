import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminCategories from './pages/AdminCategories';
import AdminLogin from './pages/AdminLogin';
import AdminPostCreate from './pages/AdminPostCreate';
import AdminPostEdit from './pages/AdminPostEdit';
import AdminPosts from './pages/AdminPosts';
import AdminTags from './pages/AdminTags';
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';

export default function App() {
  return (
    <Router>
        <Routes>
          <Route
            path="/"
            element={(
              <Layout>
                <Home />
              </Layout>
            )}
          />
          <Route
            path="/blog/:id"
            element={(
              <Layout>
                <BlogDetail />
              </Layout>
            )}
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
          <Route path="/admin/posts/new" element={<AdminPostCreate />} />
          <Route path="/admin/posts/:id/edit" element={<AdminPostEdit />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/tags" element={<AdminTags />} />
        </Routes>
    </Router>
  );
}
