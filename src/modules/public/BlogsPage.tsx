import React, { useState } from 'react';
import { BookOpen, Search, Clock, Tag, User, ArrowRight } from 'lucide-react';
import { store } from '../../core/store';
import { BlogPost } from '../../core/types';

export const BlogsPage: React.FC = () => {
  const blogs = store.getBlogs().filter(b => b.isPublished);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedBlog) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <button className="btn btn-secondary btn-sm" style={{ marginBottom: '2rem' }} onClick={() => setSelectedBlog(null)}>
          ← Back to Insights Catalog
        </button>

        <div className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>{selectedBlog.category}</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>{selectedBlog.title}</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', borderBottom: '1px solid var(--bg-glass-border)', paddingBottom: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={16} /> {selectedBlog.author}</span>
          <span>•</span>
          <span>{selectedBlog.publishDate}</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {selectedBlog.readingTimeMinutes} min read</span>
        </div>

        <img src={selectedBlog.coverImageUrl} alt={selectedBlog.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem' }} />

        <div className="glass-panel" style={{ padding: '2.5rem', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-primary)', whitespace: 'pre-line' }}>
          {selectedBlog.content}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {selectedBlog.tags.map((t, i) => <span key={i} className="badge badge-info"><Tag size={12} /> {t}</span>)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>Knowledge Base & Research</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Enterprise Pest Science & Insights</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Articles on thermal acoustic telemetry, FDA sanitation compliance, and biological pest control.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%', position: 'relative' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search articles by keyword or category..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.75rem' }}
        />
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
      </div>

      {/* Blog Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {filteredBlogs.map(blog => (
          <div key={blog.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }} onClick={() => setSelectedBlog(blog)}>
            <img src={blog.coverImageUrl} alt={blog.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-purple">{blog.category}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> {blog.readingTimeMinutes} min</span>
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>{blog.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1, lineHeight: 1.6 }}>
              {blog.summary}
            </p>
            <div style={{ borderTop: '1px solid var(--bg-glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              <span>Read Full Article</span>
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
