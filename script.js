/**
 * 随机圣旨生成器
 * 从tang.txt文件中随机抽取一行圣旨显示
 */

class PoemGenerator {
    constructor() {
        // 初始化DOM元素引用
        this.poemText = document.getElementById('poem-text');
        this.generateBtn = document.getElementById('generate-btn');
        this.copyBtn = document.getElementById('copy-btn'); // 复制按钮引用
        this.showAllBtn = document.getElementById('show-all-btn'); // 查看所有圣旨按钮引用
        this.poemModal = document.getElementById('poem-modal'); // 模态窗口引用
        this.closeModalBtn = document.getElementById('close-modal-btn'); // 关闭按钮引用
        this.copyAllBtn = document.getElementById('copy-all-btn'); // 复制所有按钮引用
        this.exportTxtBtn = document.getElementById('export-txt-btn'); // 导出按钮引用
        this.poemsList = document.getElementById('poems-list'); // 圣旨列表容器引用
        this.totalPoemsSpan = document.getElementById('total-poems'); // 总数显示引用
        
        this.poems = []; // 存储所有圣旨的数组
        this.currentPoem = ''; // 存储当前显示的圣旨
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 加载圣旨数据
        this.loadPoems();
    }
    
    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 点击事件
        this.generateBtn.addEventListener('click', () => {
            this.generateRandomPoem();
        });
        
        // 复制按钮点击事件
        this.copyBtn.addEventListener('click', () => {
            this.copyCurrentPoem();
        });
        
        // 查看所有圣旨按钮点击事件
        this.showAllBtn.addEventListener('click', () => {
            this.showAllPoems();
        });
        
        // 关闭模态窗口按钮点击事件
        this.closeModalBtn.addEventListener('click', () => {
            this.closeModal();
        });
        
        // 复制所有圣旨按钮点击事件
        this.copyAllBtn.addEventListener('click', () => {
            this.copyAllPoems();
        });
        
        // 导出TXT按钮点击事件
        this.exportTxtBtn.addEventListener('click', () => {
            this.exportToTxt();
        });
        
        // 模态窗口背景点击关闭
        this.poemModal.addEventListener('click', (e) => {
            if (e.target === this.poemModal || e.target.classList.contains('modal-backdrop')) {
                this.closeModal();
            }
        });
        
