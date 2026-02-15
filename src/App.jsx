import React from 'react';
import TopBar from './components/layout/TopBar';
import ContextHeader from './components/layout/ContextHeader';
import ProofFooter from './components/layout/ProofFooter';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Input from './components/ui/Input';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <TopBar
        projectName="KodNest Premium Build"
        currentStep={1}
        totalSteps={5}
        status="In Progress"
      />

      <ContextHeader
        title="System Foundation"
        description="Establishing the core design tokens, layout structure, and component library for a consistent and scalable application."
      />

      <main className={styles.mainContent}>
        <section className={styles.workspace}>
          <Card padding="lg" className={styles.workspaceCard}>
            <h2 className={styles.sectionTitle}>Primary Workspace</h2>
            <p className={styles.sectionText}>
              This area contains the main product interaction.
              The layout is strictly divided into a 70% workspace and a 30% secondary panel.
            </p>

            <div className={styles.componentShowcase}>
              <div className={styles.row}>
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
              </div>

              <div className={styles.row}>
                <Input label="Project Name" placeholder="Enter project name..." />
              </div>

              <div className={styles.row}>
                <Input label="Email Address" placeholder="name@company.com" type="email" />
              </div>

              <div className={styles.row}>
                <Card padding="sm">
                  <strong>Nested Card (Small Padding)</strong>
                  <p className={styles.smallText}>Used for grouping related information strictly.</p>
                </Card>
              </div>
            </div>
          </Card>
        </section>

        <aside className={styles.secondaryPanel}>
          <Card padding="md" className={styles.instructionCard}>
            <h3 className={styles.panelTitle}>Step Instructions</h3>
            <p className={styles.panelText}>
              Review the component hierarchy and ensure all design tokens are correctly applied.
            </p>

            <div className={styles.promptBox}>
              <p className={styles.promptText}>// Copy this prompt to generate the next step...</p>
            </div>

            <div className={styles.actionGrid}>
              <Button variant="secondary" className={styles.fullWidth}>Copy Prompt</Button>
              <Button variant="secondary" className={styles.fullWidth}>Build in Lovable</Button>
            </div>
          </Card>
        </aside>
      </main>

      <ProofFooter />
    </div>
  );
}

export default App;
