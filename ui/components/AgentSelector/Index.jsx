import React, { useState, useEffect } from 'react';
import { get_agents } from '../../api/agents';
import styles from './Index.module.css';

const AgentSelector = function({ setSelectedApi }) {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');

  useEffect(() => {
    get_agents().then(data => {
      setAgents(data);
      if (data.length > 0) {
        setSelectedAgent(data[0].name);
        setSelectedApi(data[0].api);
      }
    });
  }, []);

  const handleChange = (event) => {
    const selected =  agents.find(agent => agent.name === event.target.value);
    setSelectedAgent(selected.name);
    setSelectedApi(selected.api);
  };

  if (agents.length === 0) {
    return <div className={styles['alert-warning']}>⚠️ 暂时没有可用的智能体！</div>;
  }

  return (
    <select className={styles.agents} value={selectedAgent} onChange={handleChange}>
      {agents.map(agent => (
        <option key={agent.api} value={agent.name}>
          {agent.name}
        </option>
      ))}
    </select>
  );
}

export default AgentSelector;