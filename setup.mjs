#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env.local');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => {
  rl.question(query, (answer) => {
    resolve(answer.trim());
  });
});

async function checkMySQLConnection(host, user, password) {
  try {
    const connection = await mysql.createConnection({
      host: host || 'localhost',
      user: user || 'root',
      password: password || '',
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
    });
    await connection.end();
    return true;
  } catch (error) {
    console.error('Connection error:', error.message);
    return false;
  }
}

async function setupDatabase(host, user, password) {
  try {
    const connection = await mysql.createConnection({
      host: host || 'localhost',
      user: user || 'root',
      password: password || '',
    });

    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS audio_metadata_editor');
    console.log('✓ Database created successfully');

    await connection.end();
    return true;
  } catch (error) {
    console.error('✗ Database creation error:', error.message);
    return false;
  }
}

function createEnvFile(host, user, password) {
  const envContent = `# Database Configuration
DATABASE_URL=mysql://${user}:${password}@${host}:3306/audio_metadata_editor

# OAuth Configuration
VITE_APP_ID=dev-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
JWT_SECRET=dev-secret-key-change-in-production

# Owner Information
OWNER_NAME=Developer
OWNER_OPEN_ID=dev-user-id

# Built-in APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=dev-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=dev-frontend-key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=dev-website-id

# AWS S3 Configuration (Optional - for local testing)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✓ .env.local file created');
}

async function main() {
  console.log('\n========================================');
  console.log('Audio Metadata Editor - Auto Setup');
  console.log('========================================\n');

  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env.local already exists. Overwrite? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('\n========================================');
  console.log('MySQL Configuration');
  console.log('========================================\n');
  console.log('Make sure MySQL is running on your system.\n');

  const host = await question('MySQL Host (default: localhost): ');
  const user = await question('MySQL User (default: root): ');
  const password = await question('MySQL Password (default: root): ');

  const finalHost = host || 'localhost';
  const finalUser = user || 'root';
  const finalPassword = password || 'root';

  console.log('\nConnecting to MySQL...');
  console.log('Host: ' + finalHost);
  console.log('User: ' + finalUser);

  const connected = await checkMySQLConnection(finalHost, finalUser, finalPassword);

  if (!connected) {
    console.error('\n✗ Failed to connect to MySQL');
    console.error('\nPlease check:');
    console.error('1. MySQL is running (start MySQL service)');
    console.error('2. Host is correct: ' + finalHost);
    console.error('3. User is correct: ' + finalUser);
    console.error('4. Password is correct');
    console.error('\nYou can test the connection manually with:');
    console.error('  mysql -h ' + finalHost + ' -u ' + finalUser + ' -p');
    console.error('\nThen run setup.bat again.\n');
    rl.close();
    process.exit(1);
  }

  console.log('✓ Connected to MySQL successfully\n');

  console.log('Creating database...');
  const dbCreated = await setupDatabase(finalHost, finalUser, finalPassword);

  if (!dbCreated) {
    console.error('\n✗ Failed to create database');
    rl.close();
    process.exit(1);
  }

  console.log('\nCreating .env.local file...');
  createEnvFile(finalHost, finalUser, finalPassword);

  console.log('\n========================================');
  console.log('Setup Complete!');
  console.log('========================================\n');
  console.log('Next steps:');
  console.log('1. Run: update.bat (to initialize the database)');
  console.log('2. Run: run.bat (to start the development server)\n');

  rl.close();
}

main().catch((error) => {
  console.error('Setup error:', error.message);
  rl.close();
  process.exit(1);
});
