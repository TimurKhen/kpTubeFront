/// <reference lib="webworker" />

addEventListener('message', ( event ) => {
  const { file, action } = event.data
  
  if (action === 'processVideo') {
    const reader = new FileReaderSync()
    try {
      const arrayBuffer = reader.readAsArrayBuffer(file)
      const blob = new Blob([arrayBuffer], { type: file.type })
      self.postMessage({ blob, fileName: file.name })
    } catch (error) {
      self.postMessage({ error })
    }
  }
})