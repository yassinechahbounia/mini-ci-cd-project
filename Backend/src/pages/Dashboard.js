import React, { useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <pre>{result}</pre>
    </div>
  );
}

export default Dashboard;
