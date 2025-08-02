#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 React-DND Development Environment');
console.log('=====================================\n');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Function to run commands
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Function to check if port is available
function isPortAvailable(port) {
  try {
    execSync(`netstat -an | grep :${port}`, { stdio: 'ignore' });
    return false;
  } catch {
    return true;
  }
}

// Main development function
async function startDev() {
  try {
    console.log('📦 Installing dependencies...');
    await runCommand('npm', ['install']);
    
    console.log('🔨 Building library...');
    await runCommand('npm', ['run', 'build']);
    
    console.log('🧪 Running tests...');
    await runCommand('npm', ['test']);
    
    console.log('📝 Running linting...');
    await runCommand('npm', ['run', 'lint']);
    
    console.log('✅ All checks passed!\n');
    
    console.log('🌐 Starting examples server...');
    console.log('   Examples will be available at: http://localhost:3000');
    console.log('   Press Ctrl+C to stop the server\n');
    
    // Start the examples server
    await runCommand('npm', ['run', 'examples:dev']);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Function to run tests only
async function runTests() {
  try {
    console.log('🧪 Running tests...');
    await runCommand('npm', ['test']);
    console.log('✅ Tests completed successfully!');
  } catch (error) {
    console.error('❌ Tests failed:', error.message);
    process.exit(1);
  }
}

// Function to run examples only
async function runExamples() {
  try {
    console.log('🌐 Starting examples server...');
    console.log('   Examples will be available at: http://localhost:3000');
    console.log('   Press Ctrl+C to stop the server\n');
    
    await runCommand('npm', ['run', 'examples:dev']);
  } catch (error) {
    console.error('❌ Error starting examples:', error.message);
    process.exit(1);
  }
}

// Function to run validation
async function runValidation() {
  try {
    console.log('🔍 Running full validation...');
    await runCommand('npm', ['run', 'validate']);
    console.log('✅ Validation completed successfully!');
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'test':
    runTests();
    break;
  case 'examples':
    runExamples();
    break;
  case 'validate':
    runValidation();
    break;
  case 'help':
  case '--help':
  case '-h':
    console.log(`
Usage: node scripts/dev-examples.js [command]

Commands:
  (no command)  Start full development environment
  test          Run tests only
  examples      Start examples server only
  validate      Run full validation (lint + type-check + test)
  help          Show this help message

Examples:
  node scripts/dev-examples.js          # Start full dev environment
  node scripts/dev-examples.js test     # Run tests only
  node scripts/dev-examples.js examples # Start examples server
    `);
    break;
  default:
    startDev();
    break;
} 