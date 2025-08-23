import React from 'react';
import { useParams } from 'react-router-dom';
import BlogDetail from '../components/blogs/BlogDetail';
import { Blog } from '../types/blog';

interface BlogDetailPageProps {
  blogs: Blog[];
  onBackToBlogs: () => void;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ blogs, onBackToBlogs }) => {
  const { id } = useParams<{ id: string }>();
  const blog = blogs.find(b => b.id === parseInt(id || '0'));

  return <BlogDetail blog={blog || null} onBack={onBackToBlogs} />;
};

export default BlogDetailPage;