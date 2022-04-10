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
let videoInfo = {};
let userInfo = {};
let publisherInfo = {};

/**
 * Update activity menu
 */
async function updateActivity() {
    let activityVideos = [];
    let followedInfo = {};
    for (const x of userInfo['following']) {
        let videos = await (await fetch(config.backendURL + '/library/', {
            method: 'POST',
            body: JSON.stringify({
                action: 'getFileInfo',
                publisher: x,
                type: 'video'
            }, null, 0)
        })).json();
        if (videos == false) { // if this user hasn't published any video
            continue;
        }
        activityVideos = activityVideos.concat(videos);
    }
    activityVideos.sort((a, b) => (b['time'] - a['time'])); // newer first
    for (const x of userInfo['following']) {
        let info = await (await fetch(config.backendURL + '/user/?username=' + x)).json();
        followedInfo[x] = info;
    }

    const template = document.querySelector('.tcr-activity>.tcr-list>.tcr-unit');
    for (let i = 0; i < activityVideos.length; i++) {
        const x = activityVideos[i];
        const el = template.cloneNode(true);
        el.querySelector('img').setAttribute('src', followedInfo[x['publisher']]['avatar_url']);
        el.querySelector('.tcr-publisher').textContent = followedInfo[x['publisher']]['name'];
        el.querySelector('.tcr-name').textContent = x['brief'];
        el.querySelector('.tcr-time').textContent = (new Date(x['time'] * 1000)).toLocaleString('zh-CN');
        el.querySelector('a').setAttribute('href', x['url']);
        if (i !== 0) {
            el.classList.add('border-top');
        }
        el.removeAttribute('hidden');
        document.querySelector('.tcr-activity>.tcr-list').append(el);
    }
};

/*
 * Initialization
 */
(async () => {
    // Load information
    videoInfo = await (await fetch(config.backendURL + '/library/', {
        method: 'POST',
        body: JSON.stringify({
            action: 'getFileInfo',
            fid: pageID,
            type: 'video'
        }, null, 0)
    })).json();

    if (videoInfo === false) { // if the video is not recorded in remote library
        document.querySelector('header .tcr-publish-button').removeAttribute('hidden');
        document.querySelector('.tcr-publisher-info .tcr-name').textContent = shared.pageOptions.sharedBy + '（资料库）';
        return;
    }
    videoInfo = videoInfo[0]; // Only need information of current video

    if (app.pageOptions.username !== '') {
        fetch(config.backendURL + '/user/', {
            method: 'POST',
            body: JSON.stringify({
                action: 'updateUserInfo',
                username: app.pageOptions.username,
                name: app.pageOptions.name,
                email: app.pageOptions.contactEmail,
                avatar_url: app.config.avatarURL
            }, null, 0)
        }); // update user information, not need to wait
        userInfo = await (await fetch(config.backendURL + '/user/?username=' + app.pageOptions.username)).json();
    }

    publisherInfo = await (await fetch(config.backendURL + '/user/?username=' + videoInfo.publisher)).json();

    // Update subtitle
    document.querySelector('.tcr-subtitle>.tcr-view-count').textContent = videoInfo['visit_count'];
    document.querySelector('.tcr-subtitle>.tcr-publish-time').textContent = (new Date(videoInfo['time'] * 1000)).toLocaleString('zh-CN');

    // Update toolbar
    document.querySelector('.tcr-toolbar').removeAttribute('hidden');
    document.querySelector('.tcr-toolbar .tcr-like-count').textContent = videoInfo['like_count'];
    document.querySelector('.tcr-toolbar .tcr-collect-count').textContent = videoInfo['collect_count'];
    document.querySelector('.tcr-toolbar .tcr-download-count').textContent = videoInfo['download_count'];

    // Update publisher information
    document.querySelector('.tcr-publisher-info>.tcr-avatar').setAttribute('src', publisherInfo['avatar_url']);

    document.querySelector('.tcr-publisher-info .tcr-name').textContent = publisherInfo['name'];
    document.querySelector('.tcr-publisher-info .tcr-name').classList.replace('link-secondary', 'link-primary');

    document.querySelector('.tcr-publisher-info .tcr-email-button').setAttribute('href', 'mailto:' + publisherInfo.email);
    document.querySelector('.tcr-publisher-info .tcr-email-button').removeAttribute('hidden');

    document.querySelector('.tcr-publisher-info .tcr-subscribe-button-disabled').setAttribute('hidden', '');
    if (userInfo['following'].indexOf(publisherInfo['username']) === -1) { // if not subscribed
        document.querySelector('.tcr-publisher-info .tcr-subscribe-button').removeAttribute('hidden');
    } else {
        document.querySelector('.tcr-publisher-info .tcr-subscribe-button-subscribed').removeAttribute('hidden');
    }

    for (const x of document.querySelectorAll('.tcr-publisher-info .tcr-subscribe-count')) {
        x.textContent = publisherInfo['followed_count'];
    }

    // Update activity asynchronously
    updateActivity();
})();

