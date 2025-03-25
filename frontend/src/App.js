import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [message, setMessage] = useState("Loading...");

  const Image = () => (
    <img src={require('./components/images/cat.jpg')} alt="gatinho curtindo dum beat"></img>
  )

  useEffect(() => {
    axios.get(`${API_URL}/api/hello`)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching from Flask:", error);
        setMessage("Failed to connect to backend");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>React + Flask</h1>
      <p>{message}</p>
      <Image/>
    </div>
  );
}

export default App;
