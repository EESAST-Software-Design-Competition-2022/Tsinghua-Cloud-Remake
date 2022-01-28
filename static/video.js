const TCR_pageID = md5(shared.pageOptions.repoID + shared.pageOptions.filePath).toUpperCase();

/*
 * Rendering header
 */
(() => {
    document.querySelector('.TCR-title').textContent = shared.pageOptions.fileName
        .replace('.' + shared.pageOptions.fileExt, '');

    document.querySelector('.TCR-download-button').setAttribute('href', shared.pageOptions.rawPath);
    document.querySelector('.TCR-download-button').setAttribute('download', shared.pageOptions.fileName);
});


/*
 * Rendering player
 */
const player = new DPlayer({
    container: document.querySelector('.TCR-player'),
    screenshot: true,
    video: {
        url: shared.pageOptions.rawPath
    },
    danmaku: {
        id: TCR_pageID,
        token: "",
        api: TCR_config.backendURL + '/danmaku/',
        user: "default"
    },
    contextmenu: [
        {
            text: 'TsinghuaCloudRemake',
            link: 'https://gitee.com/Futrime/tsinghua-cloud-remake'
        }
    ]
});

document.querySelector('.TCR-player .dplayer-menu .dplayer-menu-item:nth-last-child(2)').remove()


/*
 * Rendering comments
 */
const comments = new Valine({
    el: '.TCR-comments',
    appId: 'ocjPj9BOoMaS2kI9S29TiQC3-MdYXbMMI',
    appKey: 'QffyyBLYGUOWqHXFzyyv4WCo',
    placeholder: '请写下你的评论',
    path: TCR_pageID,
    avatar: 'retro',
    meta: ['nick', 'mail'],
    lang: navigator.language,
    recordIP: true,
    serverURLs: 'https://ocjpj9bo.api.lncldglobal.com'
});


/*
 * Rendering history bar
 */
(() => {
    // Capture and store screenshots for history bar
    document.querySelector('.TCR-player video').addEventListener('pause', (event) => {
        const video = document.querySelector('.TCR-player video');
        const canvas = document.createElement('canvas');
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL();
        localStorage.setItem('thumbnail:' + TCR_pageID, dataURL);
    });
    const history_bar = document.querySelector('.TCR-history');
    let metadata = JSON.parse(localStorage.getItem('TCR_history_metadata'));
    if (metadata === null) {
        metadata = [];
    }
    const history_item_template = document.querySelector('.TCR-history .card[hidden]');
    for (const x of metadata) {
        if (x.id === TCR_pageID) {
            metadata.splice(metadata.indexOf(x), 1);
            continue;
        }
        const node = history_item_template.cloneNode(true);
        history_bar.append(node);
        if (localStorage.getItem('thumbnail:' + x.id) !== null) {
            node.querySelector('img').setAttribute('src', localStorage.getItem('thumbnail:' + x.id));
        }
        node.querySelector('a').setAttribute('href', x.url);
        const title = (x.title.length <= 22)? x.title : (x.title.substring(0, 20) + '……');
        node.querySelector('.card-title').textContent = title;
        const date_str = (new Date(x.timestamp)).toLocaleDateString();
        node.querySelector('.card-text small').textContent = date_str + ' | ' + x.sharer;
        node.removeAttribute('hidden');
    }
    let current_meta = {
        id: TCR_pageID,
        url: location.href,
        title: shared.pageOptions.fileName.replace('.' + shared.pageOptions.fileExt, ''),
        timestamp: Date.now(),
        sharer: shared.pageOptions.sharedBy
    };
    metadata.unshift(current_meta);
    localStorage.setItem('TCR_history_metadata', JSON.stringify(metadata));
})();
