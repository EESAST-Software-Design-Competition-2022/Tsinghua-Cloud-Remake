/**
 *    Copyright (c) 2022 Futrime
 *    清华大学云盘 Remake is licensed under Mulan PSL v2.
 *    You can use this software according to the terms and conditions of the Mulan PSL v2. 
 *    You may obtain a copy of Mulan PSL v2 at:
 *                http://license.coscl.org.cn/MulanPSL2 
 *    THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.  
 *    See the Mulan PSL v2 for more details.  
 */

const pageID = md5(shared.pageOptions.repoID + shared.pageOptions.filePath).toUpperCase(); // Unique ID for each file
const pathID = md5(shared.pageOptions.repoID + shared.pageOptions.filePath.slice(0, -shared.pageOptions.fileName.length)).toUpperCase(); // Unique ID for each folder

/*
 * Head, Icon and Header
 */
const fileRealName = shared.pageOptions.fileName.slice(0, -(shared.pageOptions.fileExt.length + 1));
document.querySelector('title').textContent = fileRealName + ' - 清华大学云盘 Remake'
document.querySelector('header .tcr-logo').setAttribute('src', config.staticURL + '/img/logo.png')
document.querySelector('header .tcr-avatar').setAttribute('src', app.config.avatarURL);

document.querySelector('header .tcr-history-button').addEventListener('click', () => {
    const el = document.querySelector('.tcr-history');
    const toast = new bootstrap.Toast(el);
    toast.show();
});

/*
 * Title and Subtitle
 */
document.querySelector('.tcr-title').textContent = fileRealName;

/*
 * Player
 */
const player = new window.NPlayer.Player({
    bpControls: {},
    contextMenus: [],
    contextMenuToggle: false,
    controls: [
        ['play', 'time', 'danmaku-send', 'danmaku-settings', 'airplay', 'volume', 'settings', 'web-fullscreen', 'fullscreen'],
        ['progress']
    ],
    i18n: 'zh-CN',
    settings: ['loop', 'pip', 'speed'],
    src: shared.pageOptions.rawPath,
    themeColor: 'rgba(0, 0, 0, 0.3)',
    volumeVertical: true,
    plugins: [
        new NPlayerDanmaku({
            autoInsert: false
        })
    ]
});
if (app.pageOptions.username === '') { // if not signed in, disable danmaku sending
    player.updateControlItems(['play', 'time', 'spacer', 'danmaku-settings', 'airplay', 'volume', 'settings', 'web-fullscreen', 'fullscreen']);
}
player.mount('.tcr-player');

fetch(config.backendURL + '/danmaku/?vid=' + pageID)
    .then(res => res.json())
    .then(res => {
        player.danmaku.resetItems(res);
        document.querySelector('.tcr-subtitle>.tcr-danmaku-count').textContent = res.length;
        document.querySelector('.tcr-danmaku-list .tcr-list>.tcr-unit').setAttribute('hidden', '');
        res.sort((a, b) => (a.time - b.time));
        for (const danmaku of res) {
            const el = document.querySelector('.tcr-danmaku-list .tcr-list>.tcr-unit').cloneNode(true);
            el.querySelector('.tcr-time').textContent = `${Math.floor(danmaku.time / 60).toString().padStart(2, '0')}:${Math.floor(danmaku.time % 60).toString().padStart(2, '0')}`;
            el.querySelector('.tcr-text').textContent = danmaku.text;
            el.querySelector('.tcr-author').textContent = danmaku.author;
            el.removeAttribute('hidden');
            document.querySelector('.tcr-danmaku-list .tcr-list').append(el);
        }
    }); // Load danmakus

// Listen on DanmakuSend event
player.on('DanmakuSend', opts => {
    const requestBody = {
        author: app.pageOptions.name,
        color: opts.color,
        text: opts.text,
        time: opts.time,
        type: opts.type,
        metadata: JSON.stringify({
            email: app.pageOptions.contactEmail,
            send_time: (new Date()).getTime()
        }, null, 0)
    };
    fetch(config.backendURL + '/danmaku/?vid=' + pageID, {
        method: 'POST',
        body: JSON.stringify(requestBody, null, 0)
    });
});

/*
 * Toolbar
 */
document.querySelector('.tcr-toolbar>.tcr-download-button').setAttribute('href', shared.pageOptions.rawPath);
document.querySelector('.tcr-toolbar>.tcr-download-button').setAttribute('download', shared.pageOptions.fileName);

/*
 * Comments
 */
const comments = new Valine({
    el: '.tcr-comments',
    appId: 'ocjPj9BOoMaS2kI9S29TiQC3-MdYXbMMI',
    appKey: 'QffyyBLYGUOWqHXFzyyv4WCo',
    placeholder: '发一条友善的评论',
    path: pageID,
    avatar: 'retro',
    meta: ['nick', 'mail'],
    lang: 'zh-CN',
    recordIP: true,
    serverURLs: 'https://ocjpj9bo.api.lncldglobal.com'
});

/*
 * Publisher Info
 */
document.querySelector('.tcr-publisher-info .tcr-name').textContent = '未知用户';

/*
 * History
 */
(() => {
    document.querySelector('.tcr-player video').addEventListener('pause', (event) => {
        const video = document.querySelector('.tcr-player video');
        const canvas = document.createElement('canvas');
        canvas.height = video.videoHeight / 16; // Resize to 1/16 to reduce the size of images
        canvas.width = video.videoWidth / 16;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/jpeg');
        localStorage.setItem('thumbnail:' + pageID, dataURL); // Store the image via StorageAPI
    }); // Capture and store screenshots for history bar when paused

    const historyListEl = document.querySelector('.tcr-history>.tcr-list');
    let metadata = JSON.parse(localStorage.getItem('history_metadata'));
    if (metadata === null) {
        metadata = [];
    }
    const history_item_template = document.querySelector('.tcr-history>.tcr-list>.tcr-unit');
    let metadata_clone = metadata.slice();
    for (const x of metadata_clone) {
        if (x.id === pageID) {
            metadata.splice(metadata.indexOf(x), 1); // Remove metadata of current page
            continue;
        }
        const node = history_item_template.cloneNode(true);
        if (localStorage.getItem('thumbnail:' + x.id) !== null) {
            node.querySelector('img').setAttribute('src', localStorage.getItem('thumbnail:' + x.id));
        }
        node.querySelector('a').setAttribute('href', x.url);
        const title = (x.title.length <= 22) ? x.title : (x.title.substring(0, 20) + '……');
        node.querySelector('.tcr-name').textContent = title;
        const date_str = (new Date(x.timestamp)).toLocaleString('zh-CN', {
            dateStyle: "long",
            timeStyle: "short",
            hour12: false
        });
        node.querySelector('.tcr-date').textContent = ' ' + date_str;
        node.querySelector('.tcr-publisher').textContent = ' ' + x.sharer;
        node.removeAttribute('hidden');
        historyListEl.append(node);
    }
    let current_meta = {
        id: pageID,
        url: location.href,
        title: shared.pageOptions.fileName.slice(0, -(shared.pageOptions.fileExt.length + 1)),
        timestamp: Date.now(),
        sharer: shared.pageOptions.sharedBy
    };
    metadata.unshift(current_meta);
    metadata.sort((a, b) => (b.timestamp - a.timestamp));
    localStorage.setItem('history_metadata', JSON.stringify(metadata));
})();
