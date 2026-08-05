# ProofLens

ProofLens is an open-source image provenance and privacy tool. It inspects images for embedded metadata and Content Credentials (C2PA), and provides a forensic tool to safely remove personal information before sharing images online.

## Features

- **Metadata Inspection**: Extracts and parses EXIF, IPTC, and XMP metadata.
- **Content Credentials (C2PA)**: Detects and verifies C2PA provenance signatures.
- **Privacy Cleaner**: Losslessly strips GPS coordinates, camera fingerprints, and other identifying metadata from images.
- **Visual Comparison**: Generates a side-by-side forensic report of what was removed.

## Tech Stack

**Frontend**
- React 18
- Vite
- Material UI (MUI)
- Lucide React

**Backend**
- Python 3.11+
- FastAPI
- Pillow, piexif, iptcinfo3
- c2pa-python

## Project Structure

```text
.
├── backend/            # FastAPI application and metadata extractors
│   ├── api/            # API routing and endpoints
│   ├── config/         # Environment variables and application config
│   ├── extractors/     # Logic for parsing EXIF, C2PA, XMP, IPTC
│   ├── models/         # Pydantic schema definitions
│   └── services/       # Core business logic for analysis and cleaning
└── frontend/           # React application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── theme/      # Material UI custom theme configuration
    │   └── utils/      # Formatting and helper utilities
```

## Installation

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Running the project

### Start the Backend
```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload
```
The API will run at `http://localhost:8000`. API documentation is available at `http://localhost:8000/docs`.

### Start the Frontend
```bash
cd frontend
npm run dev
```
The web application will run at `http://localhost:5173`.

## API Endpoints

- `GET /api/health` - Server health check.
- `POST /api/analyze` - Accepts a file upload and returns extracted metadata and C2PA information.
- `POST /api/clean` - Accepts a file and user preferences, returning a cleaned image ID and forensic report.
- `GET /api/download/{download_id}` - Downloads the cleaned image.

## Limitations

- **Metadata Reliance**: The tool relies strictly on embedded file metadata. It does not perform pixel-level ML analysis to detect deepfakes.
- **Lossless Cleaning**: The privacy cleaner losslessly strips metadata from JPEGs but re-encodes other formats using Pillow, which may result in minor file size or quality changes.
- **C2PA Support**: Verifying Content Credentials requires the `c2pa-python` library (Rust backend). If missing, the application will gracefully skip C2PA verification.

## License

MIT License
