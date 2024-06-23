import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../src/styles.css'; // Import your main styles.css

const Dashboard = () => {
  const [news, setNews] = useState([]);
  const [representatives, setRepresentatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
        withCredentials: true,
      };

      try {
        const newsResponse = await axios.get('http://localhost:5001/api/news', config);
        const repsResponse = await axios.get('http://localhost:5001/api/representatives', config);
        setNews(newsResponse.data.articles);
        setRepresentatives(repsResponse.data.results);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="row">
        <div className="col-md-6">
          <h2>Recent News</h2>
          <div className="dashboard-card-container">
            {news.map((article, index) => (
              <div key={index} className="card mb-3 dashboard-card">
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Read more
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <h2>Your Representatives</h2>
          <div className="dashboard-card-container">
            {representatives.map((rep, index) => (
              <div key={index} className="card mb-3 dashboard-card">
                <div className="card-body">
                  <h5 className="card-title">{rep.name}</h5>
                  <p className="card-text">{rep.current_role.title} - {rep.party}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
