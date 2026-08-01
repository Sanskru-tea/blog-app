import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPost, deletePost } from '../services/api';
import Spinner from '../components/Spinner';

export default function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPost(id)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Post not found');
        setLoading(false);
      });
  }, [id]);

  const isOwner = isAuthenticated && post && post.author && user?.id === post.author._id;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }
    setDeleting(true);
    try {
      await deletePost(id);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete post');
      setDeleting(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="error-msg centered">{error}</p>;
  if (!post) return null;

  return (
    <div className="single-post-container">
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="single-post-cover" />
      )}
      <div className="single-post-body">
        <span className="post-category">{post.category}</span>
        <h1 className="single-post-title">{post.title}</h1>

        <div className="post-meta single-post-meta">
          <span>By <strong>{post.author?.username}</strong></span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>👁 {post.views} views</span>
        </div>

        {post.tags?.length > 0 && (
          <div className="tag-list">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="single-post-content">
          {post.content.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {isOwner && (
          <div className="post-actions">
            <Link to={`/edit/${post._id}`} className="btn-secondary">
              Edit Post
            </Link>
            <button className="btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
