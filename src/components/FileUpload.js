import React, {useState} from "react";
import { storage } from "../firebaseConfig";
import { Button } from "@mantine/core";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const FileUpload = () => {
  const [file, setFile] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const handleChange = (event) => {
    setFile(event.target.files[0]);
  }
  const handleUpload = () => { 
    if(file==""){
      alert("Please add the file");
    }
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadProgress(progress);
    }, (error) => {
      console.log(error);
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
      });
    });
  }

  return (
    <div>
      <input 
      type="file"
      accept="image/*"
      onChange={handleChange}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
export default FileUpload;