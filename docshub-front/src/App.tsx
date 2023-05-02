import './App.css';
import { Storage, } from 'aws-amplify';
import { FileUploader, Collection, Image, Button, withAuthenticator, useAuthenticator } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import { S3ProviderListOutputItem } from '@aws-amplify/storage';
import { useEffect, useState } from 'react';
import mime from 'mime-types';
import axios from 'axios';

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

  const onSuccess = async (event: { key: string }) => {

    const { results } = await Storage.list(event.key, { level: 'public' });
    console.log(results);

    const object = results[0] as { size: number, lastModified: Date, key: string };

    let contentType;
    await Storage.get(event.key, { download: true })
      .then(response => {
        contentType = response.ContentType;
      })
      .catch(error => {
        console.log('Error:', error);
      });

    const data = {
      albumId: "ALBUM",
      fileSize: object.size,
      fileName: object.key,
      fileType: contentType,
      description: 'Your description here',
      dateOfCreation: new Date(object.lastModified),
      tags: ['tag1', 'tag2']
    };

    axios.post('http://localhost:5000/api/upload-file', data)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });

    fetchImages();
  };

  return (
    <div className="App">
      <FileUploader
        accessLevel='public'
        acceptedFileTypes={['image/*', 'audio/*', 'video/*', 'text/*', 'application/*']}
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
