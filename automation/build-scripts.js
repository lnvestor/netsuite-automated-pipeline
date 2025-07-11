#!/usr/bin/env node

/**
 * Automated SuiteScript Build Pipeline
 * Converts TypeScript files with JSDoc metadata to NetSuite SDF objects
 * Similar to Wooden Robot's approach
 */

const fs = require('fs');
const path = require('path');

class NetSuiteAutomatedBuilder {
    constructor() {
        this.sourceDir = './typescript/src';
        this.buildDir = './typescript/build';
        this.sdfObjectsDir = './src/Objects';
        this.sdfScriptsDir = './src/FileCabinet/SuiteScripts';
    }

    /**
     * Extract metadata from JSDoc comments
     */
    extractMetadata(fileContent) {
        const metadata = {};
        
        // Extract JSDoc tags
        const jsdocRegex = /@(\w+)\s+(.+)/g;
        let match;
        
        while ((match = jsdocRegex.exec(fileContent)) !== null) {
            const [, tag, value] = match;
            metadata[tag] = value.trim();
        }
        
        return metadata;
    }

    /**
     * Convert TypeScript to JavaScript (simplified - in real world use tsc)
     */
    convertToJavaScript(tsContent, metadata) {
        // Simple conversion - remove TypeScript syntax
        let jsContent = tsContent
            .replace(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?\s*/g, '') // Remove imports
            .replace(/interface\s+\w+\s*{[^}]*}/g, '') // Remove interfaces
            .replace(/:\s*\w+(\[\])?/g, '') // Remove type annotations
            .replace(/export\s+{[^}]+};?\s*$/, '') // Remove exports
            .replace(/(window as any)/g, 'window'); // Fix type casting
        
        // Add NetSuite define wrapper
        jsContent = `/**
 * ${metadata.description || 'Auto-generated from TypeScript'}
 * @NApiVersion ${metadata.NApiVersion}
 * @NScriptType ${metadata.NScriptType}
 * @NModuleScope ${metadata.NModuleScope}
 */
define(['N/ui/dialog', 'N/log'], function(dialog, log) {
    
${jsContent}
    
    return {
        pageInit: pageInit
    };
});`;
        
        return jsContent;
    }

    /**
     * Generate SDF XML for client script
     */
    generateClientScriptXML(metadata) {
        const scriptId = metadata.scriptid;
        const deploymentId = metadata.deploymentid;
        const scriptName = metadata.scriptname || 'Auto-generated Script';
        const description = metadata.description || 'Generated from TypeScript';
        const recordType = metadata.recordtype || 'SALESORDER';
        const executionContext = metadata.executioncontext || 'USERINTERFACE';
        const logLevel = metadata.loglevel || 'DEBUG';
        const status = metadata.status || 'RELEASED';
        const allRoles = metadata.allroles === 'true' ? 'T' : 'F';
        
        return `<clientscript scriptid="${scriptId}">
  <description>${description}</description>
  <isinactive>F</isinactive>
  <name>${scriptName}</name>
  <notifyadmins>F</notifyadmins>
  <notifyemails></notifyemails>
  <notifyowner>T</notifyowner>
  <notifyuser>F</notifyuser>
  <scriptfile>[/SuiteScripts/${scriptId.replace('customscript_', '')}.js]</scriptfile>
  <scriptdeployments>
    <scriptdeployment scriptid="${deploymentId}">
      <allemployees>F</allemployees>
      <alllocalizationcontexts>T</alllocalizationcontexts>
      <allpartners>F</allpartners>
      <allroles>${allRoles}</allroles>
      <audslctrole></audslctrole>
      <eventtype></eventtype>
      <executioncontext>${executionContext}</executioncontext>
      <isdeployed>T</isdeployed>
      <loglevel>${logLevel}</loglevel>
      <recordtype>${recordType}</recordtype>
      <status>${status}</status>
    </scriptdeployment>
  </scriptdeployments>
</clientscript>`;
    }

    /**
     * Process a single TypeScript file
     */
    processFile(filePath) {
        console.log(`🔄 Processing: ${filePath}`);
        
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const metadata = this.extractMetadata(fileContent);
        
        if (!metadata.scriptid) {
            console.log(`⚠️  Skipping ${filePath} - no @scriptid found`);
            return;
        }
        
        // Convert TypeScript to JavaScript
        const jsContent = this.convertToJavaScript(fileContent, metadata);
        
        // Generate file names
        const scriptFileName = `${metadata.scriptid.replace('customscript_', '')}.js`;
        const xmlFileName = `${metadata.scriptid}.xml`;
        
        // Write JavaScript file
        const jsPath = path.join(this.sdfScriptsDir, scriptFileName);
        fs.writeFileSync(jsPath, jsContent);
        console.log(`✅ Generated: ${jsPath}`);
        
        // Generate and write XML
        const xmlContent = this.generateClientScriptXML(metadata);
        const xmlPath = path.join(this.sdfObjectsDir, xmlFileName);
        fs.writeFileSync(xmlPath, xmlContent);
        console.log(`✅ Generated: ${xmlPath}`);
        
        return {
            scriptFile: jsPath,
            xmlFile: xmlPath,
            metadata: metadata
        };
    }

    /**
     * Build all TypeScript files
     */
    build() {
        console.log('🚀 Starting Automated NetSuite Build Pipeline...\n');
        
        // Ensure directories exist
        [this.buildDir, this.sdfObjectsDir, this.sdfScriptsDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
        
        // Find all TypeScript files
        const tsFiles = fs.readdirSync(this.sourceDir)
            .filter(file => file.endsWith('.ts'))
            .map(file => path.join(this.sourceDir, file));
        
        if (tsFiles.length === 0) {
            console.log('❌ No TypeScript files found in', this.sourceDir);
            return;
        }
        
        console.log(`📁 Found ${tsFiles.length} TypeScript file(s)\n`);
        
        // Process each file
        const results = [];
        tsFiles.forEach(file => {
            try {
                const result = this.processFile(file);
                if (result) {
                    results.push(result);
                }
            } catch (error) {
                console.error(`❌ Error processing ${file}:`, error.message);
            }
        });
        
        console.log(`\n🎉 Build Complete! Generated ${results.length} SuiteScript(s)`);
        console.log('\n📋 Generated Files:');
        results.forEach(result => {
            console.log(`   📄 ${result.metadata.scriptid}`);
            console.log(`      JS: ${result.scriptFile}`);
            console.log(`      XML: ${result.xmlFile}`);
        });
        
        console.log('\n🚀 Ready for deployment with: npm run deploy');
    }
}

// Run the builder
if (require.main === module) {
    const builder = new NetSuiteAutomatedBuilder();
    builder.build();
}

module.exports = NetSuiteAutomatedBuilder;
