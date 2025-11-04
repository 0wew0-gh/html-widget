export class FirstShowAnimation {
    constructor() {
        // 设置IntersectionObserver
        const targetElement = document.getElementById('target');
        if (targetElement == null) {
            return;
        }
        const targetNumDivs = targetElement.querySelectorAll('[type="number"]');
        if (targetNumDivs == null) {
            return;
        }
        console.log('att:', targetNumDivs);

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // 当目标元素进入视口并且是第一次进入时触发动画
                if (entry.isIntersecting) {
                    const att = entry.target.getAttribute('type');
                    if (att != null && att == "number") {
                        this.numberJump(entry.target as HTMLElement, 0, parseInt(entry.target.innerHTML))
                    } else {
                        entry.target.classList.add('show');
                    }
                    console.log('att:', att);
                    observer.unobserve(entry.target); // 停止观察该元素
                }
            });
        }, {
            threshold: 0.8 // 设定元素至少50%进入视口时触发
        });

        // 开始观察目标元素
        observer.observe(targetElement);
        for (let i = 0; i < targetNumDivs.length; i++) {
            const tNumDiv = targetNumDivs[i];
            observer.observe(tNumDiv);
        }

    }

    numberJump(numbDiv: HTMLElement, start: number, end: number, duration: number = 3) {
        const poolCount = 500;
        const diff = end - start;
        var addNum = Math.ceil(diff / poolCount);
        if (addNum % 10 == 0) {
            addNum += 1;
        }

        const durationNum = Math.ceil(duration * 1000 / (diff / addNum)) // Math.ceil(duration * 1000 / poolCount);
        // console.log('addNum:', end - start, addNum, diff / addNum, durationNum);
        var inter = setInterval(() => {
            if (start < end) {
                numbDiv.innerHTML = start.toString();
                start += addNum;
            } else {
                numbDiv.innerHTML = end.toString();
                clearInterval(inter);
            }
        }, durationNum);
    }
}