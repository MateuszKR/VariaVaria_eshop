const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function convertMarkdownToPDF() {
  try {
    // Read the markdown file
    const markdownPath = path.join(__dirname, '../doc/variavaria-architecture.md');
    const markdownContent = fs.readFileSync(markdownPath, 'utf8');
    
    // Convert markdown to HTML (simple conversion)
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>VariaVaria E-Shop - Technical Architecture Documentation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 40px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 5px;
        }
        h1 { font-size: 2.5em; }
        h2 { font-size: 2em; }
        h3 { font-size: 1.5em; }
        h4 { font-size: 1.3em; }
        code {
            background-color: #f8f9fa;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        blockquote {
            border-left: 4px solid #3498db;
            margin: 0;
            padding-left: 15px;
            color: #7f8c8d;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .diagram {
            text-align: center;
            margin: 20px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        ${markdownContent
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
          .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
          .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code>$1</code>')
          .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
          .replace(/```(\w+)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
          .replace(/\n/g, '<br>')
          .replace(/---/g, '<hr>')
        }
    </div>
</body>
</html>
    `;
    
    // Write HTML file
    const htmlPath = path.join(__dirname, '../doc/variavaria-architecture.html');
    fs.writeFileSync(htmlPath, htmlContent);
    
    // Launch puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Load the HTML file
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdfPath = path.join(__dirname, '../doc/variavaria-architecture.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      printBackground: true
    });
    
    await browser.close();
    
    console.log('✅ PDF generated successfully!');
    console.log(`📄 Location: ${pdfPath}`);
    
    // Clean up HTML file
    fs.unlinkSync(htmlPath);
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
  }
}

convertMarkdownToPDF(); 