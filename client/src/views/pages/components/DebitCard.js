import React from 'react';

const DebitCard = ({ name }) => {
  return (
    <div className="debit-card">
      <div className="debit-card-heading">Bank Account</div>
      <div className="debit-card-name">{name}</div>
      <div className="debit-card-number">
        XXXX XXXX XXXX XXXX
      </div>
    </div>
  );
};

export default DebitCard;
