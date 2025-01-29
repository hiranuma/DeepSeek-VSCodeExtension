// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ollama, { ChatRequest } from 'ollama';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('deepseek-ext.deepseekChat', () => {
    const panel = vscode.window. createWebviewPanel(
      'deepSeekChat',
      'DeepSeek R1 Chat',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );
    panel.webview.html = getWebviewContent();
  
    panel.webview.onDidReceiveMessage(async (message: any) => {
      switch (message.command) {
        case 'chat':
          const userPrompt = message.text;
          const chatRequest: ChatRequest & { stream: true } = {
            model: 'deepseek-r1:latest',
            messages: [{ role: 'user', content: userPrompt }],
            stream: true
          };
          let responseText = '';
  
          try {
            const streamResponse = await ollama.chat(chatRequest);
            for await (const part of streamResponse) {
              responseText += part.message.content;
              panel.webview.postMessage({ command: 'chatResponse', text: responseText });
            }
          }
          catch (error: any) {
            responseText = `Error: ${error.message}`;
            panel.webview.postMessage({ command: 'chatResponse', text: responseText });
          break;
        }
      }
    });
  });

	context.subscriptions.push(disposable);
}

const getWebviewContent = (): string => {
  return /*html*/ `<! DOCTYPE html>
  <html lang="en" > 
    <head>
      <meta charset="UTF-8" / >
      <style>
        body { font-family: sans-serif; margin: 1rem; }
        #prompt { width: 100%; box-sizing: border-box; border-radius: 0.25rem; padding: 0.5rem; margin-top: 0.5rem; }
        #askBtn { margin-top: 0.5rem; font-size: 0.75rem; padding: 0.2rem 0.5rem; border: 1px solid #aaa; border-radius: 0.25rem; background-color: #8EA8F9; }
        #askBtn: hover { background-color: #ABBEF8; }
        #response { border: 1px solid #aaa; border-radius: 0.25rem; margin-top: 2rem; padding: 0.5rem; min-height: 100px; }
      </style>
    </head>
    <body>
      <h2>DeepSeek Chat</h2>
      <textarea id="prompt" placeholder="Type something..."></textarea>
      <br/>
      <button id="askBtn">Ask</button>
      <div id="response"></div>

      <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('askBtn').addEventListener('click', () => {
          const text = document.getElementById('prompt').value;
          vscode.postMessage({ command: 'chat', text });
        });

        window.addEventListener ('message', event => {
          const { command, text } = event.data;
          if (command === 'chatResponse') {
            document.getElementById('response').innerText = text;
          }
        });
      </script>
    </body>
  </html>`;
};


// This method is called when your extension is deactivated
export function deactivate() {}
