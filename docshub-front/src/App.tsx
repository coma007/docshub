import './App.css';
import { Storage } from 'aws-amplify';
import { FileUploader, Collection, Image, Button, withAuthenticator, useAuthenticator } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import { S3ProviderListOutputItem } from '@aws-amplify/storage';
import { useEffect, useState } from 'react';

function App() {

  const [imageKeys, setImageKeys] = useState<S3ProviderListOutputItem[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const { signOut } = useAuthenticator((context) => [context.signOut])

  const fetchImages = async () => {
    const { results } = await Storage.list("", { level: "public" });
    setImageKeys(results);
    const s3Images = await Promise.all(
      results.map(
        async image => await Storage.get(image.key!, { level: "public" })
      )
    );
    setImages(s3Images);
  }

  useEffect(() => {
    fetchImages();
  }, [])

  const onSuccess = (event: { key: string }) => {
    fetchImages()
    // TODO save to dynamo
  }

  return (
    <div className="App">
      <FileUploader
        accessLevel='public'
        acceptedFileTypes={['image/*']}
        variation='drop'
        onSuccess={onSuccess} />
      <Button onClick={signOut}>Sign out</Button>
      <Collection
        items={images}
        type="grid"
        templateColumns={{
          base: "minimax(0, 500px)",
          medium: "repat(2, minimax(0, 1fr))",
          large: "repeat(3, minimax(0, 1fr))"
        }}>
        {(item, index) => (
          <div key={index}>
            <Image src={item} alt="" />
          </div>
        )
        }
      </Collection>
    </div >
  );
}

export default withAuthenticator(App);
