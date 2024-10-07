import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface PaginationProps {
  currentPageIndex: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPageIndex, totalItems, itemsPerPage, onPageChange }) => {
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  console.log("tot items", totalItems, " tot pages",  totalPages, "items per page", itemsPerPage, "div" )
  const handlePrev = () => {
    if (currentPageIndex > 0) {
      onPageChange(currentPageIndex - 1);
    }
  };

  const handleNext = () => {
    console.log("total,nav",totalPages, currentPageIndex)
    if (currentPageIndex < totalPages - 1) {
      onPageChange(currentPageIndex + 1);
    }
  };

  return (
    <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="4px" /* Reduced padding for a more compact look */
        bgcolor="#f9f9f9"
        borderRadius="8px"
        boxShadow={2}
    >
        {/* Prev Button */}
        <IconButton
            onClick={handlePrev}
            disabled={currentPageIndex === 0}
            size="small" /* Makes the button more compact */
            aria-label="previous page"
        >
            <ArrowBackIcon fontSize="small" /> {/* Smaller icon */}
        </IconButton>

        {/* Page Info */}
        <Typography variant="body2"> {/* Smaller font size */}
            Page {currentPageIndex + 1} of {totalPages}
        </Typography>

        {/* Next Button */}
        <IconButton
            onClick={handleNext}
            disabled={currentPageIndex + 1 === totalPages}
            size="small" /* Makes the button more compact */
            aria-label="next page"
        >
            <ArrowForwardIcon fontSize="small" /> {/* Smaller icon */}
        </IconButton>
    </Box>
);
};

export default Pagination;