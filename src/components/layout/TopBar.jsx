import React from 'react';
import styles from './TopBar.module.css';

const TopBar = ({ projectName = 'Project Name', currentStep = 1, totalSteps = 5, status = 'Not Started' }) => {
    return (
        <header className={styles.topBar}>
            <div className={styles.left}>
                <span className={styles.projectName}>{projectName}</span>
            </div>

            <div className={styles.center}>
                <span className={styles.progress}>Step {currentStep} / {totalSteps}</span>
            </div>

            <div className={styles.right}>
                <span className={`${styles.status} ${styles[status.toLowerCase().replace(' ', '')]}`}>{status}</span>
            </div>
        </header>
    );
};

export default TopBar;
