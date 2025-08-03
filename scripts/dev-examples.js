#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

let examplesProcess = null;
let buildProcess = null;

// Function to build the library
function buildLibrary() {
  console.log('🔨 Building library...');
  
  return new Promise((resolve, reject) => {
    buildProcess = exec('npm run build', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Build failed:', error);
        reject(error);
        return;
      }
      console.log('✅ Library built successfully');
      resolve();
    });
    
    buildProcess.stdout.pipe(process.stdout);
    buildProcess.stderr.pipe(process.stderr);
  });
}

// Function to start examples development server
function startExamples() {
  console.log('🚀 Starting examples development server...');
  
  return new Promise((resolve, reject) => {
    examplesProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '../examples'),
      stdio: 'inherit',
      shell: true
    });
    
    examplesProcess.on('error', (error) => {
      console.error('❌ Error starting examples:', error);
      reject(error);
    });
    
    examplesProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Examples server exited with code ${code}`);
      }
    });
    
    // Give it a moment to start
    setTimeout(resolve, 2000);
  });
}

// Function to restart examples
async function restartExamples() {
  if (examplesProcess) {
    console.log('🔄 Restarting examples server...');
    examplesProcess.kill();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  await startExamples();
}

// Function to watch for changes
function watchForChanges() {
  console.log('👀 Watching for changes in src/ directory...');
  
  const watcher = chokidar.watch(path.join(__dirname, '../src/**/*'), {
    ignored: /node_modules/,
    persistent: true
  });
  
  let rebuildTimeout = null;
  
  watcher.on('change', async (filePath) => {
    console.log(`📝 File changed: ${path.relative(path.join(__dirname, '..'), filePath)}`);
    
    // Debounce rebuilds
    if (rebuildTimeout) {
      clearTimeout(rebuildTimeout);
    }
    
    rebuildTimeout = setTimeout(async () => {
      try {
        await buildLibrary();
        await restartExamples();
      } catch (error) {
        console.error('❌ Error during rebuild:', error);
      }
    }, 500);
  });
  
  return watcher;
}

// Main function
async function main() {
  try {
    console.log('🎯 Starting React-DND development environment...');
    
    // Initial build
    await buildLibrary();
    
    // Start examples
    await startExamples();
    
    // Watch for changes
    const watcher = watchForChanges();
    
    console.log('\n🎉 Development environment ready!');
    console.log('📱 Examples running at: http://localhost:3000');
    console.log('👀 Watching for changes in src/ directory...');
    console.log('⏹️  Press Ctrl+C to stop\n');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down development environment...');
      if (examplesProcess) {
        examplesProcess.kill();
      }
      if (buildProcess) {
        buildProcess.kill();
      }
      watcher.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error starting development environment:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 