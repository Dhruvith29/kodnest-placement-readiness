import React from 'react';
import styles from './Card.module.css';

const Card = ({ children, className = '', padding = 'md' }) => {
    return (
        <div className={`${styles.card} ${styles[padding]} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