/*
 * Head, Icon and Header
 */
const fileRealName = shared.pageOptions.fileName.slice(0, -(shared.pageOptions.fileExt.length + 1));
document.querySelector('title').textContent = fileRealName + ' - 清华大学云盘 Remake'
document.querySelector('header .tcr-logo').setAttribute('src', config.staticURL + '/img/logo.png')
document.querySelector('header .tcr-avatar').setAttribute('src', app.config.avatarURL);

document.querySelector('header .tcr-activity-button').addEventListener('click', () => {
    const el = document.querySelector('.tcr-activity');
    const toast = new bootstrap.Toast(el);
    toast.show();
}); // Show activity menu

document.querySelector('header .tcr-history-button').addEventListener('click', () => {
    const el = document.querySelector('.tcr-history');
    const toast = new bootstrap.Toast(el);
    toast.show();
}); // Show history menu

document.querySelector('header .tcr-publish-button').addEventListener('click', async () => {
    const spinner = document.createElement('span');
    spinner.classList.add('spinner-border');
    spinner.classList.add('spinner-border-sm');
    spinner.classList.add('ms-1');
    document.querySelector('header .tcr-publish-button').append(spinner);
    const videoInfo = await (await fetch(config.backendURL + '/library/', {
        method: 'POST',
        body: JSON.stringify({
            action: 'getFileInfo',
            fid: pageID,
            type: 'video'
        }, null, 0)
    })).json();
    if (videoInfo == false) { // if current video is not in remote library
        await fetch(config.backendURL + '/library/', {
            method: 'POST',
            body: JSON.stringify({
                action: 'shareFile',
                fid: pageID,
                pid: pathID,
                publisher: app.pageOptions.username,
                type: 'video',
                tag: [],
                brief: fileRealName,
                url: location.origin + location.pathname,
                metadata: {}
            }, null, 0)
        })
    }
    location.reload();
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

// Listen on DanmakuSend event
player.on('DanmakuSend', opts => {
    const requestBody = {
        vid: pageID,
        author: app.pageOptions.name,
        color: opts.color,
        text: opts.text,
        time: opts.time,
        type: opts.type,
        metadata: {
            email: app.pageOptions.contactEmail,
            send_time: (new Date()).getTime()
        }
    };
    fetch(config.backendURL + '/danmaku/', {
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
 * Publisher Information
 */
document.querySelector('.tcr-publisher-info .tcr-subscribe-button').addEventListener('click', async () => {
    document.querySelector('.tcr-publisher-info .tcr-subscribe-button').setAttribute('disabled', '');

    userInfo['following'].push(publisherInfo['username']);
    userInfo['following'] = Array.from(new Set(userInfo['following'])); // remove duplicated items

    const spinner = document.createElement('span');
    spinner.classList.add('spinner-border');
    spinner.classList.add('spinner-border-sm');
    spinner.classList.add('ms-1');
    document.querySelector('.tcr-publisher-info .tcr-subscribe-button').append(spinner);

    await fetch(config.backendURL + '/user/', {
        method: 'POST',
        body: JSON.stringify({
            action: 'followUser',
            username: app.pageOptions.username,
            follow: publisherInfo['username'],
            type: 'follow'
        }, null, 0)
    }); // update user information, not need to wait

    publisherInfo['followed_count'] += 1;
    for (const x of document.querySelectorAll('.tcr-publisher-info .tcr-subscribe-count')) {
        x.textContent = publisherInfo['followed_count'];
    }

    spinner.remove();
    document.querySelector('.tcr-publisher-info .tcr-subscribe-button').setAttribute('hidden', '');
    document.querySelector('.tcr-publisher-info .tcr-subscribe-button-subscribed').removeAttribute('hidden');
    document.querySelector('.tcr-publisher-info .tcr-subscribe-button').removeAttribute('disabled');
});

document.querySelector('.tcr-publisher-info .tcr-subscribe-button-subscribed').addEventListener('click', async () => {
    document.querySelector('.tcr-publisher-info .tcr-subscribe-button-subscribed').setAttribute('disabled', '');

    if (userInfo['following'].indexOf(publisherInfo['username']) !== -1) {
        userInfo['following'].splice(userInfo['following'].indexOf(publisherInfo['username']), 1);
    }

    const spinner = document.createElement('span');
    spinner.classList.add('spinner-border');
    spinner.classList.add('spinner-border-sm');
    spinner.classList.add('ms-1');
    document.querySelector('.tcr-publisher-info .tcr-subscribe-button-subscribed').append(spinner);

    await fetch(config.backendURL + '/user/', {
        method: 'POST',
        body: JSON.stringify({
            action: 'followUser',
            username: app.pageOptions.username,
            follow: publisherInfo['username'],
            type: 'unfollow'
        }, null, 0)
    }); // update user information, not need to wait

    publisherInfo['followed_count'] -= 1;
    for (const x of document.querySelectorAll('.tcr-publisher-info .tcr-subscribe-count')) {
        x.textContent = publisherInfo['followed_count'];
    }

    spinner.remove();
    document.querySelector('.tcr-publisher-info .tcr-subscribe-button').removeAttribute('hidden');
    document.querySelector('.tcr-publisher-info .tcr-subscribe-button-subscribed').setAttribute('hidden', '');
    document.querySelector('.tcr-publisher-info .tcr-subscribe-button-subscribed').removeAttribute('disabled');
});

/*
 * Danmaku List
 */
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

/*
 * Series List
 */
fetch(config.backendURL + '/library/', {
    method: 'POST',
    body: JSON.stringify({
        action: 'getFileInfo',
        pid: pathID,
        type: 'video'
    }, null, 0)
})
    .then(res => res.json())
    .then(res => {
        document.querySelector('.tcr-series-list>.tcr-list>.tcr-unit').setAttribute('hidden', '');
        if (res == false) {
            return;
        }
        res.sort((a, b) => a['brief'].localeCompare(b['brief']));
        const template = document.querySelector('.tcr-series-list>.tcr-list>.tcr-unit');
        for (let i = 0; i < res.length; i++) {
            const el = template.cloneNode(true);
            el.querySelector('.tcr-no').textContent = `P${i + 1}`;
            el.querySelector('.tcr-text').textContent = res[i]['brief'];
            if (res[i]['fid'] === pageID) {
                el.classList.replace('text-dark', 'text-primary');
                el.querySelector('.tcr-status').removeAttribute('hidden');
            }
            el.setAttribute('href', res[i]['url']);
            if (i !== 0) {
                el.classList.add('border-top');
            }
            el.removeAttribute('hidden');
            document.querySelector('.tcr-series-list>.tcr-list').append(el);
        }
    });

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