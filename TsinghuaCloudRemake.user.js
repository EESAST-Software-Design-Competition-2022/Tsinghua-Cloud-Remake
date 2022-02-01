// ==UserScript==
// @name         TsinghuaCloudRemake
// @description  Userscripts for enhancing Tsinghua Cloud
// @version      0.1.0
// @author       Zijian Zhang
// @copyright    2021, Zijian Zhang (https://github.com/Futrime)
// @license      MulanPSL-2.0
// @match        *://cloud.tsinghua.edu.cn/f/*
// @match        *://cloud.tsinghua.edu.cn/d/*/files/?p=*
// @match        *://api.021121.xyz/TCR/dev/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end

// @icon         https://cloud.tsinghua.edu.cn/media/img/favicon.ico
// ==/UserScript==

/*
 * Configurations
 */
const TCR_config = {
    staticURL: 'http://localhost:8080/static',
    backendURL: 'https://api.021121.xyz/TCR/api'
};

(async () => {
    'use strict';
    /*
     * Initialization
     */
    // Load rewritten pages
    const HTMLCache = {
        video: await fetch(TCR_config.staticURL + '/video.html', {
            mode: 'cors'
        }).then((res) => res.text())
    };

    // Add the button for remaking
    let remakeButton = document.createElement('button');
    remakeButton.textContent = 'Remake!';
    remakeButton.classList.add('btn', 'btn-outline-secondary', 'mx-auto', 'mb-2', 'px-auto', 'py-0');
    let accountNode = document.querySelector('#account');
    accountNode.classList.add('flex-fill', 'd-flex', 'flex-row-reverse');
    remakeButton = document.querySelector('.shared-file-view-md-header').insertBefore(remakeButton, accountNode);
    remakeButton.addEventListener('click', (event) => {
        remake();
    });

    console.log('TsinghuaCloudRemake is loaded!');

    if (GM_getValue('TCR_enabled', false)) {
        remake();
    }


    /*
     * Main function
     */
    function remake() {
        console.log('Remake!');
        GM_setValue('TCR_enabled', true);
        switch (shared.pageOptions.fileType) {
            case 'Video':
                console.log('Video mode.');
                document.querySelector('html').parentNode.removeChild(document.querySelector('html')); // To rewrite the whole page
                document.write(HTMLCache.video);
                break;

            default:
                console.log('Unsupported mode.');
                remakeButton.setAttribute('disabled', '');
                remakeButton.textContent = '此页面不支持Remake!';
                break;
        }
        const configNode = document.createElement('meta');
        configNode.setAttribute('name', 'TCR-config');
        configNode.setAttribute('config', JSON.stringify(TCR_config));
        configNode.setAttribute('status', 'enabled');
        configNode.addEventListener('click', (event) => {
            const status = document.querySelector('meta[name="TCR-config"]').getAttribute('status');
            if (status === 'enabled') {
                GM_setValue('TCR_enabled', true);
            } else if (status === 'disabled') {
                GM_setValue('TCR_enabled', false);
            }
        });
        document.querySelector('head').append(configNode);
    }

})();