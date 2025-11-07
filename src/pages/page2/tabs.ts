// TODO: 存在BUG，当图片宽度大于容器一点时，最右侧有穿帮
export class Tabs {


    constructor() {
        // 获取Tabs主体
        const tabs = document.querySelectorAll('[type="tabs"]');
        for (let i = 0; i < tabs.length; i++) {
            const tc = tabs[i];
            this.initTabs(tc as HTMLDivElement);
        }
    }

    // 初始化插件
    initTabs(tabs: HTMLDivElement) {
        var direction: "Vertical" | "Horizontal" = "Vertical";
        const tabsDirection = tabs.getAttribute('direction');
        if (tabsDirection != null) {
            direction = tabsDirection as "Vertical" | "Horizontal";
        }
        var animation: "row" | "switch" = "row";
        const tabAnimation = tabs.getAttribute('animation');
        if (tabAnimation != null) {
            animation = tabAnimation as "row" | "switch";
        }
        // 获取Tabs场景容器
        const tabsViews = tabs.querySelectorAll('[type="tabsView"]');
        for (let i = 0; i < tabsViews.length; i++) {
            const tabsV = tabsViews[i] as HTMLDivElement;
            if (direction == "Horizontal") {
            } else {
                tabsV.style.width = `${tabs.clientWidth}px`;
            }
            this.initTabView(tabsV as HTMLDivElement, direction, animation);
        }

        // 获取按钮组
        const btnGroup = tabs.querySelectorAll('[type="btnGroup"]');
        for (let i = 0; i < btnGroup.length; i++) {
            const btnG = btnGroup[i];
            this.initBtnGroupItems(btnG as HTMLDivElement);
        }
    }


