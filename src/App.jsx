import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [output, setOutput] = useState(null)
  const [outputText, setOutputText] = useState(null)
  const [instruction, setInstruction] = useState(null)
  const [error, setError] = useState("")

  function changeFile(e) {
    setError("")
    let f = e.target.files[0]
    if(!(f.name.endsWith('.csv') || f.name.endsWith('.xlsx'))){
      setError("Only CSV and Excel are supported")
      return
    }
    setFile(f)
  }

  async function uploadFile() {
    try {
      let form = new FormData()
      form.append('file', file)
      form.append('instruction', instruction)

      let resp = await fetch("http://127.0.0.1:8000/processing",
        {
          method: "POST",
          body: form
        }
      );
      const contentType = resp.headers.get("content-type");

      if (contentType?.includes("text/csv")){
        const blob = await resp.blob();
        const url = window.URL.createObjectURL(blob);
        setOutput(url)

      }
      else{
        const text = await resp.text();
        setOutputText(text)
      }
    } catch (error) {
      console.log("Error in upload", error)
    }
  }

  return (
    <div style={{
      width:'100%',
      display:'flex',
      height:'100%',
      justifyContent:"center"
      }}>
      <div style={{
        width:'30%',
        display:'flex',
        flexDirection:'column',
        height:'100%',
        gap:'5px'
      }}>

        <input type='file' onChange={changeFile} />
        {
          error && (
            <span style={{color:'red'}}>{error}</span>
          )
        }
        
        {
          file && (
            <textarea rows="4" onChange={(e) => setInstruction(e.target.value)} placeholder='Please enter your question or instruction' />
          )
        }
        <button style={{width:'100px'}} onClick={uploadFile}
        disabled={!file || error || !instruction}
        >
          Upload
        </button>
      </div>

      {output && (
        <a href={output} download="output.csv">
          Download CSV
        </a>
      )}
      {
        outputText && (
          <div>{outputText}</div>
        )
      }
    </div>
  )
}

export default App
