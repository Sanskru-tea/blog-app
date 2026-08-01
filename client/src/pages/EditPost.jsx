import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPost, updatePost } from '../services/api';
import Spinner from '../components/Spinner';

const CATEGORIES = ['Technology', 'Travel', 'Food', 'Health', 'Business', 'Other'];

export default function EditPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Technology',
    coverImage: '',
    tags: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getPost(id)
      .then((res) => {
        const post = res.data;

        if (user?.id !== post.author?._id) {
          setError('You are not authorized to edit this post');
          setLoading(false);
          return;
        }

        setForm({
          title: post.title,
          content: post.content,
          category: post.category,
          coverImage: post.coverImage || '',
          tags: (post.tags || []).join(', ')
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Post not found');
        setLoading(false);
      });
  }, [id, user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : []
      };
      await updatePost(id, payload);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="error-msg centered">{error}</p>;

  return (
    <div className="create-container">
      <h1>Edit Post</h1>
      {error && <p className="error-msg">{error}</p>}
      <form className="post-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Post Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          name="coverImage"
          placeholder="Cover Image URL (optional)"
          value={form.coverImage}
          onChange={handleChange}
        />
        <input
          name="tags"
          placeholder="Tags, comma separated (optional)"
          value={form.tags}
          onChange={handleChange}
        />
        <textarea
          name="content"
          rows="15"
          placeholder="Write your post here..."
          value={form.content}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