    // 初始化按钮组中的按钮
    initBtnGroupItems(btnGroup: HTMLDivElement) {
        const btnGroupItems = btnGroup.querySelectorAll('[type="btnGroupItem"]');
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

            var animation: "row" | "switch" = "row";
            var direction: "Vertical" | "Horizontal" = "Vertical";
            const tabsRoot = btnGroup.parentElement as HTMLDivElement;
            if (tabsRoot) {
                const tabsDirection = tabsRoot.getAttribute('direction');
                if (tabsDirection != null) {
                    direction = tabsDirection as "Vertical" | "Horizontal";
                }
                const tabAnimation = tabsRoot.getAttribute('animation');
                if (tabAnimation != null) {
                    animation = tabAnimation as "row" | "switch";
                }
            }
            const btnTitle = btnGItem.querySelector('[title]') as HTMLElement;
            const btnContent = btnGItem.querySelector('[content]') as HTMLElement;

            const selected = btnGItem.getAttribute('select');
            if (selected != null) {
                if (btnTitle && btnContent) {
                    btnTitle.classList.add('display-none')
                    btnContent.classList.remove('display-none');
                }
                // 等待一下再设置select的left值，因为选中按钮需要根据隐藏的项重新排版
                setTimeout(() => {
                    // 根据选中状态设置select的left值
                    if (direction == "Horizontal") {
                        // 根据选中状态设置select的left值
                        select.style.top = (btnGItem as HTMLDivElement).offsetTop + "px";
                        select.style.height = (btnGItem as HTMLDivElement).offsetHeight + "px";
                    } else {
                        select.style.left = (btnGItem as HTMLDivElement).offsetLeft + "px";
                    }
                }, 10);
                // 延迟一下在添加过度动画时间，以免从屏幕最左侧移动到选中按钮下，如需要此动画去掉setTimeout
                const sto = setTimeout(() => {
                    select.style.transitionDuration = "300ms";
                    clearTimeout(sto);
                }, 10);


                // 获取按钮设置的tabID
                const tabID = btnGItem.getAttribute('tabID');
                // 获取tabID对应的tab
                const tabDiv = tabsRoot.querySelector(`[type="tab"][tabID="${tabID}"]`) as HTMLDivElement;
                const tabsView = tabDiv.parentElement as HTMLDivElement;
                if (animation == "row") {
                    if (direction == "Horizontal") {
                        tabsView.style.top = `-${tabDiv.offsetTop}px`;
                    } else {
                        tabsView.style.left = `-${tabDiv.offsetLeft}px`;
                    }
                } else if (animation == "switch") {
                    const allTabDiv = tabsRoot.querySelectorAll(`[type="tab"]`);
                    for (let i = 0; i < allTabDiv.length; i++) {
                        const td = allTabDiv[i] as HTMLDivElement;
                        if (td == tabDiv) {
                            td.classList.add('select-tab');
                            td.classList.remove('display-none');
                            continue
                        }
                        td.classList.remove('select-tab');
                        td.classList.add('display-none');
                    }
                }
                tabsView.style.transitionDuration = "300ms";
            } else if (btnTitle && btnContent) {
                btnTitle.classList.remove('display-none');
                btnContent.classList.add('display-none');
            }


            // 添加点击事件
            btnGItem.addEventListener('click', (event) => {
                const thisBtn = event.target === event.currentTarget ? event.target as HTMLDivElement : (event.target as HTMLDivElement).parentElement as HTMLDivElement;
                const selected = thisBtn.getAttribute('select');
                if (selected != null) {
                    return;
                }


                // 移除所有选中项
                for (let i = 0; i < btnGroupItems.length; i++) {
                    const btnGItem = btnGroupItems[i];
                    if (btnGItem == thisBtn) {
                        continue;
                    }
                    btnGItem.removeAttribute('select');
                    const btnTitle = btnGItem.querySelector('[title]') as HTMLElement;
                    const btnContent = btnGItem.querySelector('[content]') as HTMLElement;
                    if (btnTitle && btnContent) {
                        btnTitle.classList.remove('display-none');
                        btnContent.classList.add('display-none');
                    }

                }
                const btnTitle = thisBtn.querySelector('[title]') as HTMLElement;
                const btnContent = thisBtn.querySelector('[content]') as HTMLElement;
                if (btnTitle && btnContent) {
                    btnTitle.classList.add('display-none')
                    btnContent.classList.remove('display-none');
                }
                // 添加选中项

                if (direction == "Horizontal") {
                    // 根据选中状态设置select的left值
                    select.style.top = thisBtn.offsetTop + "px";
                    select.style.height = (btnGItem as HTMLDivElement).offsetHeight + "px";
                } else {
                    select.style.left = thisBtn.offsetLeft + 'px';
                }

                // 获取按钮设置的tabID
                const tabID = thisBtn.getAttribute('tabID');
                // 获取tabID对应的tab
                const tabDiv = document.querySelector(`[type="tab"][tabID="${tabID}"]`) as HTMLDivElement;
                const tabsView = tabDiv.parentElement as HTMLDivElement;
                if (animation == "row") {
                    if (direction == "Horizontal") {
                        tabsView.style.top = `-${tabDiv.offsetTop}px`;
                    } else {
                        tabsView.style.left = `-${tabDiv.offsetLeft}px`;
                    }
                } else if (animation == "switch") {
                    const allTabDiv = tabsRoot.querySelectorAll(`[type="tab"]`);

                    tabDiv.classList.remove('display-none');
                    setTimeout(() => {
                        tabDiv.classList.add('select-tab');
                        for (let i = 0; i < allTabDiv.length; i++) {
                            const td = allTabDiv[i] as HTMLDivElement;
                            if (td == tabDiv) {
                                continue
                            }
                            td.classList.remove('select-tab');
                        }
                        tabDiv.addEventListener('transitionend', () => {
                            for (let i = 0; i < allTabDiv.length; i++) {
                                const td = allTabDiv[i] as HTMLDivElement;
                                if (!td.classList.contains('select-tab')) {
                                    td.classList.add('display-none');
                                }
                            }
                        });
                    }, 10);
                    // setTimeout(() => {
                    // }, 100);
                }
                // 延迟一下再添加，上面的动画需要先准备一下
                setTimeout(() => {
                    thisBtn.setAttribute('select', '');
                }, 10);
            });
        }
    }

    // 初始化Tab场景
    initTabView(tabsView: HTMLDivElement, direction: "Vertical" | "Horizontal", animation: "row" | "switch") {
        const tabs = tabsView.querySelectorAll('[type="tab"]');
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i] as HTMLDivElement;
            // console.log('initTabView switch:', animation, tab);
            if (animation == "row" && direction == "Vertical") {
                tab.style.width = `${tabsView.clientWidth}px`
                // } else if (animation == "switch") {
                //     tab.classList.add('display-none');
            }
        }
        const animationType = tabsView.getAttribute('animation');
        if (direction == "Vertical" && animationType == "row") {
            tabsView.style.width = `${tabs.length * tabsView.clientWidth}px`;
        }
    }
}

