let isRecording = false
let isPaused = false
let startTime = 0
let timerInterval = null

// Declare chrome variable
const chrome = window.chrome

// Check authentication status
async function checkAuth() {
  try {
    const result = await chrome.storage.local.get(["authToken", "user"])
    if (result.authToken && result.user) {
      showRecordingSection(result.user)
    } else {
      showAuthSection()
    }
  } catch (error) {
    console.error("Auth check failed:", error)
    showAuthSection()
  }
}

function showAuthSection() {
  document.getElementById("auth-section").classList.remove("hidden")
  document.getElementById("recording-section").classList.add("hidden")
}

function showRecordingSection(user) {
  document.getElementById("auth-section").classList.add("hidden")
  document.getElementById("recording-section").classList.remove("hidden")
  document.getElementById("auth-status").textContent = `Logged in as ${user.email}`
}

// Login button
document.getElementById("login-btn").addEventListener("click", () => {
  chrome.tabs.create({ url: "http://localhost:3000/auth/login" })
})

// Start recording
document.getElementById("start-btn").addEventListener("click", async () => {
  try {
    const streamId = await new Promise((resolve, reject) => {
      chrome.desktopCapture.chooseDesktopMedia(["screen", "window", "tab"], (id) => {
        if (id) resolve(id)
        else reject(new Error("User cancelled"))
      })
    })

    // Send message to background script to start recording
    chrome.runtime.sendMessage({
      type: "START_RECORDING",
      streamId,
      quality: document.getElementById("quality-select").value,
      fps: document.getElementById("fps-select").value,
    })

    isRecording = true
    startTime = Date.now()
    updateUI()
    startTimer()
  } catch (error) {
    console.error("Failed to start recording:", error)
    alert("Failed to start recording. Please try again.")
  }
})

// Stop recording
document.getElementById("stop-btn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "STOP_RECORDING" })
  isRecording = false
  stopTimer()
  updateUI()
})

// Pause recording
document.getElementById("pause-btn").addEventListener("click", () => {
  isPaused = !isPaused
  chrome.runtime.sendMessage({ type: isPaused ? "PAUSE_RECORDING" : "RESUME_RECORDING" })
  document.getElementById("pause-btn").textContent = isPaused ? "Resume" : "Pause"
})

function startTimer() {
  timerInterval = setInterval(() => {
    if (!isPaused) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const minutes = Math.floor(elapsed / 60)
        .toString()
        .padStart(2, "0")
      const seconds = (elapsed % 60).toString().padStart(2, "0")
      document.getElementById("timer").textContent = `${minutes}:${seconds}`
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  document.getElementById("timer").textContent = "00:00"
}

function updateUI() {
  const status = document.getElementById("status")
  const idleControls = document.getElementById("idle-controls")
  const recordingControls = document.getElementById("recording-controls")

  if (isRecording) {
    status.textContent = "Recording..."
    status.classList.add("recording")
    idleControls.classList.add("hidden")
    recordingControls.classList.remove("hidden")
  } else {
    status.textContent = "Ready to record"
    status.classList.remove("recording")
    idleControls.classList.remove("hidden")
    recordingControls.classList.add("hidden")
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "RECORDING_COMPLETE") {
    alert("Recording saved successfully!")
    chrome.tabs.create({ url: `http://localhost:3000/editor/${message.projectId}` })
  } else if (message.type === "RECORDING_ERROR") {
    alert(`Recording error: ${message.error}`)
    isRecording = false
    stopTimer()
    updateUI()
  }
})

// Initialize
checkAuth()
