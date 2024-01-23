import React from 'react';

import { Typography, Button, Pagination as Pagi } from '@mui/material';

import useStyles from './styles';

const Pagination = ({ currentPage, totalPages, setPage }) => {
  const classes = useStyles();

  const handleChange = (event, value) => {
    setPage(value);
  };

  if (totalPages === 0) return null;

  return (
    <div className={classes.container}>
      <Pagi count={totalPages} page={currentPage} onChange={handleChange} />
    </div>
  );
};

export default Pagination;
