import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../src'; // Import the custom CSS file

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  const fetchNews = async (searchQuery = '') => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/news', {
        params: { q: searchQuery },
        withCredentials: true,
      });
      setNews(response.data.articles);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(query);
  };

  return (
    <div className="container news-container">
      <h1 className="news-title">Latest News</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search news articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </form>
      {loading && <div className="text-center my-5">Loading...</div>}
      {error && <div className="text-center my-5">Error: {error.message}</div>}
      <div className="row justify-content-center">
        {news.map((article, index) => (
          <div key={index} className="col-md-4 mb-4 d-flex">
            <div className="card news-card h-100">
              {article.urlToImage && (
                <img src={article.urlToImage} className="card-img-top" alt={article.title} />
              )}
              <div className="news-card-body">
                <h5 className="news-card-title">{article.title}</h5>
                <p className="news-card-date">{new Date(article.publishedAt).toLocaleDateString()} - {article.source.name}</p>
                <p className="news-card-text">{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-read-more mt-2">
                  Read more
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
