# deepseek-ext README
DeepSeek ext is an AI chat tool that helps you ask anything.

## How to build and install VSCode extension

1. Install npm packages
```
npm install
```

2. Install DeepSeek latest model using ollama
```
ollama pull deepseek-r1:latest
```

3. Build VSCode extension and create .vsix file
```
npm run build
```

4. Import the .vsix file from 'Install from VSIX...' command on VSCode Extension tab

## How to use
1. Open Command pallet on VSCode
2. Type 'DeepSeek Chat' and send message from GUI

![result](./ret.gif)