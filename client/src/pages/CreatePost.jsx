import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';

const CATEGORIES = ['Technology', 'Travel', 'Food', 'Health', 'Business', 'Other'];

export default function CreatePost() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Technology',
    coverImage: '',
    tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : []
      };
      const res = await createPost(payload);
      navigate(`/post/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <h1>Create New Post</h1>
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
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}
