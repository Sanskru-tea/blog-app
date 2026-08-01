import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const excerpt =
    post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content;

  return (
    <div className="post-card">
      {post.coverImage ? (
        <img src={post.coverImage} alt={post.title} className="post-cover" />
      ) : (
        <div className="post-cover post-cover-placeholder">No Image</div>
      )}
      <div className="post-card-body">
        <span className="post-category">{post.category}</span>
        <h2 className="post-title">{post.title}</h2>
        <p className="post-excerpt">{excerpt}</p>
        <div className="post-meta">
          <span>By {post.author?.username || 'Unknown'}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="post-meta">
          <span>👁 {post.views} views</span>
        </div>
        <Link to={`/post/${post._id}`} className="read-more-btn">
          Read More &rarr;
        </Link>
      </div>
    </div>
  );
}
