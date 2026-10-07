import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  ShieldAlert, 
  Database, 
  Layers, 
  FileText
} from 'lucide-react';
import { sendAgentChat, fetchClients } from '../services/api';

export default function AgentChatPage({ initialQuery = '', onNavigateToGovernance }) {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [enforceGovernance] = useState(true);

  useEffect(() => {
    fetchClients().then(setClients).catch(console.error);

    // Initial greeting
    setMessages([
      {
        id: 'msg-0',
        sender: 'agent',
        text: `### 👋 Welcome to Raj-AI Wealth OS Copilot

I am your governed wealth intelligence assistant. I analyze portfolio drift across **20 client mandates**, monitor live Dhan market feeds, check SEBI allocation rules, and generate executive meeting briefs.

**Institutional Governance Enforced**:
- Zero Autonomous Trading (Policy 1 enforced via Human-in-the-Loop queue)
- Verifiable MCP Tool execution trace logged for every answer`,
        tools_executed: [],
        policy_checks: [],
        sources: ["Unified Depository DB", "Dhan Live Market Feeds"]
      }
    ]);

    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, []);

  async function handleSend(customQuery = null) {
    const textToSend = customQuery || query;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const resp = await sendAgentChat(textToSend, selectedClientId ? Number(selectedClientId) : null, enforceGovernance);
      
      const agentMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: resp.answer,
        meeting_brief: resp.meeting_brief,
        recommended_action: resp.recommended_action,
        requires_approval: resp.requires_approval,
        approval_id: resp.approval_id,
        tools_executed: resp.tools_executed,
        policy_checks: resp.policy_checks,
        sources: resp.sources,
        timestamp: resp.timestamp
      };

      setMessages((prev) => [...prev, agentMsg]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      const errMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: `⚠️ **Agent Execution Error**: ${err.message}`,
        tools_executed: [],
        policy_checks: [],
        sources: []
      };
      setMessages((prev) => [...prev, errMsg]);
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: '16px' }}>
      {/* Workspace Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            AI Intelligence & Analytical Chat
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Execute analytical workflows with verifiable financial tools and governance verification
          </p>
        </div>

        {/* Client Focus Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="input-field"
            style={{ width: '250px', fontSize: '13px', borderRadius: 'var(--radius-full)' }}
          >
            <option value="">Context: Auto-Detect Client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name} ({c.client_code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="card-white" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Messages Scroll Area */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {/* Message Bubble */}
              <div style={{
                background: m.sender === 'user' ? 'var(--brand-violet)' : 'var(--surface-white)',
                color: m.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                border: m.sender === 'user' ? 'none' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xl)',
                padding: '16px 20px',
                boxShadow: 'var(--shadow-card)',
                lineHeight: 1.6,
                fontSize: '13.5px',
                width: '100%'
              }}>
                <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>

                {/* Meeting Brief Accordion/Card if generated */}
                {m.meeting_brief && (
                  <div style={{
                    marginTop: '16px',
                    background: '#f8fafc',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    fontSize: '13px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: 'var(--brand-violet)', marginBottom: '8px' }}>
                      <FileText size={16} />
                      <span>Executive Meeting Briefing</span>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                      {m.meeting_brief}
                    </div>
                  </div>
                )}

                {/* Governance Approval Banner if required */}
                {m.requires_approval && (
                  <div style={{
                    marginTop: '14px',
                    background: 'var(--warning-bg)',
                    border: '1px solid var(--warning-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShieldAlert size={18} color="var(--warning-text)" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--warning-text)' }}>
                          Human-in-the-Loop Action Proposed
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--warning-text)' }}>
                          {m.recommended_action}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onNavigateToGovernance}
                      className="btn btn-secondary btn-sm btn-pill"
                      style={{ background: 'white', borderColor: 'var(--warning-border)' }}
                    >
                      Review in Queue
                    </button>
                  </div>
                )}

                {/* MCP Tool Trace Visualizer */}
                {m.tools_executed && m.tools_executed.length > 0 && (
                  <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layers size={13} />
                      <span>MCP Tools Execution Plan ({m.tools_executed.length} steps executed)</span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {m.tools_executed.map((t) => (
                        <div
                          key={t.step_num}
                          style={{
                            background: 'var(--surface-subtle)',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-full)',
                            padding: '4px 12px',
                            fontSize: '11.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span style={{ fontWeight: 700, color: 'var(--brand-violet)' }}>
                            {t.step_num}. {t.tool_name}()
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>• {t.latency_ms}ms</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources Citation Bar */}
                {m.sources && m.sources.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <Database size={12} />
                    <span><strong>Data Verified:</strong> {m.sources.join(' • ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--brand-violet)', fontSize: '13px', fontWeight: 600 }}>
              <Sparkles size={16} />
              <span>Raj-AI Copilot is executing MCP tools & governance policies...</span>
            </div>
          )}
        </div>

        {/* Input Bar & Suggested Prompts */}
        <div style={{ padding: '16px 20px', background: 'var(--surface-white)', borderTop: '1px solid var(--border-light)' }}>
          {/* Prompt Pills */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              "Why should I review Rajesh's portfolio?",
              "Prepare me for tomorrow's meeting with Rajesh Kumar",
              "Check goal progress for Dr. Neha Singh",
              "What is the asset allocation drift for Amit Raj?"
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                style={{
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-full)',
                  padding: '5px 14px',
                  fontSize: '11.5px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
          >
            <input
              type="text"
              placeholder="Ask Raj-AI (e.g. 'Analyze tech concentration for Rajesh Kumar', 'Draft meeting brief')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              className="input-field"
              style={{ fontSize: '13.5px', borderRadius: 'var(--radius-full)' }}
            />

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="btn btn-primary btn-pill"
              style={{ padding: '10px 22px', flexShrink: 0 }}
            >
              <Send size={15} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
