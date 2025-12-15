import {useState} from 'react';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';


function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTicketCreated = () => {
    setRefreshKey(old => old + 1);
  }

  return (
    <div style={{ backgroundColor: '#ecf0f1', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px' }}>
        🕰️ Chronos Ticket Manager
      </h1>
      
      {/* Formulário de Cadastro */}
      <TicketForm onSuccess={handleTicketCreated} />
      
      <hr style={{ margin: '40px auto', maxWidth: '900px', border: 'none', borderTop: '2px dashed #bdc3c7' }} />
      
      {/* Lista de Visualização */}
      <TicketList shouldRefresh={refreshKey} />
    </div>

  )
}

export default App;