import logo from './logo.svg';
import './App.css';
import OpenApi from './components/OpenApi';  // OpenApi 컴포넌트 import

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      {/* OpenApi 컴포넌트를 추가하여 데이터 출력 */}
      <div>
        <h2>API 데이터 출력</h2>
        <OpenApi />  {/* OpenApi 컴포넌트가 여기서 렌더링됩니다 */}
      </div>
    </div>
  );
}

export default App;
