import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import AgentChatPage from './pages/AgentChatPage';
import GovernanceAuditPage from './pages/GovernanceAuditPage';
import IntegrationsPage from './pages/IntegrationsPage';
import AboutUsPage from './pages/AboutUsPage';
import AdvisorsPage from './pages/AdvisorsPage';
import PrepareMyDayModal from './components/PrepareMyDayModal';
import Client360Modal from './components/Client360Modal';
import GuideModal from './components/GuideModal';
import { fetchAdvisorStats, fetchPrepareMyDay, triggerSync } from './services/api';
import { ADVISORS } from './data/advisorsData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentAdvisor, setCurrentAdvisor] = useState(ADVISORS[0]);
  const [stats, setStats] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [chatInitialQuery, setChatInitialQuery] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const s = await fetchAdvisorStats();
      setStats(s);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleOpenPrepareMyDay() {
    try {
      const data = await fetchPrepareMyDay();
      setDayData(data);
      setIsDayModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to run Prepare My Day scan: " + err.message);
    }
  }

  function handleSelectClient(id) {
    setSelectedClientId(id);
    setIsClientModalOpen(true);
  }

  function handleOpenChatWithQuery(query) {
    setChatInitialQuery(query);
    setActiveTab('agent');
  }

  async function handleSync() {
    try {
      await triggerSync();
      await loadInitialData();
      alert("✓ Data synchronized successfully across Dhan Market Feeds & Unified DB.");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="app-shell">
      {/* Top Floating Pill Capsule Navbar (from ui1.jpeg & ui2.jpeg) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingCount={stats?.pending_approvals || 0}
        onOpenPrepareMyDay={handleOpenPrepareMyDay}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onSync={handleSync}
        currentAdvisor={currentAdvisor}
        onSelectAdvisor={setCurrentAdvisor}
      />

      {/* Main View Router */}
      <main className="page-container">
        {activeTab === 'dashboard' && (
          <DashboardPage
            stats={stats}
            currentAdvisor={currentAdvisor}
            dayData={dayData}
            onOpenPrepareMyDay={handleOpenPrepareMyDay}
            onSelectClient={handleSelectClient}
            onOpenChatWithQuery={handleOpenChatWithQuery}
            onNavigateToGovernance={() => setActiveTab('governance')}
            onNavigateToClients={() => setActiveTab('clients')}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsPage
            onSelectClient={handleSelectClient}
            onOpenChatWithQuery={handleOpenChatWithQuery}
          />
        )}

        {activeTab === 'agent' && (
          <AgentChatPage
            initialQuery={chatInitialQuery}
            onNavigateToGovernance={() => setActiveTab('governance')}
          />
        )}

        {activeTab === 'governance' && (
          <GovernanceAuditPage />
        )}

        {activeTab === 'integrations' && (
          <IntegrationsPage />
        )}

        {activeTab === 'advisors' && (
          <AdvisorsPage
            currentAdvisor={currentAdvisor}
            onSelectAdvisor={setCurrentAdvisor}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            onNavigateToClients={() => setActiveTab('clients')}
          />
        )}

        {activeTab === 'about' && (
          <AboutUsPage
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            onNavigateToAgent={() => setActiveTab('agent')}
          />
        )}
      </main>

      {/* Killer Feature Modal: Prepare My Day */}
      <PrepareMyDayModal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        data={dayData}
        onSelectClient={handleSelectClient}
        onOpenChatWithQuery={handleOpenChatWithQuery}
      />

      {/* Client 360 Drawer/Modal */}
      <Client360Modal
        clientId={selectedClientId}
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onOpenAgentWithPrompt={handleOpenChatWithQuery}
      />

      {/* In-App Guide & Interview Cheatsheet Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
