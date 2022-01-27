document.querySelector('header .TCR-title').textContent = shared.pageOptions.fileName
    .replace('.' + shared.pageOptions.fileExt, '');

document.querySelector('header .TCR-download-button').setAttribute('href', shared.pageOptions.rawPath);
document.querySelector('header .TCR-download-button').setAttribute('download', shared.pageOptions.fileName);

const player = new DPlayer({
    container: document.querySelector('main .TCR-player'),
    screenshot: true,
    video: {
        url: shared.pageOptions.rawPath
    },
    danmaku: {
        id: md5(shared.pageOptions.repoID + shared.pageOptions.filePath).toUpperCase(),
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