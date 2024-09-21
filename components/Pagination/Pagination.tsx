import React from "react";
import './Pagination.scss'
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="pagination">
     
      {pages.map(page => (
        <button 
          key={page} 
          onClick={() => onPageChange(page)} 
          disabled={page === currentPage}
          className={page === currentPage ? "active" : ""}
        >
          {page}
        </button>
      ))}
   
    </div>
  );
};

export default Pagination;
