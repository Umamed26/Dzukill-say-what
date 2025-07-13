/**
 * 随机圣旨生成器
 * 从tang.txt文件中随机抽取一行圣旨显示
 */

class PoemGenerator {
    constructor() {
        // 初始化DOM元素引用
        this.poemText = document.getElementById('poem-text');
        this.generateBtn = document.getElementById('generate-btn');
        this.poems = []; // 存储所有圣旨的数组
        
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
        
        // 移动端触摸事件优化
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
        
        // 键盘事件监听（桌面端）
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                this.generateRandomPoem();
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
        // 添加淡入动画效果
        this.poemText.classList.remove('fade-in');
        this.poemText.innerHTML = `<span class="poem-content">『 ${poem} 』</span>`;
        
        // 强制重绘，然后添加动画类
        this.poemText.offsetHeight;
        this.poemText.classList.add('fade-in');
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