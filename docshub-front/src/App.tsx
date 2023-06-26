import './App.css';
import { withAuthenticator, useAuthenticator, Button } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import FileListPage from './features/file-list/pages/FileListPage';
import Navigation from './components/Navigation/Navigation';
import { useEffect } from 'react';
import { Auth } from 'aws-amplify';

function App() {

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="App">
      <Navigation />
      <FileListPage />
    </div >
  );
}

export default withAuthenticator(App);
