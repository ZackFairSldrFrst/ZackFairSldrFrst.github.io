document.addEventListener('DOMContentLoaded', function() {
    // Get site data from localStorage (in production this would come from a database)
    const siteData = JSON.parse(localStorage.getItem('generatedSiteData')) || {
        template: 'food',
        businessName: 'Sample Business',
        category: 'food',
        description: 'A sample business description',
        colors: {
            primary: '#4a6cf7',
            secondary: '#f25f5c'
        }
    };
    
    // Elements
    const sectionItems = document.querySelectorAll('.section-item');
    const settingItems = document.querySelectorAll('.setting-item');
    const currentSectionTitle = document.getElementById('current-section');
    const sectionEditors = document.querySelectorAll('.section-editor');
    const settingsPanels = document.querySelectorAll('.settings-panel');
    const previewIframe = document.getElementById('preview-iframe');
    const deviceButtons = document.querySelectorAll('.preview-device-btn');
    const addSectionBtn = document.getElementById('add-section');
    const addSectionModal = document.getElementById('add-section-modal');
    const saveChangesBtn = document.getElementById('save-changes');
    const saveModal = document.getElementById('save-modal');
    const modalCloseButtons = document.querySelectorAll('.modal .close');
    
    // Initialize editor with site data
    initializeEditor();
    
    // Generate initial preview
    generatePreview();
    
    // Section navigation
    sectionItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get section ID
            const sectionId = this.dataset.section;
            
            // Update active section
            sectionItems.forEach(section => section.classList.remove('active'));
            this.classList.add('active');
            
            // Update section title
            currentSectionTitle.textContent = this.querySelector('span').textContent;
            
            // Show corresponding editor
            showEditor(sectionId);
        });
    });
    
    // Settings navigation
    settingItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get setting ID
            const settingId = this.dataset.setting;
            
            // Update active setting
            settingItems.forEach(setting => setting.classList.remove('active'));
            this.classList.add('active');
            
            // Update section title
            currentSectionTitle.textContent = this.querySelector('span').textContent;
            
            // Show corresponding settings panel
            showSettingsPanel(settingId);
        });
    });
    
    // Show editor based on section ID
    function showEditor(sectionId) {
        // Hide all editors and settings panels
        sectionEditors.forEach(editor => editor.style.display = 'none');
        settingsPanels.forEach(panel => panel.style.display = 'none');
        
        // Show selected editor if it exists
        const editor = document.getElementById(`${sectionId}-editor`);
        if (editor) {
            editor.style.display = 'block';
        } else {
            document.getElementById('other-sections').style.display = 'block';
            
            // In a real implementation, we'd dynamically load the appropriate editor
            // For demo purposes, we'll just show a placeholder
            setTimeout(() => {
                loadPlaceholderEditor(sectionId);
            }, 1000);
        }
    }
    
    // Show settings panel
    function showSettingsPanel(settingId) {
        // Hide all editors and settings panels
        sectionEditors.forEach(editor => editor.style.display = 'none');
        settingsPanels.forEach(panel => panel.style.display = 'none');
        
        // Show selected settings panel if it exists
        const panel = document.getElementById(`${settingId}-panel`);
        if (panel) {
            panel.style.display = 'block';
        } else {
            // If panel doesn't exist, show a placeholder
            document.getElementById('other-sections').style.display = 'block';
            
            // In a real implementation, we'd dynamically load the appropriate panel
            setTimeout(() => {
                loadPlaceholderPanel(settingId);
            }, 1000);
        }
    }
    
    // Device preview buttons
    deviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            deviceButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update preview based on device
            const device = this.dataset.device;
            
            switch(device) {
                case 'desktop':
                    previewIframe.style.width = '100%';
                    previewIframe.style.height = '100%';
                    break;
                case 'tablet':
                    previewIframe.style.width = '768px';
                    previewIframe.style.height = '1024px';
                    break;
                case 'mobile':
                    previewIframe.style.width = '375px';
                    previewIframe.style.height = '667px';
                    break;
            }
        });
    });
    
    // Add Section Button
    addSectionBtn.addEventListener('click', function() {
        addSectionModal.style.display = 'flex';
    });
    
    // Modal close buttons
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the parent modal
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Navigation link management
    const addNavItemBtn = document.getElementById('add-nav-item');
    if (addNavItemBtn) {
        addNavItemBtn.addEventListener('click', function() {
            const navLinksEditor = document.querySelector('.nav-links-editor');
            const newNavItem = document.createElement('div');
            newNavItem.className = 'nav-item';
            newNavItem.innerHTML = `
                <input type="text" placeholder="Link Text" value="">
                <input type="text" placeholder="URL" value="#">
                <button class="btn-icon remove-nav-item">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            navLinksEditor.insertBefore(newNavItem, this);
            
            // Add event listener to remove button
            const removeBtn = newNavItem.querySelector('.remove-nav-item');
            removeBtn.addEventListener('click', function() {
                newNavItem.remove();
                updatePreview();
            });
            
            // Update the preview
            updatePreview();
        });
    }
    
    // Add event listeners to existing remove buttons
    document.querySelectorAll('.remove-nav-item').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.nav-item').remove();
            updatePreview();
        });
    });
    
    // CTA button management
    const addCtaBtn = document.getElementById('add-cta-button');
    if (addCtaBtn) {
        addCtaBtn.addEventListener('click', function() {
            const ctaEditor = document.querySelector('.cta-buttons-editor');
            const newCtaItem = document.createElement('div');
            newCtaItem.className = 'cta-item';
            newCtaItem.innerHTML = `
                <input type="text" placeholder="Button Text" value="New Button">
                <input type="text" placeholder="URL" value="#">
                <select>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                </select>
                <button class="btn-icon remove-cta-item">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            ctaEditor.insertBefore(newCtaItem, this);
            
            // Add event listener to remove button
            const removeBtn = newCtaItem.querySelector('.remove-cta-item');
            removeBtn.addEventListener('click', function() {
                newCtaItem.remove();
                updatePreview();
            });
            
            // Update the preview
            updatePreview();
        });
    }
    
    // Add event listeners to existing CTA remove buttons
    document.querySelectorAll('.remove-cta-item').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.cta-item').remove();
            updatePreview();
        });
    });
    
    // Color input sync
    document.querySelectorAll('.color-control').forEach(control => {
        const colorInput = control.querySelector('input[type="color"]');
        const textInput = control.querySelector('input[type="text"]');
        
        colorInput.addEventListener('input', function() {
            textInput.value = this.value;
            updatePreview();
        });
        
        textInput.addEventListener('input', function() {
            // Validate hex color
            if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                colorInput.value = this.value;
                updatePreview();
            }
        });
    });
    
    // Color presets
    document.querySelectorAll('.color-preset').forEach(preset => {
        preset.addEventListener('click', function() {
            // In a real implementation, this would set all color inputs
            // For demo, we'll just update primary and secondary
            let primaryColor, secondaryColor;
            
            const presetName = this.querySelector('span').textContent;
            switch(presetName) {
                case 'Default':
                    primaryColor = '#4a6cf7';
                    secondaryColor = '#f25f5c';
                    break;
                case 'Nature':
                    primaryColor = '#10b981';
                    secondaryColor = '#3b82f6';
                    break;
                case 'Sunset':
                    primaryColor = '#f59e0b';
                    secondaryColor = '#ef4444';
                    break;
                case 'Vibrant':
                    primaryColor = '#8b5cf6';
                    secondaryColor = '#ec4899';
                    break;
                case 'Minimal':
                    primaryColor = '#374151';
                    secondaryColor = '#6b7280';
                    break;
            }
            
            // Update color inputs
            document.getElementById('primary-color').value = primaryColor;
            document.getElementById('secondary-color').value = secondaryColor;
            
            // Update text inputs
            document.getElementById('primary-color').parentElement.querySelector('input[type="text"]').value = primaryColor;
            document.getElementById('secondary-color').parentElement.querySelector('input[type="text"]').value = secondaryColor;
            
            // Update preview
            updatePreview();
        });
    });
    
    // Save Changes button
    saveChangesBtn.addEventListener('click', function() {
        // Collect data from all editors
        collectSiteData();
        
        // In a real implementation, this would save to the server
        // For demo, we'll just show the success modal
        saveModal.style.display = 'flex';
        
        // Update preview
        generatePreview();
    });
    
    // Continue editing button in save modal
    document.querySelector('.continue-editing').addEventListener('click', function() {
        saveModal.style.display = 'none';
    });
    
    // View site button in save modal
    document.querySelector('.view-site').addEventListener('click', function() {
        // In production, this would link to the live site
        // For demo, we'll just close the modal
        saveModal.style.display = 'none';
    });
    
    // Initialize editor with site data
    function initializeEditor() {
        // Populate form fields with site data
        document.getElementById('site-title').value = siteData.businessName;
        document.getElementById('site-tagline').value = siteData.description.substring(0, 50);
        
        // In a real implementation, we'd also populate:
        // - Logo image
        // - Navigation items
        // - Colors
        // - Other settings
        
        if (siteData.colors) {
            // Update color inputs if they exist
            const primaryColorInput = document.getElementById('primary-color');
            const secondaryColorInput = document.getElementById('secondary-color');
            
            if (primaryColorInput && siteData.colors.primary) {
                primaryColorInput.value = siteData.colors.primary;
                primaryColorInput.parentElement.querySelector('input[type="text"]').value = siteData.colors.primary;
            }
            
            if (secondaryColorInput && siteData.colors.secondary) {
                secondaryColorInput.value = siteData.colors.secondary;
                secondaryColorInput.parentElement.querySelector('input[type="text"]').value = siteData.colors.secondary;
            }
        }
    }
    
    // Collect data from all editors
    function collectSiteData() {
        // In a real implementation, this would collect data from all editors
        // For demo, we'll just update business name and colors
        
        siteData.businessName = document.getElementById('site-title').value;
        siteData.description = document.getElementById('site-tagline').value;
        
        // Update colors
        siteData.colors = {
            primary: document.getElementById('primary-color')?.value || '#4a6cf7',
            secondary: document.getElementById('secondary-color')?.value || '#f25f5c'
        };
        
        // Save to localStorage
        localStorage.setItem('generatedSiteData', JSON.stringify(siteData));
    }
    
    // Generate preview
    function generatePreview() {
        // In a real implementation, this would generate a preview based on the template
        // For demo, we'll create a simple preview
        
        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { 
                        font-family: 'Poppins', sans-serif; 
                        margin: 0; 
                        padding: 0;
                        color: #333;
                    }
                    header {
                        background-color: ${siteData.colors.primary};
                        color: white;
                        padding: 1rem;
                    }
                    .header-content {
                        max-width: 1200px;
                        margin: 0 auto;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .logo {
                        font-size: 1.5rem;
                        font-weight: bold;
                    }
                    nav ul {
                        display: flex;
                        list-style: none;
                        margin: 0;
                        padding: 0;
                        gap: 1.5rem;
                    }
                    nav a {
                        color: white;
                        text-decoration: none;
                    }
                    .hero {
                        background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('img/placeholder-hero.jpg');
                        background-size: cover;
                        background-position: center;
                        color: white;
                        padding: 4rem 1rem;
                        text-align: center;
                    }
                    .hero-content {
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .hero h1 {
                        font-size: 2.5rem;
                        margin-bottom: 1rem;
                    }
                    .hero p {
                        font-size: 1.2rem;
                        margin-bottom: 2rem;
                    }
                    .btn {
                        display: inline-block;
                        padding: 0.75rem 1.5rem;
                        border-radius: 4px;
                        text-decoration: none;
                        font-weight: bold;
                        margin: 0 0.5rem;
                    }
                    .btn-primary {
                        background-color: ${siteData.colors.primary};
                        color: white;
                    }
                    .btn-outline {
                        border: 2px solid white;
                        color: white;
                    }
                    .section {
                        padding: 4rem 1rem;
                    }
                    .section-title {
                        text-align: center;
                        margin-bottom: 3rem;
                    }
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    .placeholder {
                        background-color: #f0f4ff;
                        border-radius: 8px;
                        height: 200px;
                        margin: 20px 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #4a6cf7;
                    }
                </style>
            </head>
            <body>
                <header>
                    <div class="header-content">
                        <div class="logo">${siteData.businessName}</div>
                        <nav>
                            <ul>
                                <li><a href="#">Home</a></li>
                                <li><a href="#">About</a></li>
                                <li><a href="#">Services</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </nav>
                    </div>
                </header>
                
                <section class="hero">
                    <div class="hero-content">
                        <h1>${siteData.businessName}</h1>
                        <p>${siteData.description}</p>
                        <div class="hero-buttons">
                            <a href="#" class="btn btn-primary">Get Started</a>
                            <a href="#" class="btn btn-outline">Learn More</a>
                        </div>
                    </div>
                </section>
                
                <section class="section">
                    <div class="container">
                        <h2 class="section-title">About Us</h2>
                        <div class="placeholder">About Section Content</div>
                    </div>
                </section>
                
                <section class="section" style="background-color: #f8fafc;">
                    <div class="container">
                        <h2 class="section-title">Our Services</h2>
                        <div class="placeholder">Services Section Content</div>
                    </div>
                </section>
                
                <section class="section">
                    <div class="container">
                        <h2 class="section-title">Gallery</h2>
                        <div class="placeholder">Gallery Section Content</div>
                    </div>
                </section>
                
                <section class="section" style="background-color: #f8fafc;">
                    <div class="container">
                        <h2 class="section-title">Contact Us</h2>
                        <div class="placeholder">Contact Section Content</div>
                    </div>
                </section>
                
                <footer style="background-color: #1e293b; color: white; padding: 2rem 1rem; text-align: center;">
                    <div class="container">
                        <p>&copy; 2025 ${siteData.businessName}. All rights reserved.</p>
                    </div>
                </footer>
            </body>
            </html>
        `);
        iframeDoc.close();
    }
    
    // Update preview when form fields change
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });
    
    // Update preview
    function updatePreview() {
        // Collect current data
        const siteTitle = document.getElementById('site-title').value;
        const siteTagline = document.getElementById('site-tagline').value;
        const primaryColor = document.getElementById('primary-color')?.value || siteData.colors.primary;
        
        // Get the iframe document
        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        
        // Update site title
        const logoElement = iframeDoc.querySelector('.logo');
        if (logoElement) {
            logoElement.textContent = siteTitle;
        }
        
        // Update hero title and description
        const heroTitle = iframeDoc.querySelector('.hero h1');
        const heroDescription = iframeDoc.querySelector('.hero p');
        
        if (heroTitle) {
            heroTitle.textContent = siteTitle;
        }
        
        if (heroDescription) {
            heroDescription.textContent = siteTagline;
        }
        
        // Update colors
        const style = iframeDoc.querySelector('style');
        if (style) {
            let cssText = style.textContent;
            cssText = cssText.replace(/background-color: #[0-9a-f]{6};/g, `background-color: ${primaryColor};`);
            style.textContent = cssText;
        }
    }
    
    // Placeholder loaders for demo
    function loadPlaceholderEditor(sectionId) {
        const otherSections = document.getElementById('other-sections');
        otherSections.innerHTML = `
            <div class="form-group">
                <label>Section Title</label>
                <input type="text" value="${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}">
            </div>
            
            <div class="form-group">
                <label>Section Content</label>
                <textarea rows="4">Add your ${sectionId} content here.</textarea>
            </div>
            
            <div class="form-group">
                <label>Layout</label>
                <select>
                    <option value="standard">Standard</option>
                    <option value="grid">Grid</option>
                    <option value="columns">Columns</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Background</label>
                <select>
                    <option value="white">White</option>
                    <option value="light">Light Gray</option>
                    <option value="dark">Dark</option>
                    <option value="image">Background Image</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Placeholder Content</label>
                <p style="color: #64748b; font-size: 14px;">This is a demo editor. In a full implementation, each section would have custom controls specific to that section type.</p>
            </div>
        `;
    }
    
    function loadPlaceholderPanel(settingId) {
        const otherSections = document.getElementById('other-sections');
        otherSections.innerHTML = `
            <div class="form-group">
                <label>${settingId.charAt(0).toUpperCase() + settingId.slice(1)} Settings</label>
                <p style="color: #64748b; font-size: 14px;">This is a demo settings panel. In a full implementation, each settings section would have custom controls specific to that setting type.</p>
            </div>
            
            <div class="placeholder-message">
                <i class="fas fa-cog"></i>
                <p>Settings controls for ${settingId} would appear here.</p>
            </div>
        `;
    }
}); 