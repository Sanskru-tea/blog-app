import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import Spinner from '../components/Spinner';
import { getPosts } from '../services/api';

const CATEGORIES = ['All', 'Technology', 'Travel', 'Food', 'Health', 'Business', 'Other'];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    setError('');

    const params = { page, limit: 9 };
    if (category !== 'All') params.category = category;

    getPosts(params)
      .then((res) => {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load posts. Is the backend server running?');
        setLoading(false);
      });
  }, [page, category]);

  return (
    <div className="home-container">
      <div className="hero">
        <h1>
          Latest <span className="highlight">Blog Posts</span>
        </h1>
        <p className="hero-sub">Ideas, stories, and updates from our community of writers.</p>
      </div>

      <div className="category-filter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${category === cat ? 'active' : ''}`}
            onClick={() => {
              setCategory(cat);
              setPage(1);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <Spinner />}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <>
          <div className="posts-grid">
            {posts.length === 0 ? (
              <p className="empty-state">No posts yet. Be the first to write one!</p>
            ) : (
              posts.map((post) => <PostCard key={post._id} post={post} />)
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                &larr; Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
