const TCR_pageID = md5(shared.pageOptions.repoID + shared.pageOptions.filePath).toUpperCase();

document.querySelector('.TCR-title').textContent = shared.pageOptions.fileName
    .replace('.' + shared.pageOptions.fileExt, '');

document.querySelector('.TCR-download-button').setAttribute('href', shared.pageOptions.rawPath);
document.querySelector('.TCR-download-button').setAttribute('download', shared.pageOptions.fileName);

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

document.querySelector('main .TCR-player .dplayer-menu .dplayer-menu-item:nth-last-child(2)').remove()

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