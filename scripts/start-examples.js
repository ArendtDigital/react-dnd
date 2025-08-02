#!/usr/bin/env node

const { spawn } = require('child_process');
const net = require('net');

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

// Function to find an available port starting from a given port
async function findAvailablePort(startPort = 3000) {
  let port = startPort;
  
  while (port < startPort + 100) { // Try up to 100 ports
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }
  
  throw new Error(`No available ports found between ${startPort} and ${startPort + 100}`);
}

// Function to start the server
function startServer(port) {
  console.log(`🚀 Starting React-DND Examples on port ${port}...`);
  console.log(`📱 Open your browser to: http://localhost:${port}`);
  console.log(`⏹️  Press Ctrl+C to stop the server\n`);
  
  const child = spawn('npx', ['http-server', '.', '-p', port.toString(), '-o', '-c-1'], {
    stdio: 'inherit',
    shell: true,
    cwd: './'
  });
  
  child.on('error', (error) => {
    console.error('❌ Error starting server:', error.message);
    process.exit(1);
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Server exited with code ${code}`);
      process.exit(code);
    }
  });
}

// Main function
async function main() {
  try {
    const args = process.argv.slice(2);
    let startPort = 3000;
    
    // Check if a specific port was provided
    if (args.length > 0) {
      const portArg = parseInt(args[0]);
      if (!isNaN(portArg) && portArg > 0) {
        startPort = portArg;
      }
    }
    
    console.log('🔍 Finding available port...');
    const availablePort = await findAvailablePort(startPort);
    
    if (availablePort === startPort) {
      console.log(`✅ Port ${startPort} is available`);
    } else {
      console.log(`⚠️  Port ${startPort} is in use, using port ${availablePort} instead`);
    }
    
    startServer(availablePort);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  process.exit(0);
});

// Run the main function
main(); 