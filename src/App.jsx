import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [output, setOutput] = useState(null)
  const [instruction, setInstruction] = useState(null)

  function changeFile(e) {
    let f = e.target.files[0]
    setFile(f)
  }

  async function uploadFile() {
    try {
      console.log("BTn clicked")
      let form = new FormData()
      form.append('file', file)
      form.append('instruction', instruction)

      let resp = await fetch("api/processing",
        {
          method: "POST",
          body: form
        }
      );
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      setOutput(url)
    } catch (error) {
      console.log("Error in upload", error)
    }
  }

  return (
    <div style={{display:'flex'}}>
      <div style={{
        width:'30%',
        display:'flex',
        flexDirection:'column',
        height:'100%',
        gap:'5px'
      }}>

        <input type='file' onChange={changeFile} />
        <button style={{width:'100px'}} onClick={uploadFile}>Upload</button>
        {
          file && (
            <input onChange={(e) => setInstruction(e.target.value)} placeholder='Please enter your instruction' />
          )
        }
      </div>

      {output && (
        <a href={output} download="output.csv">
          Download CSV
        </a>
      )}
    </div>
  )
}

export default App
