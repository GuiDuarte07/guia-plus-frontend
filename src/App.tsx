import './App.css'
import Mapa from './components/MapContainer';

const App: React.FC = () => {

  return (
    <div className="App">
      <h1>Mapa com React Leaflet</h1>
      <Mapa />
    </div>
  );
}

export default App
