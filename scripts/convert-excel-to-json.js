#!/usr/bin/env node

/**
 * Excel to JSON Conversion Script for BAC Complementary Session Results
 * Converts Excel file to JSON and creates chunked data structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const CHUNK_SIZE = 2000; // Students per chunk
const EXCEL_FILE = path.join(projectRoot, 'RESULTATS_BAC_SC_2025_7072_Ap_CT.xlsx');
const OUTPUT_JSON = path.join(projectRoot, 'src/data/bac2025-complementary.json');
const OUTPUT_CHUNKS_DIR = path.join(projectRoot, 'public/data/chunks-complementary');

async function convertExcelToJson() {
  try {
    console.log('🔄 Reading Excel file...');
    
    // Check if Excel file exists
    if (!fs.existsSync(EXCEL_FILE)) {
      throw new Error(`Excel file not found: ${EXCEL_FILE}`);
    }
    
    // Read Excel file
    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0]; // Take first sheet
    const worksheet = workbook.Sheets[sheetName];
    
    console.log(`📋 Processing sheet: ${sheetName}`);
    
    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    console.log(`📊 Found ${rawData.length} student records`);
    
    // Helper function to convert Excel date serial number to proper date string
    const convertExcelDate = (excelDate) => {
      if (!excelDate || typeof excelDate !== 'number') return '';
      // Excel dates start from 1900-01-01, but there's an off-by-one error in Excel
      const excelStartDate = new Date(1900, 0, 1);
      const daysSinceStart = excelDate - 2; // Account for Excel's leap year bug
      const resultDate = new Date(excelStartDate.getTime() + daysSinceStart * 24 * 60 * 60 * 1000);
      
      // Format as MM/dd/yyyy to match existing format
      return resultDate.toLocaleDateString('en-US');
    };

    // Normalize data structure to match existing BAC format
    const normalizedData = rawData.map((row, index) => {
      // Map Excel columns to our standard format based on actual Excel headers
      return {
        NODOSS: row['NODOSS'] || String(index + 1).padStart(5, '0'),
        SERIE: row['SERIE'] || 'Unknown',
        TYPEC: 'CL', // Default to 'CL' for complementary session
        NOM_FR: row['NOM_FR'] || '',
        NOM_AR: row['NOM_AR'] || '',
        DATN: convertExcelDate(row['DATN']) || '',
        LIEUN_FR: row['LIEUN_FR'] || '',
        LIEUNN_AR: row['LIEUNN_AR'] || '',
        'Moy Bac': parseFloat(row['Moy Bac_Session'] || row['Moy Bac'] || 0), // Use Moy Bac_Session from Excel
        Decision: row['Decision'] || 'Unknown',
        Wilaya_FR: row['Wilaya_FR'] || '',
        Wilaya_AR: row['Wilaya_AR'] || '',
        'Centre Examen_FR': row['Centre Examen_FR'] || '',
        'Etablissement_FR': row['Etablissement_FR'] || '',
        'Centre Examen_AR': row['Centre Examen_AR'] || '',
        'Etablissement_AR': row['Etablissement_AR'] || '',
        // Add session type to distinguish complementary session
        session: 'complementary',
        sessionType: 'Session Complémentaire',
        year: '2025'
      };
    });
    
    // Sort by NODOSS for consistent chunking
    normalizedData.sort((a, b) => {
      const nodeA = String(a.NODOSS).padStart(10, '0');
      const nodeB = String(b.NODOSS).padStart(10, '0');
      return nodeA.localeCompare(nodeB);
    });
    
    console.log('✅ Data normalized and sorted');
    
    // Save full JSON file
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(normalizedData, null, 2));
    console.log(`💾 Saved full JSON: ${OUTPUT_JSON}`);
    
    // Create chunks directory
    if (!fs.existsSync(OUTPUT_CHUNKS_DIR)) {
      fs.mkdirSync(OUTPUT_CHUNKS_DIR, { recursive: true });
    }
    
    // Create chunks
    const chunks = [];
    const chunkCount = Math.ceil(normalizedData.length / CHUNK_SIZE);
    
    console.log(`🔀 Creating ${chunkCount} chunks...`);
    
    for (let i = 0; i < chunkCount; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, normalizedData.length);
      const chunk = normalizedData.slice(start, end);
      
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
          },
          session: 'complementary',
          year: '2025'
        },
        students: chunk
      };
      
      chunks.push(chunkData);
      
      // Write chunk file
      const chunkFileName = `chunk-${i.toString().padStart(3, '0')}.json`;
      const chunkPath = path.join(OUTPUT_CHUNKS_DIR, chunkFileName);
      
      fs.writeFileSync(chunkPath, JSON.stringify(chunkData, null, 1));
      
      const chunkSize = (JSON.stringify(chunkData).length / 1024).toFixed(2);
      console.log(`✅ Created ${chunkFileName} - ${chunk.length} records, ${chunkSize} KB`);
    }
    
    // Create index file for chunk mapping
    const indexData = {
      metadata: {
        totalStudents: normalizedData.length,
        totalChunks: chunkCount,
        chunkSize: CHUNK_SIZE,
        createdAt: new Date().toISOString(),
        version: '1.0.0',
        session: 'complementary',
        year: '2025',
        source: 'RESULTATS_BAC_SC_2025_7072_Ap_CT.xlsx'
      },
      chunks: chunks.map(chunk => ({
        index: chunk.metadata.chunkIndex,
        file: `chunk-${chunk.metadata.chunkIndex.toString().padStart(3, '0')}.json`,
        recordCount: chunk.metadata.recordCount,
        nodeRange: chunk.metadata.nodeRange
      }))
    };
    
    fs.writeFileSync(
      path.join(OUTPUT_CHUNKS_DIR, 'index.json'), 
      JSON.stringify(indexData, null, 2)
    );
    
    console.log('\n🎯 Conversion Summary:');
    console.log(`   Excel file: ${path.basename(EXCEL_FILE)}`);
    console.log(`   Total students: ${normalizedData.length}`);
    console.log(`   Total chunks: ${chunkCount}`);
    console.log(`   Chunk size: ${CHUNK_SIZE} records`);
    console.log(`   Output directory: ${OUTPUT_CHUNKS_DIR}`);
    console.log(`   Session: Complementary 2025`);
    
    // Show sample data structure
    console.log('\n📋 Sample student record:');
    console.log(JSON.stringify(normalizedData[0], null, 2));
    
    console.log('\n✨ Conversion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error converting Excel to JSON:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Show Excel file structure first
function analyzeExcelFile() {
  try {
    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Get headers
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const headers = [];
    
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
      const cell = worksheet[cellAddress];
      if (cell && cell.v) {
        headers.push(cell.v);
      }
    }
    
    console.log('\n📊 Excel File Analysis:');
    console.log(`   Sheet: ${sheetName}`);
    console.log(`   Columns found: ${headers.length}`);
    console.log(`   Headers: ${headers.join(', ')}`);
    
    // Sample first few rows
    const sampleData = XLSX.utils.sheet_to_json(worksheet, { range: 0, header: 1 });
    console.log(`   Total rows: ${sampleData.length + 1} (including header)`);
    
    return true;
  } catch (error) {
    console.error('❌ Could not analyze Excel file:', error.message);
    return false;
  }
}

// Run the conversion
console.log('🚀 Starting Excel to JSON conversion...');
if (analyzeExcelFile()) {
  convertExcelToJson();
}
