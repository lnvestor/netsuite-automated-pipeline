# 🚀 NetSuite Automated SuiteScript Pipeline

**Inspired by Wooden Robot's approach** - Build and deploy SuiteScripts from TypeScript with automated XML generation and hotkey deployment.

## ✨ Features

- **📝 TypeScript Development** - Write SuiteScripts in TypeScript with full type safety
- **🤖 Automated XML Generation** - JSDoc metadata automatically generates NetSuite XML files
- **⚡ Hotkey Deployment** - Press F5 or Ctrl+Shift+D to build and deploy instantly
- **🔄 Delta Deployment** - Only deploys changed files for faster iterations
- **🎯 Single Source of Truth** - Maintain only TypeScript files, everything else is generated

## 🏗️ Project Structure

```
├── typescript/src/           # TypeScript SuiteScript source files
├── automation/              # Build and deployment automation
├── src/Objects/             # Generated SDF XML objects
├── src/FileCabinet/         # Generated JavaScript files
├── .vscode/                 # VS Code tasks and keybindings
└── package.json             # NPM scripts for automation
```

## 🚀 Quick Start

### 1. Write TypeScript SuiteScript

Create `typescript/src/my_script.ts`:

```typescript
/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * 
 * AUTOMATED DEPLOYMENT METADATA:
 * @scriptid customscript_my_script
 * @scriptname My Custom Script
 * @description Auto-generated from TypeScript
 * @deploymentid customdeploy_my_script_deploy
 * @recordtype SALESORDER
 * @executioncontext USERINTERFACE
 * @loglevel DEBUG
 * @status RELEASED
 * @allroles true
 */

import { dialog } from 'N/ui/dialog';

function pageInit(scriptContext: any): void {
    dialog.alert({
        title: 'Hello',
        message: 'TypeScript SuiteScript deployed automatically!'
    });
}

export { pageInit };
```

### 2. Deploy with Hotkeys

- **F5** - Quick build and deploy
- **Ctrl+Shift+D** - Build and deploy with full output
- **Ctrl+Shift+B** - Build only (no deploy)

### 3. Or Use NPM Scripts

```bash
# Build and deploy everything
npm run dev

# Delta deployment (only changed files)
npm run delta

# Build only
npm run build
```

## 🎯 JSDoc Metadata Tags

The automation extracts deployment configuration from JSDoc comments:

| Tag | Purpose | Example |
|-----|---------|---------|
| `@scriptid` | Script ID | `customscript_my_script` |
| `@scriptname` | Display name | `My Custom Script` |
| `@description` | Script description | `Auto-generated script` |
| `@deploymentid` | Deployment ID | `customdeploy_my_deploy` |
| `@recordtype` | Target record | `SALESORDER`, `CUSTOMER` |
| `@executioncontext` | Execution context | `USERINTERFACE`, `WEBSTORE` |
| `@loglevel` | Log level | `DEBUG`, `ERROR` |
| `@status` | Deployment status | `RELEASED`, `TESTING` |
| `@allroles` | All roles access | `true`, `false` |

## 🔄 Delta Deployment

The system tracks file changes and only deploys modified scripts:

```bash
npm run delta
```

**First run:**
```
📝 Changed: typescript/src/my_script.ts
📦 Found 1 changed file(s)
🚀 Building and deploying changes...
✅ Delta deployment completed!
```

**Subsequent runs (no changes):**
```
✅ No changes detected - skipping deployment
```

## 🛠️ How It Works

1. **TypeScript Source** - Write SuiteScripts in TypeScript with JSDoc metadata
2. **Automated Build** - Node.js script extracts metadata and generates:
   - JavaScript files (TypeScript → NetSuite-compatible JS)
   - XML definitions (Script + Deployment records)
3. **SDF Deployment** - Uses SuiteCloud CLI to deploy to NetSuite
4. **Change Tracking** - MD5 hashes track file changes for delta deployment

## 📁 Generated Files

From `typescript/src/my_script.ts`, the system generates:

- `src/FileCabinet/SuiteScripts/my_script.js` - Converted JavaScript
- `src/Objects/customscript_my_script.xml` - Script definition with deployment

## 🎮 VS Code Integration

The `.vscode/` folder contains:

- **tasks.json** - Build and deployment tasks
- **keybindings.json** - Hotkey mappings for instant deployment

## 🔧 Advanced Configuration

### Custom Build Logic

Modify `automation/build-scripts.js` to:
- Add support for other script types (UserEvent, Scheduled, etc.)
- Customize XML generation templates
- Add TypeScript compilation with `tsc`

### Delta Deployment Tuning

Edit `automation/delta-deploy.js` to:
- Change hash algorithm
- Add file filtering
- Customize deployment logic

## 📋 Available NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run build` | Build TypeScript to SDF objects | Build only |
| `npm run deploy` | Build and deploy to NetSuite | Full deployment |
| `npm run dev` | Quick build and deploy | Development workflow |
| `npm run delta` | Delta deployment | Deploy only changes |
| `npm run watch` | Alias for delta | File watching |

## 🎯 Benefits

✅ **Developer Experience** - Write TypeScript, press F5, deployed
✅ **Zero Manual XML** - Never touch script or deployment XMLs
✅ **Fast Iterations** - Delta deployment for quick feedback
✅ **Type Safety** - Full TypeScript support with NetSuite types
✅ **Consistency** - Automated generation prevents manual errors
✅ **Single Source** - All metadata lives with the code

## 🚀 Next Steps

1. **Add TypeScript Compilation** - Use `tsc` for proper TypeScript compilation
2. **Support More Script Types** - UserEvent, Scheduled, MapReduce, etc.
3. **File Watching** - Auto-deploy on file changes
4. **Bundle Optimization** - Webpack/Rollup integration
5. **Testing Integration** - Unit tests for SuiteScripts

---

**Inspired by Wooden Robot's automated NetSuite development workflow**
