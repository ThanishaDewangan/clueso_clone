let mediaRecorder = null
let recordedChunks = []
let currentStream = null
const chrome = window.chrome // Declare the chrome variable

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "START_RECORDING") {
    startRecording(message.streamId, message.quality, message.fps)
  } else if (message.type === "STOP_RECORDING") {
    stopRecording()
  } else if (message.type === "PAUSE_RECORDING") {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause()
    }
  } else if (message.type === "RESUME_RECORDING") {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume()
    }
  }
})

async function startRecording(streamId, quality, fps) {
  try {
    recordedChunks = []

    const constraints = {
      audio: {
        mandatory: {
          chromeMediaSource: "desktop",
        },
      },
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: streamId,
          minWidth: Number.parseInt(quality),
          maxWidth: Number.parseInt(quality),
          minFrameRate: Number.parseInt(fps),
          maxFrameRate: Number.parseInt(fps),
        },
      },
    }

    currentStream = await navigator.mediaDevices.getUserMedia(constraints)

    mediaRecorder = new MediaRecorder(currentStream, {
      mimeType: "video/webm;codecs=vp9",
      videoBitsPerSecond: 2500000,
    })

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data)
      }
    }

    mediaRecorder.onstop = async () => {
      await saveRecording()
    }

    mediaRecorder.start(1000) // Collect data every second
  } catch (error) {
    console.error("Recording error:", error)
    chrome.runtime.sendMessage({
      type: "RECORDING_ERROR",
      error: error.message,
    })
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop()
  }
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop())
    currentStream = null
  }
}

async function saveRecording() {
  try {
    const blob = new Blob(recordedChunks, { type: "video/webm" })

    // Get auth token
    const { authToken } = await chrome.storage.local.get(["authToken"])

    if (!authToken) {
      throw new Error("Not authenticated")
    }

    // Create form data
    const formData = new FormData()
    formData.append("video", blob, `recording-${Date.now()}.webm`)

    // Upload to server
    const response = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    const data = await response.json()

    chrome.runtime.sendMessage({
      type: "RECORDING_COMPLETE",
      projectId: data.projectId,
    })
  } catch (error) {
    console.error("Save error:", error)
    chrome.runtime.sendMessage({
      type: "RECORDING_ERROR",
      error: error.message,
    })
  }
}
