// TODO: 存在BUG，当图片宽度大于容器一点时，最右侧有穿帮
export class Tabs {


    constructor() {
        const tabs = document.querySelectorAll('div[type="tabs"]');
        for (let i = 0; i < tabs.length; i++) {
            const tc = tabs[i];
            this.initTabs(tc as HTMLDivElement);
        }
    }

    initTabs(tabs: HTMLDivElement) {
        const tabsViews = tabs.querySelectorAll('div[type="tabsView"]');
        for (let i = 0; i < tabsViews.length; i++) {
            const tabsV = tabsViews[i] as HTMLDivElement;
            tabsV.style.width = `${tabs.clientWidth}px`;
            this.initTabView(tabsV as HTMLDivElement);
        }

        const btnGroup = tabs.querySelectorAll('div[type="btnGroup"]');
        for (let i = 0; i < btnGroup.length; i++) {
            const btnG = btnGroup[i];
            this.initBtnGroupItems(btnG as HTMLDivElement);
        }
    }


    initBtnGroupItems(btnGroup: HTMLDivElement) {
        const btnGroupItems = btnGroup.querySelectorAll('div[type="btnGroupItem"]');
        var select = btnGroup.querySelector('.select') as HTMLSpanElement;
        if (select == null) {
            select = document.createElement('span');
            btnGroup.appendChild(select);
        }
        for (let i = 0; i < btnGroupItems.length; i++) {
            const btnGItem = btnGroupItems[i];
            const selected = btnGItem.getAttribute('select');
            if (selected != null) {
                select.style.left = (btnGItem as HTMLDivElement).offsetLeft + "px";
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

    initTabView(tabsView: HTMLDivElement) {
        const tabs = tabsView.querySelectorAll('div[type="tab"]');
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i] as HTMLDivElement;
            tab.style.width = `${tabsView.clientWidth}px`
        }
        tabsView.style.width = `${tabs.length * tabsView.clientWidth}px`;
    }
}

