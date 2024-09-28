import React from 'react';

interface PaginationProps {
  currentPageIndex: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPageIndex, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = currentPageIndex * itemsPerPage + 1;
  const endItem = Math.min(totalItems, (currentPageIndex + 1) * itemsPerPage);

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      onPageChange(currentPageIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      onPageChange(currentPageIndex + 1);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
      {/* Prev Button */}
      <button onClick={handlePrev} disabled={currentPageIndex === 0}>
        Prev
      </button>

      {/* Page Info */}
      <span>
        {startItem}-{endItem} of {totalItems}
      </span>

      {/* Next Button */}
      <button onClick={handleNext} disabled={currentPageIndex === totalPages - 1}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
