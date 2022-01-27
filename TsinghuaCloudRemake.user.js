// ==UserScript==
// @name         TsinghuaCloudRemake
// @description  Userscripts for enhancing Tsinghua Cloud
// @version      0.1.0
// @author       Zijian Zhang
// @copyright    2021, Zijian Zhang (https://github.com/Futrime)
// @license      MulanPSL-2.0
// @match        *://cloud.tsinghua.edu.cn/f/*
// @run-at       document-end

// @icon         https://cloud.tsinghua.edu.cn/media/img/favicon.ico
// ==/UserScript==

/*
 * Configurations
 */
window.TCR_config = {
    staticURL: 'https://api.021121.xyz/TCR/static',
    backendURL: ''
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


    /*
     * Main function
     */
    function remake() {
        console.log('Remake!');
        document.querySelector('html').parentNode.removeChild(document.querySelector('html')); // To rewrite the whole page
        switch (shared.pageOptions.fileType) {
            case 'Video':
                console.log('Video mode.');
                document.write(HTMLCache.video);
                break;

            default:
                break;
        }
    }

})();