        // 移动端触摸事件优化 - 生成按钮
        this.generateBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.generateBtn.classList.add('active');
        });
        
        this.generateBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.generateBtn.classList.remove('active');
            this.generateRandomPoem();
        });
        
        this.generateBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.generateBtn.classList.remove('active');
        });
        
        // 移动端触摸事件优化 - 复制按钮
        this.copyBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.copyBtn.classList.add('active');
        });
        
        this.copyBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.copyBtn.classList.remove('active');
            this.copyCurrentPoem();
        });
        
        this.copyBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.copyBtn.classList.remove('active');
        });
        
        // 键盘事件监听（桌面端）
        document.addEventListener('keydown', (event) => {
            // 如果模态窗口打开，优先处理模态窗口相关的快捷键
            if (!this.poemModal.classList.contains('hidden')) {
                if (event.code === 'Escape') {
                    event.preventDefault();
                    this.closeModal();
                    return;
                }
                if (event.ctrlKey && event.code === 'KeyA') {
                    event.preventDefault();
                    this.copyAllPoems();
                    return;
                }
                return; // 模态窗口打开时，阻止其他快捷键
            }
            
            if (event.code === 'Space') {
                event.preventDefault();
                this.generateRandomPoem();
            }
            // 按Ctrl+C复制当前圣旨
            if (event.ctrlKey && event.code === 'KeyC' && this.currentPoem) {
                event.preventDefault();
                this.copyCurrentPoem();
            }
            // 按V键查看所有圣旨
            if (event.code === 'KeyV') {
                event.preventDefault();
                this.showAllPoems();
            }
            // 按ESC键触发CRT关机/开机效果
            if (event.code === 'Escape') {
                this.toggleCRTEffect();
            }
            // 按F键切换强化扫描线效果
            if (event.code === 'KeyF') {
                this.toggleIntenseScan();
            }
        });
        
        // 移动端方向变化监听
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // 移动端视口大小变化监听
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    /**
     * 从tang.txt文件加载圣旨数据
     */
    async loadPoems() {
        try {
            // 显示加载状态
            this.showLoading();
            
            // 使用fetch API读取tang.txt文件
            const response = await fetch('tang.txt');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            
            // 将文本按行分割，并过滤掉空行
            this.poems = text.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);
            
            console.log(`成功加载 ${this.poems.length} 句圣旨`);
            
            // 隐藏加载状态
            this.hideLoading();
            
            // 如果成功加载，显示提示信息
            if (this.poems.length > 0) {
                this.poemText.innerHTML = '<span class="prompt-text">>>> 圣旨加载完成，点击按钮获取随机圣旨 <<<</span>';
            } else {
                this.poemText.innerHTML = '<span class="prompt-text">>>> 未找到圣旨内容 <<<</span>';
            }
            
        } catch (error) {
            console.error('加载圣旨失败:', error);
            this.poemText.innerHTML = '<span class="prompt-text">>>> 加载圣旨失败，请检查tang.txt文件是否存在 <<<</span>';
            this.hideLoading();
        }
    }
    
    /**
     * 生成随机圣旨
     */
    generateRandomPoem() {
        // 检查是否有可用的圣旨
        if (this.poems.length === 0) {
            this.poemText.innerHTML = '<span class="prompt-text">>>> 没有可用的圣旨，请先加载数据 <<<</span>';
            return;
        }
        
        // 显示加载动画
        this.showLoading();
        
        // 模拟加载延迟，增加用户体验
        setTimeout(() => {
            // 生成随机索引
            const randomIndex = Math.floor(Math.random() * this.poems.length);
            
            // 获取随机圣旨
            const randomPoem = this.poems[randomIndex];
            
            // 显示圣旨
            this.displayPoem(randomPoem);
            
            // 隐藏加载动画
            this.hideLoading();
            
            // 记录日志
            console.log(`显示第 ${randomIndex + 1} 首圣旨: ${randomPoem}`);
            
        }, 300); // 300毫秒延迟
    }
    
    /**
     * 显示圣旨
     * @param {string} poem - 要显示的圣旨
     */
    displayPoem(poem) {
        // 存储当前圣旨
        this.currentPoem = poem;
        
        // 添加淡入动画效果
        this.poemText.classList.remove('fade-in');
        this.poemText.innerHTML = `<span class="poem-content">『 ${poem} 』</span>`;
        
        // 强制重绘，然后添加动画类
        this.poemText.offsetHeight;
        this.poemText.classList.add('fade-in');
        
        // 启用复制按钮
        this.copyBtn.disabled = false;
        this.copyBtn.classList.remove('disabled');
        
        console.log(`圣旨显示完成，已启用复制功能: ${poem}`);
    }
    
    /**
     * 显示加载状态
     */
    showLoading() {
        this.poemText.innerHTML = '<span class="prompt-text loading">>>> 正在获取圣旨... <<<</span>';
        this.poemText.classList.add('loading');
        this.generateBtn.disabled = true;
        this.generateBtn.innerHTML = '<span class="btn-icon">⚡</span>加载中...<span class="btn-icon">⚡</span>';
    }
    
    /**
     * 隐藏加载状态
     */
    hideLoading() {
        this.poemText.classList.remove('loading');
        this.generateBtn.disabled = false;
        this.generateBtn.innerHTML = '<span class="btn-icon">⚡</span>获取随机圣旨<span class="btn-icon">⚡</span>';
    }
    
    /**
     * 复制当前圣旨到剪贴板
     */
    async copyCurrentPoem() {
        // 检查是否有可复制的圣旨
        if (!this.currentPoem) {
            console.warn('没有可复制的圣旨内容');
            this.showCopyFeedback('没有可复制的内容', false);
            return;
        }
        
        try {
            // 使用现代剪贴板API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(this.currentPoem);
                console.log('使用Clipboard API复制成功:', this.currentPoem);
                this.showCopyFeedback('复制成功!', true);
            } else {
                // 降级到传统方法
                this.fallbackCopyToClipboard(this.currentPoem);
            }
        } catch (error) {
            console.error('复制失败:', error);
            // 尝试降级方法
            this.fallbackCopyToClipboard(this.currentPoem);
        }
    }
    
    /**
     * 降级复制方法（兼容性更好）
     * @param {string} text - 要复制的文本
     */
    fallbackCopyToClipboard(text) {
        try {
            // 创建临时文本区域
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            
            // 选择文本并复制
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                console.log('使用降级方法复制成功:', text);
                this.showCopyFeedback('复制成功!', true);
            } else {
                throw new Error('降级复制方法失败');
            }
        } catch (error) {
            console.error('降级复制方法失败:', error);
            this.showCopyFeedback('复制失败，请手动复制', false);
        }
    }
    
    /**
     * 显示复制操作反馈
     * @param {string} message - 反馈消息
     * @param {boolean} success - 是否成功
     */
    showCopyFeedback(message, success) {
        // 临时改变按钮文本和样式
        const originalHTML = this.copyBtn.innerHTML;
        const originalClass = this.copyBtn.className;
        
        // 设置反馈样式
        this.copyBtn.innerHTML = `<span class="btn-icon">${success ? '✓' : '✗'}</span>${message}<span class="btn-icon">${success ? '✓' : '✗'}</span>`;
        this.copyBtn.classList.add(success ? 'copy-success' : 'copy-error');
        this.copyBtn.disabled = true;
        
        // 2秒后恢复原状
        setTimeout(() => {
            this.copyBtn.innerHTML = originalHTML;
            this.copyBtn.className = originalClass;
            this.copyBtn.disabled = !this.currentPoem; // 只有当有圣旨时才启用
        }, 2000);
        
        console.log(`复制反馈: ${message} (${success ? '成功' : '失败'})`);
    }
    
    /**
     * 显示所有圣旨的模态窗口
     */
    showAllPoems() {
        // 检查是否有可用的圣旨
        if (this.poems.length === 0) {
            this.showCopyFeedback('没有可用的圣旨数据', false);
            return;
        }
        
        console.log(`显示所有圣旨模态窗口，共 ${this.poems.length} 条圣旨`);
        
        // 更新圣旨总数
        this.totalPoemsSpan.textContent = this.poems.length;
        
        // 生成圣旨列表
        this.renderPoemsList();
        
        // 显示模态窗口
        this.poemModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // 禁止背景滚动
        
        // 添加显示动画
        setTimeout(() => {
            this.poemModal.classList.add('show');
        }, 10);
    }
    
    /**
     * 关闭模态窗口
     */
    closeModal() {
        console.log('关闭圣旨列表模态窗口');
        
        // 添加隐藏动画
        this.poemModal.classList.remove('show');
        
        setTimeout(() => {
            this.poemModal.classList.add('hidden');
            document.body.style.overflow = ''; // 恢复背景滚动
        }, 300);
    }
    
    /**
     * 渲染圣旨列表
     */
    renderPoemsList() {
        // 清空现有列表
        this.poemsList.innerHTML = '';
        
        // 为每条圣旨创建列表项
        this.poems.forEach((poem, index) => {
            const poemItem = document.createElement('div');
            poemItem.className = 'poem-item';
            poemItem.innerHTML = `
                <div class="poem-item-header">
                    <span class="poem-number">#${String(index + 1).padStart(3, '0')}</span>
                    <button class="poem-copy-btn" data-poem="${poem}" data-index="${index}">
                        <span class="btn-icon">📋</span>
                        复制
                    </button>
                </div>
                <div class="poem-item-content">
                    <span class="poem-item-text">『 ${poem} 』</span>
                </div>
            `;
            
            // 为复制按钮添加事件监听器
            const copyBtn = poemItem.querySelector('.poem-copy-btn');
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copySinglePoem(poem, index + 1, copyBtn);
            });
            
            this.poemsList.appendChild(poemItem);
        });
        
        console.log(`渲染完成，共 ${this.poems.length} 条圣旨`);
    }
    
    /**
     * 复制单条圣旨
     * @param {string} poem - 要复制的圣旨
     * @param {number} number - 圣旨编号
     * @param {HTMLElement} button - 触发复制的按钮
     */
    async copySinglePoem(poem, number, button) {
        try {
            // 使用现代剪贴板API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(poem);
                console.log(`使用Clipboard API复制第${number}条圣旨成功:`, poem);
                this.showPoemCopyFeedback(button, '已复制!', true);
            } else {
                // 降级到传统方法
                this.fallbackCopyToClipboard(poem);
                this.showPoemCopyFeedback(button, '已复制!', true);
            }
        } catch (error) {
            console.error(`复制第${number}条圣旨失败:`, error);
            this.showPoemCopyFeedback(button, '复制失败', false);
        }
    }
    
    /**
     * 复制所有圣旨
     */
    async copyAllPoems() {
        if (this.poems.length === 0) {
            this.showModalFeedback('没有可复制的圣旨', false);
            return;
        }
        
        // 将所有圣旨组合成一个字符串
        const allPoemsText = this.poems.map((poem, index) => 
            `${index + 1}. ${poem}`
        ).join('\n\n');
        
        try {
            // 使用现代剪贴板API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(allPoemsText);
                console.log(`使用Clipboard API复制所有圣旨成功，共 ${this.poems.length} 条`);
                this.showModalFeedback(`成功复制 ${this.poems.length} 条圣旨!`, true);
            } else {
                // 降级到传统方法
                this.fallbackCopyToClipboard(allPoemsText);
                this.showModalFeedback(`成功复制 ${this.poems.length} 条圣旨!`, true);
            }
        } catch (error) {
            console.error('复制所有圣旨失败:', error);
            this.showModalFeedback('复制失败，请重试', false);
        }
    }
    
    /**
     * 导出为TXT文件
     */
    exportToTxt() {
        if (this.poems.length === 0) {
            this.showModalFeedback('没有可导出的圣旨数据', false);
            return;
        }
        
        // 创建文件内容
        const header = `丁字裤圣旨大全\n生成时间：${new Date().toLocaleString()}\n总计：${this.poems.length} 条圣旨\n${'='.repeat(50)}\n\n`;
        const content = this.poems.map((poem, index) => 
            `${String(index + 1).padStart(3, '0')}. ${poem}`
        ).join('\n\n');
        const fileContent = header + content;
        
        // 创建并下载文件
        try {
            const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `丁字裤圣旨大全_${new Date().toISOString().slice(0, 10)}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            console.log(`导出TXT文件成功，共 ${this.poems.length} 条圣旨`);
            this.showModalFeedback(`导出成功！文件包含 ${this.poems.length} 条圣旨`, true);
        } catch (error) {
            console.error('导出TXT文件失败:', error);
            this.showModalFeedback('导出失败，请重试', false);
        }
    }
    
    /**
     * 显示单个圣旨复制按钮的反馈
     * @param {HTMLElement} button - 按钮元素
     * @param {string} message - 反馈消息
     * @param {boolean} success - 是否成功
     */
    showPoemCopyFeedback(button, message, success) {
        const originalHTML = button.innerHTML;
        const originalClass = button.className;
        
        // 设置反馈样式
        button.innerHTML = `<span class="btn-icon">${success ? '✓' : '✗'}</span>${message}`;
        button.classList.add(success ? 'copy-success' : 'copy-error');
        button.disabled = true;
        
        // 1.5秒后恢复原状
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.className = originalClass;
            button.disabled = false;
        }, 1500);
    }
    
    /**
     * 显示模态窗口内的操作反馈
     * @param {string} message - 反馈消息
     * @param {boolean} success - 是否成功
     */
    showModalFeedback(message, success) {
        // 创建临时反馈元素
        const feedback = document.createElement('div');
        feedback.className = `modal-feedback ${success ? 'success' : 'error'}`;
        feedback.innerHTML = `
            <span class="feedback-icon">${success ? '✓' : '✗'}</span>
            <span class="feedback-message">${message}</span>
        `;
        
        // 插入到模态窗口顶部
        const modalContent = this.poemModal.querySelector('.modal-content');
        modalContent.insertBefore(feedback, modalContent.firstChild);
        
        // 3秒后移除反馈
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 3000);
        
        console.log(`模态窗口反馈: ${message} (${success ? '成功' : '失败'})`);
    }
    
    /**
     * 切换CRT关机/开机效果
     */
    toggleCRTEffect() {
        const container = document.querySelector('.container');
        
        if (container.classList.contains('crt-shutdown')) {
            // 如果正在关机，则开机
            container.classList.remove('crt-shutdown');
            container.classList.add('crt-startup');
            
            setTimeout(() => {
                container.classList.remove('crt-startup');
            }, 800);
            
            console.log('CRT显示器开机');
        } else {
            // 触发关机效果
            container.classList.add('crt-shutdown');
            
            setTimeout(() => {
                container.classList.remove('crt-shutdown');
                container.classList.add('crt-startup');
                
                setTimeout(() => {
                    container.classList.remove('crt-startup');
                }, 800);
            }, 500);
            
            console.log('CRT显示器关机/重启');
        }
    }
    
    /**
     * 切换强化扫描线效果
     */
    toggleIntenseScan() {
        const body = document.body;
        
        if (body.classList.contains('crt-intense-scan')) {
            body.classList.remove('crt-intense-scan');
            console.log('关闭强化扫描线效果');
        } else {
            body.classList.add('crt-intense-scan');
            console.log('开启强化扫描线效果');
            
            // 5秒后自动关闭
            setTimeout(() => {
                body.classList.remove('crt-intense-scan');
                console.log('强化扫描线效果自动关闭');
            }, 5000);
        }
    }
    
    /**
     * 处理设备方向变化
     */
    handleOrientationChange() {
        console.log('设备方向已改变');
        
        // 重新计算布局
        const container = document.querySelector('.container');
        if (container) {
            container.style.transition = 'none';
            
            // 强制重新渲染
            container.offsetHeight;
            
            setTimeout(() => {
                container.style.transition = '';
            }, 100);
        }
    }
    
    /**
     * 处理窗口大小变化
     */
    handleResize() {
        console.log('窗口大小已改变');
        
        // 检查是否为移动设备
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 移动端特殊处理
            this.optimizeForMobile();
        } else {
            // 桌面端恢复
            this.optimizeForDesktop();
        }
    }
    
    /**
     * 移动端优化
     */
    optimizeForMobile() {
        console.log('启用移动端优化');
        
        // 禁用一些动画以提升性能
        const container = document.querySelector('.container');
        if (container) {
            container.style.animation = 'none';
        }
        
        // 减少发光效果
        document.body.style.setProperty('--glow-intensity', '0.5');
    }
    
    /**
     * 桌面端优化
     */
    optimizeForDesktop() {
        console.log('启用桌面端优化');
        
        // 恢复动画
        const container = document.querySelector('.container');
        if (container) {
            container.style.animation = '';
        }
        
        // 恢复发光效果
        document.body.style.setProperty('--glow-intensity', '1');
    }
    
    /**
     * 防抖函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// 页面加载完成后初始化圣旨生成器
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，初始化圣旨生成器');
    
    // 添加CRT开机效果
    const container = document.querySelector('.container');
    container.classList.add('crt-startup');
    
    setTimeout(() => {
        container.classList.remove('crt-startup');
        console.log('CRT显示器启动完成');
    }, 800);
    
    new PoemGenerator();
});

// 添加页面可见性变化监听器
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('页面变为可见状态');
    } else {
        console.log('页面变为隐藏状态');
    }
}); 