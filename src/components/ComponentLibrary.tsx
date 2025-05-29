import React, { useState } from 'react';
import { Library, Search, Tag, Copy, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { CodePayload } from './LiveUIPreview';

interface ComponentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  code: CodePayload;
  thumbnail?: string;
}

interface ComponentLibraryProps {
  onSelectTemplate: (code: CodePayload) => void;
}

const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  {
    id: 'login-form-glass',
    name: 'Glass Login Form',
    category: 'Forms',
    description: 'Modern glassmorphism login form with floating labels',
    tags: ['login', 'glass', 'form', 'modern'],
    code: {
      html: `<div class="login-container">
  <div class="login-form">
    <h2>Welcome Back</h2>
    <p>Sign in to your account</p>
    <form>
      <div class="input-group">
        <input type="email" id="email" required>
        <label for="email">Email Address</label>
      </div>
      <div class="input-group">
        <input type="password" id="password" required>
        <label for="password">Password</label>
      </div>
      <button type="submit" class="submit-btn">Sign In</button>
    </form>
    <p class="signup-link">Don't have an account? <a href="#">Sign up</a></p>
  </div>
</div>`,
      css: `.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-form {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-form h2 {
  color: white;
  margin-bottom: 8px;
  font-size: 2rem;
  font-weight: 600;
}

.login-form p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
}

.input-group {
  position: relative;
  margin-bottom: 25px;
}

.input-group input {
  width: 100%;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.input-group label {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  pointer-events: none;
}

.input-group input:focus + label,
.input-group input:valid + label {
  top: -10px;
  left: 15px;
  font-size: 12px;
  background: rgba(102, 126, 234, 0.8);
  padding: 2px 8px;
  border-radius: 4px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.signup-link {
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.signup-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-form input:focus + label,
.login-form input:valid + label {
  top: -10px;
  left: 15px;
  font-size: 12px;
  background: rgba(102, 126, 234, 0.8);
  padding: 2px 8px;
  border-radius: 4px;
}`,
      js: `// Form validation and interaction
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const inputs = document.querySelectorAll('input');
  
  // Add floating label animation
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value !== '') {
        this.setAttribute('data-filled', 'true');
      } else {
        this.removeAttribute('data-filled');
      }
    });
  });
  
  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
      alert('Login functionality would be implemented here!');
    }
  });
});`
    }
  },
  {
    id: 'product-card',
    name: 'Product Card',
    category: 'Cards',
    description: 'Modern product card with hover effects',
    tags: ['product', 'card', 'ecommerce', 'hover'],
    code: {
      html: `<div class="product-card">
  <div class="product-image">
    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop" alt="Product">
    <div class="product-overlay">
      <button class="quick-view">Quick View</button>
    </div>
  </div>
  <div class="product-info">
    <h3>Premium Headphones</h3>
    <p class="product-description">High-quality wireless headphones with noise cancellation</p>
    <div class="product-price">
      <span class="current-price">$129.99</span>
      <span class="original-price">$179.99</span>
    </div>
    <div class="product-rating">
      <span class="stars">★★★★★</span>
      <span class="rating-count">(124 reviews)</span>
    </div>
    <button class="add-to-cart">Add to Cart</button>
  </div>
</div>`,
      css: `.product-card {
  width: 300px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.quick-view {
  background: white;
  color: #333;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-view:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.product-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 12px;
  line-height: 1.4;
}

.product-price {
  margin-bottom: 10px;
}

.current-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #e74c3c;
  margin-right: 8px;
}

.original-price {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.stars {
  color: #ffc107;
  margin-right: 8px;
}

.rating-count {
  font-size: 0.85rem;
  color: #666;
}

.add-to-cart {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}`,
      js: `// Product card interactions
document.addEventListener('DOMContentLoaded', function() {
  const addToCartBtn = document.querySelector('.add-to-cart');
  const quickViewBtn = document.querySelector('.quick-view');
  
  addToCartBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // Add visual feedback
    const originalText = this.textContent;
    this.textContent = 'Added!';
    this.style.background = '#27ae60';
    
    setTimeout(() => {
      this.textContent = originalText;
      this.style.background = '';
    }, 2000);
  });
  
  quickViewBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    alert('Quick view modal would open here!');
  });
  
  // Card click handler
  document.querySelector('.product-card').addEventListener('click', function() {
    console.log('Navigate to product details page');
  });
});`
    }
  },
  {
    id: 'dashboard-widget',
    name: 'Dashboard Widget',
    category: 'Dashboard',
    description: 'Analytics widget with chart placeholder',
    tags: ['dashboard', 'analytics', 'widget', 'stats'],
    code: {
      html: `<div class="dashboard-widget">
  <div class="widget-header">
    <h3>Revenue Overview</h3>
    <div class="widget-actions">
      <button class="action-btn">⋯</button>
    </div>
  </div>
  <div class="widget-stats">
    <div class="stat-item">
      <span class="stat-value">$24,567</span>
      <span class="stat-label">This Month</span>
      <span class="stat-change positive">+12.5%</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">$21,890</span>
      <span class="stat-label">Last Month</span>
      <span class="stat-change negative">-3.2%</span>
    </div>
  </div>
  <div class="widget-chart">
    <div class="chart-placeholder">
      <div class="chart-bars">
        <div class="bar" style="height: 60%"></div>
        <div class="bar" style="height: 80%"></div>
        <div class="bar" style="height: 45%"></div>
        <div class="bar" style="height: 90%"></div>
        <div class="bar" style="height: 70%"></div>
        <div class="bar" style="height: 85%"></div>
        <div class="bar" style="height: 65%"></div>
      </div>
    </div>
  </div>
</div>`,
      css: `.dashboard-widget {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  border: 1px solid #f0f0f0;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.widget-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.action-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #f5f5f5;
}

.widget-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 0.8rem;
  font-weight: 600;
}

.stat-change.positive {
  color: #27ae60;
}

.stat-change.negative {
  color: #e74c3c;
}

.widget-chart {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.chart-placeholder {
  height: 120px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: end;
  justify-content: center;
  padding: 20px;
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 100%;
}

.bar {
  width: 24px;
  background: linear-gradient(to top, #667eea, #764ba2);
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  animation: growUp 0.8s ease-out;
}

.bar:hover {
  opacity: 0.8;
  transform: scaleY(1.1);
}

@keyframes growUp {
  from {
    height: 0 !important;
  }
  to {
    height: var(--final-height);
  }
}`,
      js: `// Dashboard widget interactions
document.addEventListener('DOMContentLoaded', function() {
  // Animate bars on load
  const bars = document.querySelectorAll('.bar');
  bars.forEach((bar, index) => {
    const height = bar.style.height;
    bar.style.setProperty('--final-height', height);
    
    setTimeout(() => {
      bar.style.animationDelay = \`\${index * 0.1}s\`;
    }, 100);
  });
  
  // Action button
  document.querySelector('.action-btn').addEventListener('click', function() {
    const menu = ['Export Data', 'Refresh', 'Settings'];
    const action = menu[Math.floor(Math.random() * menu.length)];
    console.log(\`Widget action: \${action}\`);
  });
  
  // Simulate real-time updates
  function updateStats() {
    const currentValue = document.querySelector('.stat-value');
    const currentNum = parseInt(currentValue.textContent.replace(/[$,]/g, ''));
    const change = Math.floor(Math.random() * 1000) - 500;
    const newValue = currentNum + change;
    
    currentValue.textContent = \`$\${newValue.toLocaleString()}\`;
  }
  
  // Update every 5 seconds (demo)
  setInterval(updateStats, 5000);
});`
    }
  },
  {
    id: 'card',
    name: 'Modern Card',
    category: 'Layout',
    description: 'A clean, modern card component with shadow and rounded corners',
    tags: ['card', 'container', 'modern'],
    code: {
      html: `<div class="modern-card">
  <div class="card-header">
    <h3>Card Title</h3>
    <span class="card-badge">New</span>
  </div>
  <div class="card-content">
    <p>This is a beautifully designed card component with modern styling and smooth animations.</p>
    <button class="card-button">Learn More</button>
  </div>
</div>`,
      css: `.modern-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  max-width: 400px;
}

.modern-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-header {
  padding: 1.5rem 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.card-badge {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.card-content {
  padding: 1.5rem;
}

.card-content p {
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.card-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.card-button:hover {
  background: #2563eb;
}`,
      js: ''
    }
  },
  {
    id: 'pip-boy-chatbot',
    name: 'Pip-Boy Chatbot Interface',
    category: 'Gaming',
    description: 'Authentic Fallout Pip-Boy style chatbot interface with retro-futuristic design',
    tags: ['pip-boy', 'fallout', 'retro', 'chatbot', 'terminal'],
    code: {
      html: `<div class="pip-boy-interface">
  <div class="pip-boy-header">
    <div class="pip-boy-title">PIP-BOY 3000 - COMMUNICATION MODULE</div>
    <div class="pip-boy-status">
      <span class="status-indicator active"></span>
      <span class="status-text">ONLINE</span>
    </div>
  </div>
  
  <div class="pip-boy-main">
    <div class="chat-display">
      <div class="scan-line"></div>
      <div class="chat-messages">
        <div class="message system">
          <span class="timestamp">[14:32]</span>
          <span class="text">ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM</span>
        </div>
        <div class="message system">
          <span class="timestamp">[14:32]</span>
          <span class="text">COPYRIGHT 2075-2077 ROBCO INDUSTRIES</span>
        </div>
        <div class="message user">
          <span class="timestamp">[14:33]</span>
          <span class="text">> Hello, Pip-Boy</span>
        </div>
        <div class="message assistant">
          <span class="timestamp">[14:33]</span>
          <span class="text">GREETINGS, VAULT DWELLER. HOW MAY I ASSIST?</span>
        </div>
      </div>
    </div>
    
    <div class="pip-boy-controls">
      <div class="input-section">
        <input type="text" class="pip-boy-input" placeholder="ENTER COMMAND..." />
        <button class="pip-boy-button send-btn">SEND</button>
      </div>
      
      <div class="control-buttons">
        <button class="pip-boy-button">STATS</button>
        <button class="pip-boy-button">INV</button>
        <button class="pip-boy-button">DATA</button>
        <button class="pip-boy-button">MAP</button>
      </div>
    </div>
  </div>
  
  <div class="pip-boy-footer">
    <div class="system-info">
      <span>HEALTH: 100%</span>
      <span>RADS: 0</span>
      <span>AP: 70/70</span>
    </div>
  </div>
</div>`,
      css: `@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono:wght@400&display=swap');

.pip-boy-interface {
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  background: #001100;
  color: #00ff00;
  border: 3px solid #00aa00;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  height: 500px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    inset 0 0 20px rgba(0, 255, 0, 0.3),
    0 0 30px rgba(0, 255, 0, 0.2);
  animation: powerOn 0.5s ease-in;
}

@keyframes powerOn {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

.pip-boy-interface::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 0, 0.1) 2px,
      rgba(0, 255, 0, 0.1) 4px
    );
  pointer-events: none;
  z-index: 1;
}

.pip-boy-header {
  background: #003300;
  padding: 10px 15px;
  border-bottom: 2px solid #00aa00;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.pip-boy-title {
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 0 5px #00ff00;
}

.pip-boy-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #ff0000;
  border-radius: 50%;
  animation: blink 2s infinite;
}

.status-indicator.active {
  background: #00ff00;
  box-shadow: 0 0 8px #00ff00;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

.status-text {
  font-size: 12px;
}

.pip-boy-main {
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}

.chat-display {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  position: relative;
  background: rgba(0, 20, 0, 0.5);
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ff00, transparent);
  animation: scan 3s infinite;
}

@keyframes scan {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(300px); opacity: 0; }
}

.chat-messages {
  font-size: 12px;
  line-height: 1.4;
}

.message {
  margin-bottom: 8px;
  display: flex;
  gap: 10px;
}

.timestamp {
  color: #ffaa00;
  min-width: 50px;
}

.message.system .text {
  color: #ffaa00;
}

.message.user .text {
  color: #00ffff;
}

.message.assistant .text {
  color: #00ff00;
  text-shadow: 0 0 3px #00ff00;
}

.pip-boy-controls {
  padding: 15px;
  background: #002200;
  border-top: 2px solid #00aa00;
}

.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.pip-boy-input {
  flex: 1;
  background: #001100;
  border: 2px solid #00aa00;
  color: #00ff00;
  padding: 8px 12px;
  font-family: inherit;
  font-size: 12px;
  border-radius: 4px;
  outline: none;
}

.pip-boy-input:focus {
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  border-color: #00ff00;
}

.pip-boy-button {
  background: #003300;
  border: 2px solid #00aa00;
  color: #00ff00;
  padding: 8px 16px;
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  text-shadow: 0 0 3px #00ff00;
}

.pip-boy-button:hover {
  background: #004400;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
  border-color: #00ff00;
}

.pip-boy-button:active {
  transform: scale(0.95);
}

.control-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.pip-boy-footer {
  background: #003300;
  padding: 8px 15px;
  border-top: 2px solid #00aa00;
  position: relative;
  z-index: 2;
}

.system-info {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #ffaa00;
}

.system-info span {
  text-shadow: 0 0 3px currentColor;
}`,
      js: `// Pip-Boy interface interactions
document.addEventListener('DOMContentLoaded', function() {
  const input = document.querySelector('.pip-boy-input');
  const sendBtn = document.querySelector('.send-btn');
  const messagesContainer = document.querySelector('.chat-messages');
  
  function addMessage(type, text) {
    const now = new Date();
    const timestamp = \`[\${now.getHours().toString().padStart(2, '0')}:\${now.getMinutes().toString().padStart(2, '0')}]\`;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = \`message \${type}\`;
    messageDiv.innerHTML = \`
      <span class="timestamp">\${timestamp}</span>
      <span class="text">\${text}</span>
    \`;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function sendMessage() {
    const text = input.value.trim();
    if (text) {
      addMessage('user', \`> \${text}\`);
      input.value = '';
      
      // Simulate bot response
      setTimeout(() => {
        const responses = [
          'COMMAND PROCESSED. STANDING BY.',
          'ACCESS GRANTED. PROCEED.',
          'UNKNOWN COMMAND. TRY AGAIN.',
          'SYSTEM NOMINAL. ALL CLEAR.',
          'DATA ACCESSED. DISPLAYING RESULTS.'
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        addMessage('assistant', response);
      }, 1000 + Math.random() * 2000);
    }
  }
  
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Add typing sound effect on focus (visual feedback)
  input.addEventListener('input', function() {
    this.style.textShadow = '0 0 8px #00ff00';
    setTimeout(() => {
      this.style.textShadow = '0 0 3px #00ff00';
    }, 100);
  });
  
  // Button click effects
  document.querySelectorAll('.pip-boy-button').forEach(button => {
    button.addEventListener('click', function() {
      const originalText = this.textContent;
      this.textContent = 'LOADING...';
      this.style.color = '#ffaa00';
      
      setTimeout(() => {
        this.textContent = originalText;
        this.style.color = '#00ff00';
      }, 1500);
    });
  });
});`
    }
  }
];

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onSelectTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(COMPONENT_TEMPLATES.map(t => t.category)))];
  
  const filteredTemplates = COMPONENT_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Library size={20} className="mr-2 text-purple-300" />
          Component Library
        </h2>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-button text-white placeholder-blue-200 border-white/20 rounded-lg focus:border-blue-400 focus:outline-none"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'glass-button text-blue-200 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className="glass-card p-4 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-white text-sm">{template.name}</h3>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  onClick={() => onSelectTemplate(template.code)}
                  className="glass-button text-white p-1 hover:bg-blue-500/30"
                  title="Use Template"
                >
                  <Copy size={12} />
                </Button>
                <Button
                  size="sm"
                  className="glass-button text-white p-1 hover:bg-purple-500/30"
                  title="Preview"
                >
                  <Eye size={12} />
                </Button>
              </div>
            </div>
            
            <p className="text-blue-100 text-xs mb-3 opacity-80">{template.description}</p>
            
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-white/10 text-blue-200 rounded-full flex items-center"
                >
                  <Tag size={8} className="mr-1" />
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-xs text-blue-200 opacity-70">+{template.tags.length - 3}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-blue-200 opacity-70">
          No templates found matching your criteria
        </div>
      )}
    </div>
  );
};

export default ComponentLibrary;
