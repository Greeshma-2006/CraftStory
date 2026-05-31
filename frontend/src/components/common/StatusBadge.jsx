import React from 'react';

const StatusBadge = ({ status }) => {

  const getStyles = () => {

    switch (status) {

      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300';

      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';

      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';

      case 'revoked':
        return 'bg-gray-200 text-gray-700 border-gray-400';

      default:
        return 'bg-[#F5E6D3] text-[#6B3E2E] border-[#D8C2AF]';
    }
  };

  return (

    <span
      className={`px-4 py-2 rounded-full border text-sm font-semibold capitalize ${getStyles()}`}
    >
      {status}
    </span>

  );
};

export default StatusBadge;