import './App.css';
import { withAuthenticator, useAuthenticator, Button, Authenticator } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import FileListPage from './features/file-list/pages/FileListPage';
import Navigation from './components/Navigation/Navigation';
import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

function App() {

  const [option, setOption] = useState<string>("owned")

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
        <Navigation option={option} changeOption={setOption} />
        <FileListPage option={option} />
      </div >
    </Authenticator>
  );
}

export default App;
