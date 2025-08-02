#!/usr/bin/env node

/**
 * Data Chunking Script for BAC 2025 Student Data
 * Splits large JSON file into smaller chunks for mobile optimization
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const CHUNK_SIZE = 2000; // Students per chunk
const INPUT_FILE = path.join(projectRoot, 'src/data/bac2025.json');
const OUTPUT_DIR = path.join(projectRoot, 'public/data/chunks');

async function chunkData() {
  try {
    console.log('🔄 Loading student data...');
    
    // Read the original file
    const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
    const students = JSON.parse(rawData);
    
    console.log(`📊 Found ${students.length} student records`);
    console.log(`📏 Original file size: ${(rawData.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Split into chunks
    const chunks = [];
    const chunkCount = Math.ceil(students.length / CHUNK_SIZE);
    
    for (let i = 0; i < chunkCount; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, students.length);
      const chunk = students.slice(start, end);
      
      const chunkData = {
        metadata: {
          chunkIndex: i,
          totalChunks: chunkCount,
          startIndex: start,
          endIndex: end - 1,
          recordCount: chunk.length,
          nodeRange: {
            min: chunk[0]?.NODOSS,
            max: chunk[chunk.length - 1]?.NODOSS
          }
        },
        students: chunk
      };
      
      chunks.push(chunkData);
      
      // Write chunk file
      const chunkFileName = `chunk-${i.toString().padStart(3, '0')}.json`;
      const chunkPath = path.join(OUTPUT_DIR, chunkFileName);
      
      fs.writeFileSync(chunkPath, JSON.stringify(chunkData, null, 1));
      
      const chunkSize = (JSON.stringify(chunkData).length / 1024).toFixed(2);
      console.log(`✅ Created ${chunkFileName} - ${chunk.length} records, ${chunkSize} KB`);
    }
    
    // Create index file for chunk mapping
    const indexData = {
      metadata: {
        totalStudents: students.length,
        totalChunks: chunkCount,
        chunkSize: CHUNK_SIZE,
        createdAt: new Date().toISOString(),
        version: '1.0.0'
      },
      chunks: chunks.map(chunk => ({
        index: chunk.metadata.chunkIndex,
        file: `chunk-${chunk.metadata.chunkIndex.toString().padStart(3, '0')}.json`,
        recordCount: chunk.metadata.recordCount,
        nodeRange: chunk.metadata.nodeRange
      }))
    };
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'index.json'), 
      JSON.stringify(indexData, null, 2)
    );
    
    console.log('\n🎯 Chunking Summary:');
    console.log(`   Total students: ${students.length}`);
    console.log(`   Total chunks: ${chunkCount}`);
    console.log(`   Chunk size: ${CHUNK_SIZE} records`);
    console.log(`   Average chunk size: ~${(rawData.length / chunkCount / 1024).toFixed(2)} KB`);
    console.log(`   Reduction factor: ~${Math.round(rawData.length / (rawData.length / chunkCount))}x smaller`);
    
  } catch (error) {
    console.error('❌ Error chunking data:', error.message);
    process.exit(1);
  }
}

chunkData();