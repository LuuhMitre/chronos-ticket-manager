import { useState } from 'react';
import './TicketForm.css';

function TicketForm({onSuccess}) {
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    description: '',
    clientTier: 'ISP' 
  });

  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ title: '', clientName: '', description: '', clientTier: 'ISP' }); 
        
        if (onSuccess) onSuccess();

        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Erro ao conectar com API:', error);
      setStatus('error');
    }
  };

  return (
    <div className="form-container">
      <h2>Abrir Novo Chamado</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título do Problema</label>
          <input 
            type="text" 
            name="title"
            value={formData.title} 
            onChange={handleChange}
            required 
            placeholder="Ex: Queda massiva na região..."
          />
        </div>

        <div className="form-group">
          <label>Nome do Cliente</label>
          <input 
            type="text" 
            name="clientName"
            value={formData.clientName} 
            onChange={handleChange}
            required 
            placeholder="Informe o nome do cliente..."
          />
        </div>

        <div className="form-group">
          <label>Nível do Cliente (SLA)</label>
          <select name="clientTier" value={formData.clientTier} onChange={handleChange}>
            <option value="ISP">ISP (4h)</option>
            <option value="Corporativo">Corporativo (6h)</option>
            <option value="PME_Plus">PME Plus (12h)</option>
            <option value="PME">PME (24h)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Descreva os detalhes técnicos..."
          ></textarea>
        </div>

        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Enviando...' : 'Criar Ticket'}
        </button>

        {status === 'success' && <div className="msg success">✅ Ticket criado com sucesso! SLA calculado.</div>}
        {status === 'error' && <div className="msg error">❌ Erro ao criar ticket. Verifique o servidor.</div>}
      </form>
    </div>
  );
}

export default TicketForm;