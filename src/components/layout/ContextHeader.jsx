import React from 'react';
import styles from './ContextHeader.module.css';

const ContextHeader = ({ title = 'Context Header', description = 'Clear purpose, no hype.' }) => {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
        </div>
    );
};

export default ContextHeader;
