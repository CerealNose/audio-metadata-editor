# Audio Metadata Editor

A elegant web application for editing audio file metadata (MP3/WAV) with support for single and batch editing, album artwork management, and audio preview playback.

## Features

### Core Functionality
- **Upload Audio Files** - Drag-and-drop support for MP3 and WAV files
- **Extract Metadata** - Automatically extract title, artist, album, year, genre, track number, composer, and comments
- **Edit Metadata** - User-friendly form interface for editing all metadata fields
- **Audio Preview** - Built-in player to preview audio with duration display
- **Download Modified Files** - Download audio files with updated metadata
- **File Management** - View, edit, and delete audio files

### Advanced Features
- **Batch Editing** - Update metadata for multiple files at once
- **Album Artwork** - Upload, preview, and embed album artwork (JPEG, PNG, GIF, WebP)
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Elegant UI** - Modern interface with smooth transitions and intuitive controls

## Tech Stack

### Frontend
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- Wouter for routing
- tRPC for type-safe API calls

### Backend
- Express.js
- tRPC 11
- MySQL/TiDB database
- Drizzle ORM
- music-metadata for audio processing
- AWS S3 for file storage

### Testing
- Vitest for unit tests
- 35+ passing tests covering all core functionality

## Local Setup

### Prerequisites

