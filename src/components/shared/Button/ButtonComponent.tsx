import React, { useState } from 'react';
import Button from '@mui/material/Button';
import './BouncyButton.css';
import { ButtonProps } from '../../../types/Button';

const BouncyButton = (props: ButtonProps) => {
    const { title, onClick, style } = props
    const [isBouncing, setIsBouncing] = useState(false);

    const handleButtonClick = () => {
        setIsBouncing(true);
        setTimeout(() => {
            setIsBouncing(false);
        }, 500);
        setTimeout(() => {
            onClick()
        }, 200)
    };

    return (
        <Button
            sx={style}
            className={`bouncy-button ${isBouncing ? 'bounce' : ''}`}
            onClick={handleButtonClick}
            variant="contained"
            color="primary"
        >
            {title}
        </Button>
    );
};

export default BouncyButton;