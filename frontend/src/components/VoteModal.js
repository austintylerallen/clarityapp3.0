import React from 'react';
import './VoteModal.css'; // Create and import your CSS file for styling

const VoteModal = ({ votes, onClose }) => {
  console.log('Displaying VoteModal with votes:', votes);
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Votes</h2>
        <ul>
          {votes.map((vote, index) => (
            <li key={index}>
              {vote.bill_number}: {vote.vote_desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VoteModal;
