import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, variant = 'primary', onClick, className = '', ...props }) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
