import React, { useState } from 'react';
import styles from './ProofFooter.module.css';

const ProofFooter = () => {
    const [checks, setChecks] = useState({
        ui: false,
        logic: false,
        test: false,
        deployed: false
    });

    const toggleCheck = (key) => {
        setChecks(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {Object.entries(checks).map(([key, value]) => (
                    <div
                        key={key}
                        className={`${styles.checkItem} ${value ? styles.checked : ''}`}
                        onClick={() => toggleCheck(key)}
                    >
                        <div className={styles.checkbox}>
                            {value && <span className={styles.checkmark}>✓</span>}
                        </div>
                        <span className={styles.label}>
                            {key === 'ui' && 'UI Built'}
                            {key === 'logic' && 'Logic Working'}
                            {key === 'test' && 'Test Passed'}
                            {key === 'deployed' && 'Deployed'}
                        </span>
                    </div>
                ))}
            </div>
        </footer>
    );
};

export default ProofFooter;
