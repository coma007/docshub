import './App.css';
import { withAuthenticator, useAuthenticator, Button } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import FileListPage from './features/file-list/pages/FileListPage';

function App() {

  const { signOut } = useAuthenticator((context) => [context.signOut])

  return (
    <div className="App">
      <Button onClick={signOut}>Sign out</Button>
      <FileListPage />
    </div >
  );
}

export default withAuthenticator(App);
