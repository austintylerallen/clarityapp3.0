import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Representatives.css'; // Import your CSS file
import '../../src/styles.css'; // Import your global styles
import VoteModal from './VoteModal'; // Import the Vote Modal

const Representatives = () => {
  const [reps, setReps] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votes, setVotes] = useState([]); // Initialize as an empty array
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchReps = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5001/api/representatives', {
          headers: {
            'x-auth-token': token
          },
          withCredentials: true,
        });
        console.log('API Response:', response.data); // Log the API response

        if (response.data.results) {
          setReps(response.data.results); // Access the results array
        } else {
          console.log('Full API Response:', response.data); // Log the full response if results is undefined
          throw new Error('Invalid API response structure');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching representatives:', error);
        setError(error);
        setLoading(false);
      }
    };
    fetchReps();
  }, []);

  const fetchVotes = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      console.log(`Fetching votes for representative with ID: ${id}`);
      const response = await axios.get(`http://localhost:5001/api/representative/${id}/votes`, {
        headers: {
          'x-auth-token': token
        },
        withCredentials: true,
      });
      console.log('Vote API Response:', response.data); // Log the vote API response

      if (response.data.votes) {
        setVotes(response.data.votes);
        setShowModal(true);
      } else {
        throw new Error('Invalid vote API response structure');
      }
    } catch (error) {
      console.error('Error fetching votes:', error.message); // Log the error message
    }
  };

  const closeModal = () => {
    console.log('Closing modal');
    setShowModal(false);
  };

  if (loading) return <div className="representatives-container">Loading...</div>;
  if (error) return <div className="representatives-container">Error: {error.message}</div>;

  return (
    <div className="container representatives-container">
      <h1 className="page-header">Representatives</h1>
      <div className="row justify-content-center">
        {reps.map((rep, index) => (
          <div key={index} className="col-md-4 mb-4 d-flex">
            <div className="card h-100">
              {rep.image && <img src={rep.image} alt={`${rep.name}`} className="card-img-top" />}
              <div className="card-body">
                <h5 className="card-title">{rep.name || 'Unknown'}</h5>
                <p className="card-text">{rep.current_role.title}</p>
                <p className="card-text">{rep.party}</p>
                <button onClick={() => fetchVotes(rep.id)} className="btn btn-primary">View Votes</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && <VoteModal votes={votes} onClose={closeModal} />}
    </div>
  );
};

export default Representatives;