Before you begin, ensure you have the following installed on your PC:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v10 or higher) - Install with: `npm install -g pnpm`
- **Git** - [Download](https://git-scm.com/)
- **MySQL** (v8 or higher) or compatible database - [Download](https://www.mysql.com/downloads/)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/CerealNose/audio-metadata-editor.git
   cd audio-metadata-editor
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**

   #### Creating the .env.local File

   **On Windows (Command Prompt or PowerShell):**
   ```cmd
   REM Using Command Prompt
   type nul > .env.local
   
   REM Or using PowerShell
   New-Item -Path .env.local -ItemType File
   ```

   **On macOS/Linux:**
   ```bash
   touch .env.local
   ```

   Then open `.env.local` with your preferred text editor (VS Code, Notepad, Sublime Text, etc.) and add the following variables:

   #### Full Configuration

   ```env
   # Database Configuration
   # Format: mysql://username:password@host:port/database_name
   # Example for local MySQL:
   DATABASE_URL="mysql://root:password@localhost:3306/audio_metadata_editor"

   # OAuth (Manus Authentication)
   # Get these from your Manus dashboard
   VITE_APP_ID="your_app_id_from_manus"
   OAUTH_SERVER_URL="https://api.manus.im"
   VITE_OAUTH_PORTAL_URL="https://portal.manus.im"
   JWT_SECRET="generate_a_random_secret_key_here"

   # S3 Storage Configuration (AWS or compatible)
   # Get these from your AWS console or S3 provider
   AWS_ACCESS_KEY_ID="your_aws_access_key"
   AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
   AWS_REGION="us-east-1"
   AWS_S3_BUCKET="your-bucket-name"

   # Owner Information
   # Your name and unique identifier
   OWNER_NAME="Your Name"
   OWNER_OPEN_ID="your_unique_id"

   # Built-in APIs (Manus)
   BUILT_IN_FORGE_API_URL="https://api.manus.im"
   BUILT_IN_FORGE_API_KEY="your_api_key"
   VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"
   VITE_FRONTEND_FORGE_API_KEY="your_frontend_key"

   # Analytics
   VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
   VITE_ANALYTICS_WEBSITE_ID="your_website_id"
   ```

   #### Quick Setup for Local Development

   If you want to run locally without external services, use this minimal configuration:

   ```env
   # Minimal local setup
   DATABASE_URL="mysql://root:root@localhost:3306/audio_metadata_editor"
   JWT_SECRET="dev-secret-key-change-in-production"
   VITE_APP_ID="dev-app-id"
   OAUTH_SERVER_URL="https://api.manus.im"
   VITE_OAUTH_PORTAL_URL="https://portal.manus.im"
   OWNER_NAME="Developer"
   OWNER_OPEN_ID="dev-user-id"
   BUILT_IN_FORGE_API_URL="https://api.manus.im"
   BUILT_IN_FORGE_API_KEY="dev-key"
   VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"
   VITE_FRONTEND_FORGE_API_KEY="dev-frontend-key"
   VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
   VITE_ANALYTICS_WEBSITE_ID="dev-website-id"
   ```

   #### Setting Up Your Database

   Before running the app, create the database:

   ```bash
   # Connect to MySQL
   mysql -u root -p

   # In MySQL prompt, create the database
   CREATE DATABASE audio_metadata_editor;
   EXIT;
   ```

   Update your `DATABASE_URL` in `.env.local` to match your MySQL credentials.

   #### Important Notes

   - **Never commit `.env.local` to GitHub** - it contains sensitive credentials
   - The `.gitignore` file should already exclude `.env.local`
   - For production, use environment variables provided by your hosting platform
   - Keep your AWS keys and API keys confidential

4. **Set Up Database**

   ```bash
   # Generate migrations and apply them
   pnpm db:push
   ```

   This will create all necessary tables in your database.

5. **Start Development Server**

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

### Running Locally

### Windows Users - Quick Start

For Windows users, we've provided convenient batch scripts to automate the setup and running process.

#### Prerequisites - Install MySQL First

Before running install.bat, you need to install MySQL:

1. Download MySQL from: https://www.mysql.com/downloads/
2. Run the installer and follow the setup wizard
3. Remember your root password
4. Start the MySQL service

#### 1. First Time Setup

Double-click `install.bat` to:
- Check for Node.js
- Install all dependencies
- Create `.env.local` with default values
- Display MySQL setup instructions

```cmd
install.bat
```

After running install.bat:
1. Create the database using MySQL:
   ```bash
   mysql -u root -p
   CREATE DATABASE audio_metadata_editor;
   EXIT;
   ```
2. Edit `.env.local` and update `DATABASE_URL` with your MySQL credentials
3. Run `update.bat` to initialize the database schema

**Note:** The scripts use npm (which comes with Node.js) for maximum compatibility. The `--legacy-peer-deps` flag resolves dependency version conflicts.

#### 2. Start Development Server

Double-click `run.bat` to start the development server:

```cmd
run.bat
```

The application will be available at `http://localhost:3000`

#### 3. Update Dependencies and Database

Double-click `update.bat` to:
- Update all dependencies
- Apply database migrations
- Run tests

```cmd
update.bat
```

#### 4. Build for Production

Double-click `build.bat` to create a production-ready build:
- Runs all tests
- Performs TypeScript type checking
- Optimizes code and assets
- Creates production bundle in dist folder

```cmd
build.bat
```

#### 5. Run Production Build

Double-click `start.bat` to run the production server:
- Starts the optimized production build
- Runs on http://localhost:3000
- Requires build.bat to be run first

```cmd
start.bat
```

### macOS/Linux - Command Line

### Development Mode

```bash
pnpm dev
```

This starts:
- Frontend development server (Vite) on port 3000
- Backend Express server on port 3000
- Hot module replacement for instant updates

### Build for Production

```bash
pnpm build
```

Creates an optimized production build in the `dist/` directory.

### Run Production Build

After building, run the production server with:

```bash
pnpm start
```

Runs the production build on http://localhost:3000

### Run Tests

```bash
pnpm test
```

Runs the test suite using Vitest. Currently includes 35+ tests covering:
- Audio metadata extraction and validation
- Image format validation
- Authentication flows
- Database operations

## Project Structure

```
audio-metadata-editor/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and helpers
│   │   ├── types/         # TypeScript type definitions
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                # Backend Express server
│   ├── _core/            # Core framework files
│   ├── routers.ts        # tRPC route definitions
│   ├── db.ts             # Database queries
│   ├── audioRouter.ts    # Audio-specific routes
│   ├── audioProcessor.ts # Audio processing utilities
│   └── storage.ts        # S3 storage utilities
├── drizzle/              # Database schema and migrations
│   └── schema.ts         # Table definitions
├── package.json
├── tsconfig.json
└── README.md
```

## Usage Guide

### Uploading Audio Files

1. Click "Upload File" or drag-and-drop MP3/WAV files into the upload zone
2. Files are automatically scanned for existing metadata
3. Uploaded files appear in the "Your Audio Files" list

### Editing Single File Metadata

1. Click the "Edit" button on any file
2. Update metadata fields (title, artist, album, year, genre, etc.)
3. Upload or update album artwork
4. Click "Save Changes" to apply updates
5. Download the modified file with updated metadata

### Batch Editing

1. Click "Edit All Files" to enter batch mode
2. Select which files to update
3. Enter metadata to apply to selected files
4. Click "Update X File(s)" to apply changes

### Managing Album Artwork

1. In the file editor, scroll to the "Album Artwork" section
2. Click to upload an image (JPEG, PNG, GIF, WebP)
3. Preview the artwork before saving
4. Click "Replace" to change artwork or "Remove" to delete it

## API Endpoints

### Audio Operations

- `POST /api/trpc/audio.createFromUpload` - Upload and process audio file
- `GET /api/trpc/audio.list` - List user's audio files
- `GET /api/trpc/audio.getById` - Get specific audio file details
- `POST /api/trpc/audio.updateMetadata` - Update single file metadata
- `POST /api/trpc/audio.batchUpdateMetadata` - Update multiple files
- `POST /api/trpc/audio.uploadArtwork` - Upload artwork for file
- `GET /api/trpc/audio.getDownloadUrl` - Get download URL for file
- `DELETE /api/trpc/audio.delete` - Delete audio file

### Authentication

- `GET /api/oauth/callback` - OAuth callback handler
- `POST /api/trpc/auth.logout` - User logout

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify MySQL is running: `mysql -u root -p`
2. Check DATABASE_URL format in `.env.local`
3. Ensure database user has proper permissions
4. Try creating the database manually: `CREATE DATABASE audio_metadata_editor;`

### Port Already in Use

If port 3000 is already in use:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>
```

### Missing Dependencies

If you encounter missing module errors:

```bash
pnpm install
pnpm install --force
```

### Build Errors

Clear cache and rebuild:

```bash
rm -rf node_modules .pnpm-store dist
pnpm install
pnpm build
```

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**
   ```bash
   pnpm test
   pnpm dev
   ```

3. **Commit and push**
   ```bash
   git add .
   git commit -m "Add your feature description"
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/CerealNose/audio-metadata-editor/issues).

## Roadmap

- [ ] Batch artwork application
- [ ] Automatic artwork detection from folder.jpg
- [ ] Metadata export to CSV/JSON
- [ ] Support for additional audio formats (FLAC, AAC)
- [ ] Lyrics editing and management
- [ ] Playlist creation and management
- [ ] Dark mode theme
- [ ] Mobile app (React Native)

## Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Audio processing with [music-metadata](https://github.com/Borewit/music-metadata)
- Database ORM by [Drizzle](https://orm.drizzle.team/)
