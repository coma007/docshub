import './App.css';
import { withAuthenticator, useAuthenticator, Button } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import FileListPage from './features/file-list/pages/FileListPage';
import Navigation from './components/Navigation/Navigation';

function App() {

  
  return (
    <div className="App">
      <Navigation />
      <FileListPage />
    </div >
  );
}

export default withAuthenticator(App);
