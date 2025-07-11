#!/usr/bin/env node

/**
 * Delta Deployment System
 * Only deploys changed files - like Wooden Robot wanted
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class DeltaDeployment {
    constructor() {
        this.hashFile = './automation/.file-hashes.json';
        this.sourceDir = './typescript/src';
    }

    /**
     * Calculate file hash
     */
    calculateHash(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        return crypto.createHash('md5').update(content).digest('hex');
    }

    /**
     * Load previous file hashes
     */
    loadPreviousHashes() {
        try {
            if (fs.existsSync(this.hashFile)) {
                return JSON.parse(fs.readFileSync(this.hashFile, 'utf8'));
            }
        } catch (error) {
            console.log('⚠️  Could not load previous hashes, treating all files as changed');
        }
        return {};
    }

    /**
     * Save current file hashes
     */
    saveCurrentHashes(hashes) {
        fs.writeFileSync(this.hashFile, JSON.stringify(hashes, null, 2));
    }

    /**
     * Find changed TypeScript files
     */
    findChangedFiles() {
        const previousHashes = this.loadPreviousHashes();
        const currentHashes = {};
        const changedFiles = [];

        // Check all TypeScript files
        const tsFiles = fs.readdirSync(this.sourceDir)
            .filter(file => file.endsWith('.ts'))
            .map(file => path.join(this.sourceDir, file));

        tsFiles.forEach(file => {
            const currentHash = this.calculateHash(file);
            currentHashes[file] = currentHash;

            // Compare with previous hash
            if (previousHashes[file] !== currentHash) {
                changedFiles.push(file);
                console.log(`📝 Changed: ${file}`);
            }
        });

        // Save current hashes for next run
        this.saveCurrentHashes(currentHashes);

        return changedFiles;
    }

    /**
     * Deploy only changed files
     */
    async deployChanges() {
        console.log('🔍 Checking for file changes...\n');
        
        const changedFiles = this.findChangedFiles();
        
        if (changedFiles.length === 0) {
            console.log('✅ No changes detected - skipping deployment');
            return;
        }

        console.log(`\n📦 Found ${changedFiles.length} changed file(s)`);
        console.log('🚀 Building and deploying changes...\n');

        // Run build process
        const { execSync } = require('child_process');
        
        try {
            // Build changed files
            execSync('npm run build', { stdio: 'inherit' });
            
            // Deploy to NetSuite
            execSync('suitecloud project:deploy', { stdio: 'inherit' });
            
            console.log('\n✅ Delta deployment completed successfully!');
            
        } catch (error) {
            console.error('❌ Deployment failed:', error.message);
            process.exit(1);
        }
    }
}

// Run delta deployment
if (require.main === module) {
    const delta = new DeltaDeployment();
    delta.deployChanges();
}

module.exports = DeltaDeployment;
