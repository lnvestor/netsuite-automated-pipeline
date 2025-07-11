/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * 
 * AUTOMATED DEPLOYMENT METADATA:
 * @scriptid customscript_automated_demo_cs
 * @scriptname Automated Demo Client Script
 * @description Auto-generated client script from TypeScript
 * @deploymentid customdeploy_automated_demo_deploy
 * @recordtype SALESORDER
 * @executioncontext USERINTERFACE
 * @loglevel DEBUG
 * @status RELEASED
 * @allroles true
 */

import { dialog } from 'N/ui/dialog';
import { log } from 'N/log';

interface ScriptContext {
    currentRecord: any;
    mode: string;
}

/**
 * Function to be executed after page is initialized.
 */
function pageInit(scriptContext: ScriptContext): void {
    try {
        log.debug('Automated Demo Script', 'TypeScript-generated script initialized');
        
        // Add automated demo button
        addAutomatedButton();
        
    } catch (error) {
        log.error('Error in pageInit', error.toString());
    }
}

/**
 * Add the automated demo button to the form
 */
function addAutomatedButton(): void {
    // Store function globally for button access
    (window as any).showAutomatedDialog = function() {
        dialog.alert({
            title: 'Automated Pipeline Demo',
            message: 'This script was built and deployed automatically from TypeScript!'
        });
    };
    
    // Add button after DOM loads
    setTimeout(() => {
        try {
            const buttonHtml = `
                <input type="button" 
                       value="Automated Demo" 
                       onclick="showAutomatedDialog()" 
                       style="margin: 5px; padding: 8px 15px; 
                              background: linear-gradient(45deg, #2196F3, #21CBF3); 
                              color: white; border: none; border-radius: 5px; 
                              cursor: pointer; font-weight: bold;
                              box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            `;
            
            const toolbar = document.querySelector('.uir-page-title-secondline') || 
                           document.querySelector('.uir-record-type') ||
                           document.querySelector('#main_form');
            
            if (toolbar) {
                const buttonContainer = document.createElement('div');
                buttonContainer.innerHTML = buttonHtml;
                buttonContainer.style.display = 'inline-block';
                buttonContainer.style.marginLeft = '15px';
                toolbar.appendChild(buttonContainer);
                
                log.debug('Automated Demo', 'TypeScript-generated button added successfully');
            }
        } catch (error) {
            log.error('Error adding automated button', error.toString());
        }
    }, 1000);
}

// Export for NetSuite
export { pageInit };
