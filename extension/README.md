# Clueso Clone Browser Extension

This Chrome extension enables screen recording functionality for the Clueso Clone platform.

## Features

- Screen, window, and tab recording
- Quality settings (1080p, 720p, 480p)
- FPS control (24, 30, 60 fps)
- Pause/resume recording
- Direct integration with the web application
- Automatic upload to your dashboard

## Installation

### For Development

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. The extension icon should appear in your toolbar

### Building Icons

You'll need to add icon files to the `extension/icons/` directory:
- `icon16.png` - 16x16px
- `icon48.png` - 48x48px
- `icon128.png` - 128x128px

## Usage

1. Click the extension icon in your Chrome toolbar
2. Login to your account (you'll be redirected to the web app)
3. Once logged in, click "Start Recording"
4. Select what you want to record (entire screen, window, or tab)
5. Click "Stop Recording" when done
6. Your recording will be automatically uploaded and you'll be taken to the editor

## Configuration

The extension connects to your local development server by default (`http://localhost:3000`).

To use with a production deployment:
1. Update the `host_permissions` in `manifest.json`
2. Update the URLs in `popup.js` and `background.js`

## Permissions

- `activeTab` - Access the current tab
- `tabCapture` - Capture tab audio and video
- `storage` - Store authentication tokens
- `desktopCapture` - Capture screen and window content

## Architecture

- **popup.html/js** - Extension UI and controls
- **background.js** - Recording logic and API communication
- **content.js** - Page interaction capabilities
- **manifest.json** - Extension configuration
