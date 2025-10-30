// TODO: 存在BUG，当图片宽度大于容器一点时，最右侧有穿帮
export class HorizontalScroll {

    // 获取图片容器
    scrollImages = document.querySelector('.horizontal-scroll-img');
    // 获取图片元素数组
    imgChildren: HTMLImageElement[] = [];
    // 是否已调换
    Exchanged = false;
    // 图片间隔(单位px)，需要与图片css的margin-right一致
    imageGap = 10;
    // 过一张图片的时间图片宽度差别太大需要更改为根据图片宽度计算时间
    animationDuration = 2;
    constructor() {
        if (this.scrollImages == null) {
            this.scrollImages = document.querySelector('.horizontal-scroll-img');
        }
        if (this.scrollImages == null) {
            return;
        }
        var maxImgWidth = 0;
        Array.from(this.scrollImages.children).forEach((child) => {
            maxImgWidth += child.clientWidth + this.imageGap;
            this.imgChildren.push(child as HTMLImageElement);
        });


        // 初始化
        const isScroll = this.handleHorizontalScroll(maxImgWidth);
        if (!isScroll) {
            return;
        }
        // 启动监听
        this.updateTranslateX();
    }

    // 监听TranslateX滚动位置
    updateTranslateX() {
        if (!this.scrollImages || this.scrollImages == null) {
            return;
        }
        // 获取当前元素的 transform 属性
        const transformValue = window.getComputedStyle(this.scrollImages).transform;
        const fistChild = this.imgChildren[0];

        // 解析 translateX 数值
        if (transformValue === 'none' || fistChild == null) {
            requestAnimationFrame(this.updateTranslateX.bind(this));
            return;
        }
        const transValueMatch = transformValue.match(/matrix.*\((.+)\)/);
        // 例如: matrix(1, 0, 0, 1, -300, 0)
        const matrixValues = transValueMatch == null ? [] : transValueMatch[1].split(', ');

        // matrix(1, 0, 0, 1, -300, 0) => [-300, 0] 取第5个值
        let translateX = parseFloat(matrixValues[4]);
        if (translateX < 0) {
            translateX = 0 - translateX;
        }
        if (!this.Exchanged && translateX > fistChild.clientWidth) {
            const nextChild = this.imgChildren[1];
            // 把滚动视图的第一个图片对象移到末尾
            this.scrollImages.appendChild(fistChild);
            // 把图片数组中第一个图片对象移到末尾
            const imgCShift = this.imgChildren.shift();
            if (imgCShift) {
                this.imgChildren.push(imgCShift);
            }
            if (nextChild != null) {
                // 如需要过图等时长，在此处重新计算时间
                this.removeKeyframesRule('scroll-left');
                this.addKeyframesRule(10, nextChild.clientWidth);
                this.Exchanged = true;
            }
        } else {
            this.Exchanged = false;
        }

        // 每次动画帧更新，继续检查
        requestAnimationFrame(this.updateTranslateX.bind(this));
    }

    // 初始化动画
    handleHorizontalScroll(maxImgWidth: number): boolean {
        const scrollImages = document.querySelector('.horizontal-scroll-img');
        if (scrollImages == null) {
            return false;
        }
        const scrollContainer = document.querySelector('.horizontal-scroll');  // 获取容器的宽度
        if (scrollContainer == null) {
            return false;
        }
        const fistChild = scrollImages.firstElementChild;
        if (fistChild == null) {
            return false;
        }
        const isScroll = maxImgWidth > scrollContainer.clientWidth;
        console.log("isScroll", isScroll, maxImgWidth, scrollContainer.clientWidth);
        // 动态设置动画持续时间
        (scrollImages as HTMLDivElement).style.animationDuration = `${this.animationDuration}s`;

        if (isScroll) {
            this.addKeyframesRule(0, fistChild.clientWidth);
        }
        return isScroll;
    }

    // 添加动画规则
    addKeyframesRule(notx: number, translateX: number) {
        // 通过JS更新动画关键帧的滚动距离
        var styleSheet = document.styleSheets[0];
        var keyframes = `
        @keyframes scroll-left {
          0% {
            transform: translateX(${notx}px);
          }
          100% {
            transform: translateX(-${translateX + this.imageGap}px);
          }
        }
      `;
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }

    // 使用 TypeScript 删除 @keyframes 动画规则
    removeKeyframesRule(ruleName: string) {
        const styleSheets = document.styleSheets;

        for (let i = 0; i < styleSheets.length; i++) {
            const sheet = styleSheets[i] as CSSStyleSheet;

            // 检查样式表是否是用户定义的
            if (sheet.cssRules) {
                const rules = sheet.cssRules;

                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j] as CSSKeyframesRule;

                    // 查找 @keyframes 规则
                    if (rule.name === ruleName) {
                        sheet.deleteRule(j); // 删除找到的 @keyframes 规则
                        return; // 一旦删除成功，停止查找
                    }
                }
            }
        }
    }
}

