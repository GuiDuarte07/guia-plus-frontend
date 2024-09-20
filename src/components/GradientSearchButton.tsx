import React from 'react';
import { styled } from '@mui/material';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface GradientSearchButtonProps {
  onClick?: () => void;
}

const GradientButton = styled(IconButton)(() => ({
  background: 'linear-gradient(45deg, #2196F3 2%, #21CBF3 90%)',
  color: 'white',
  borderRadius: '8px', // Mais quadrado
  width: '40px', // Ajuste o tamanho conforme necessário
  height: '40px', // Ajuste o tamanho conforme necessário
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
  },
}));

const GradientSearchButton: React.FC<GradientSearchButtonProps> = ({ onClick }) => {
  return (
    <GradientButton onClick={onClick}>
      <SearchIcon />
    </GradientButton>
  );
};

export default GradientSearchButton;
