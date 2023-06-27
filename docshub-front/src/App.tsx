import './App.css';
import { withAuthenticator, useAuthenticator, Button, Authenticator } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import FileListPage from './features/file-list/pages/FileListPage';
import Navigation from './components/Navigation/Navigation';
import { useEffect } from 'react';
import { Auth } from 'aws-amplify';

function App() {

  const signUpFields = {
    signUp: {
      'custom:referal_email': {
        placeHolder: "Enter Referal Email",
        isRequired: false,
        label: 'Referal Email',
        order: 10
      },
    }
  }

  return (
    <Authenticator formFields={signUpFields} >
      <div className="App">
        <Navigation />
        <FileListPage />
      </div >
    </Authenticator>
  );
}

export default App;
