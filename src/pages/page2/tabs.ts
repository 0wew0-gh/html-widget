// TODO: 存在BUG，当图片宽度大于容器一点时，最右侧有穿帮
export class Tabs {


    constructor() {
        // 获取Tabs主体
        const tabs = document.querySelectorAll('div[type="tabs"]');
        for (let i = 0; i < tabs.length; i++) {
            const tc = tabs[i];
            this.initTabs(tc as HTMLDivElement);
        }
    }

    // 初始化插件
    initTabs(tabs: HTMLDivElement) {
        // 获取Tabs场景容器
        const tabsViews = tabs.querySelectorAll('div[type="tabsView"]');
        for (let i = 0; i < tabsViews.length; i++) {
            const tabsV = tabsViews[i] as HTMLDivElement;
            tabsV.style.width = `${tabs.clientWidth}px`;
            this.initTabView(tabsV as HTMLDivElement);
        }

        // 获取按钮组
        const btnGroup = tabs.querySelectorAll('div[type="btnGroup"]');
        for (let i = 0; i < btnGroup.length; i++) {
            const btnG = btnGroup[i];
            this.initBtnGroupItems(btnG as HTMLDivElement);
        }
    }


    // 初始化按钮组中的按钮
    initBtnGroupItems(btnGroup: HTMLDivElement) {
        const btnGroupItems = btnGroup.querySelectorAll('div[type="btnGroupItem"]');
        // 获取选中标记
        var select = btnGroup.querySelector('.select') as HTMLSpanElement;
        if (select == undefined || select == null) {
            // 如果找不到，则创建一个
            select = document.createElement('span');
            select.className = 'select';
            btnGroup.appendChild(select);
        }
        for (let i = 0; i < btnGroupItems.length; i++) {
            const btnGItem = btnGroupItems[i];
            // 获取按钮的选中状态 为 null 则没有，为 空字符串 则有select属性当前按钮为按下状态
            const selected = btnGItem.getAttribute('select');
            if (selected != null) {
                // 根据选中状态设置select的left值
                select.style.left = (btnGItem as HTMLDivElement).offsetLeft + "px";
                // 延迟一下在添加过度动画时间，以免从屏幕最左侧移动到选中按钮下，如需要此动画去掉setTimeout
                const sto = setTimeout(() => {
                    select.style.transitionDuration = "300ms";
                    clearTimeout(sto);
                }, 10);


                // 获取按钮设置的tabID
                const tabID = btnGItem.getAttribute('tabID');
                // 获取tabID对应的tab
                const tabDiv = document.querySelector(`div[type="tab"][tabID="${tabID}"]`) as HTMLDivElement;
                const tabsView = tabDiv.parentElement as HTMLDivElement;
                tabsView.style.left = `-${tabDiv.offsetLeft}px`;
                tabsView.style.transitionDuration = "300ms";
            }

            // 添加点击事件
            btnGItem.addEventListener('click', (event) => {
                const thisBtn = event.target as HTMLDivElement;
                const selected = thisBtn.getAttribute('select');
                if (selected != null) {
                    return;
                }
                // 移除所有选中项
                for (let i = 0; i < btnGroupItems.length; i++) {
                    const btnGItem = btnGroupItems[i];
                    btnGItem.removeAttribute('select');
                }
                // 添加选中项
                thisBtn.setAttribute('select', '');
                select.style.left = thisBtn.offsetLeft + 'px';

                // 获取按钮设置的tabID
                const tabID = thisBtn.getAttribute('tabID');
                // 获取tabID对应的tab
                const tabDiv = document.querySelector(`div[type="tab"][tabID="${tabID}"]`) as HTMLDivElement;
                const tabsView = tabDiv.parentElement as HTMLDivElement;
                tabsView.style.left = `-${tabDiv.offsetLeft}px`;
            });
        }
    }

    // 初始化Tab场景
    initTabView(tabsView: HTMLDivElement) {
        const tabs = tabsView.querySelectorAll('div[type="tab"]');
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i] as HTMLDivElement;
            tab.style.width = `${tabsView.clientWidth}px`
        }
        tabsView.style.width = `${tabs.length * tabsView.clientWidth}px`;
    }
}

