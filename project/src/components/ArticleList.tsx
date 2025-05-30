import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Article, getArticles } from '../utils/articles';

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <Link
          key={article.slug}
          to={`/article/${article.slug}`}
          className="group article-card"
        >
          <div className="p-6">
            <h2 className="article-title">
              {article.title}
            </h2>
            <div className="article-date">
              {article.date}
            </div>
            <p className="article-excerpt">
              {article.excerpt}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
} 