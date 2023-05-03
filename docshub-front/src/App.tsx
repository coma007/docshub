import './App.css';
import { withAuthenticator, useAuthenticator, Button } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import FileUploadPage from './features/file-upload/pages/file-upload-page';

function App() {

  const { signOut } = useAuthenticator((context) => [context.signOut])

  return (
    <div className="App">
      <Button onClick={signOut}>Sign out</Button>
      <FileUploadPage />
    </div >
  );
}

export default withAuthenticator(App);
