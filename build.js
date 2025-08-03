#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building React-DND Library...');

try {
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    console.error('❌ Error: package.json not found. Please run this script from the project root.');
    process.exit(1);
  }

  // Check if rollup is available
  try {
    execSync('npx rollup --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('📦 Installing rollup...');
    execSync('npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-typescript @rollup/plugin-replace', { stdio: 'inherit' });
  }

  // Build the library
  console.log('🏗️  Running rollup build...');
  execSync('npx rollup -c', { stdio: 'inherit' });

  // Check if build was successful
  if (fs.existsSync('dist/index.umd.js')) {
    const stats = fs.statSync('dist/index.umd.js');
    console.log(`✅ Build successful! UMD file size: ${(stats.size / 1024).toFixed(2)} KB`);
    
    // Check for process references in the built file
    const content = fs.readFileSync('dist/index.umd.js', 'utf8');
    if (content.includes('process.env')) {
      console.log('⚠️  Warning: UMD build still contains process.env references');
    } else {
      console.log('✅ UMD build looks clean (no process.env references)');
    }
    
    if (content.includes('jsx-runtime')) {
      console.log('⚠️  Warning: UMD build still contains jsx-runtime references');
    } else {
      console.log('✅ UMD build looks clean (no jsx-runtime references)');
    }
    
  } else {
    console.error('❌ Build failed: dist/index.umd.js not found');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 