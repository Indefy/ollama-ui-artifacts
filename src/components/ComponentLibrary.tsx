
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
  }
];

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onSelectTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

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
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
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
