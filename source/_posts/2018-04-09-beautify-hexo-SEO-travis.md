---
title: Hexo 博客美化、SEO优化、Travis CI 自动化持续集成构建
date: 2018-04-09 07:55:14
categories: 
  - 折腾
  - Hexo 博客
tags: 
- hexo 
- github 
- gitlab
---

**欢迎 Fork [我的博客@GitHub](https://github.com/upupming/upupming.github.io/tree/source)**。

这阵子我把 hexo 博客新换了一个主题 [melody][1]，主要就是为了让博客更加美观、简洁。换好主题之后发现有好多可以继续提升的地方，主要包括图标美化、 SEO 优化、自动构建这三个方面。

<!-- more -->
## 美化

无意中看到 melody 开发者 [MARKSZ][2] 的一篇文章<sup>[3]</sup>，发现了 PWA(Progressive Web Apps) ，melody 已经添加了支持。

根据谷歌官方文档<sup>[4]</sup>， Web App Install Banners 的出现要满足 4 个条件：
+ [manifest 文件][5]
+ [service worker][6]
+ 网站使用 HTTPS 
+ 网站符合Chrome 定义的其他一些条件（可以忽略）

### Manifest

melody 主题与 manifest 相关的源代码位于主题`layout/includes/head.pug`中：
```pug
if (theme.pwa && theme.pwa.enable)
  link(rel="manifest" href=theme.pwa.manifest)
```
这段代码会使每个页面的`<head>`部分都加入 manifest 的声明，只需要在博客`/source/_data/melody.yml`中设置：
```yml
pwa:
    manifest: /path/to/manifest.json
```
然后将自己生成的 manifest.json 放入博客`/source/path/to/manifest.json`或者 melody 主题的`source/path/to/manifest.json`中就行了，我是直接放入了`/source`下。

生成 manifest.json 推荐到[Favicon Generator. For real.][7]，选择一张图片作为自己的 logo 就可以开始制作，接下来可以自定义在各个平台下图标的大小、颜色等属性。

<hr>2018.10.19 更新

生成图标还可以到 [Website Planet 网页图标生成器](https://www.websiteplanet.com/zh-hans/webtools/favicon-generator/)，该网站支持多种语言，生成的图标支持多种平台，尺寸。

致谢：名为 Miriam 的网友
<hr>

<img src="custom-fav.png">

上图是我针对 Android Chrome 的设置，其他的平台也是类似，生成之后将其下载下来，网站上建议做法是将解压后的文件放在网站根目录，并在`<head>`部分加入这些代码：
```html
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#87699b">
<meta name="msapplication-TileColor" content="#87699b">
<meta name="theme-color" content="#87699b">
```
文件放在`/source`或者 melody 的 `source`目录下均可。插入这段代码则要修改一下 melody 的代码，melody 默认只支持`rel="manifest"`这一项，这是用来生成 PWA 的，为了使用其他功能，我把`layout/includes/head.pug`修改了一下：
```pug
if (theme.favicon_package && theme.favicon_package.enable)
  link(rel="apple-touch-icon" sizes="180x180" href=theme.favicon_package.apple_touch_icon)
  link(rel="icon" type="image/png" sizes="32x32" href=theme.favicon_package.favicon_32_32)
  link(rel="icon" type="image/png" sizes="16x16" href=theme.favicon_package.favicon_16_16)
  link(rel="manifest" href=theme.favicon_package.manifest)
  link(rel="mask-icon" href=theme.favicon_package.mask_icon color=theme.favicon_package.theme_color)
  meta(name="msapplication-TileColor" content=theme.favicon_package.theme_color)
  meta(name="theme-color" content=theme.favicon_package.theme_color)
```

并在 molody.yml 中配置这些路径，我把下载下来的`site.webmanifest`顺便改名成了`manifest.json`。
```yml
favicon_package: 
  enable: true
  apple_touch_icon: /apple-touch-icon.png
  favicon_32_32: /favicon-32x32.png
  favicon_16_16: /favicon-16x16.png
  manifest: /manifest.json
  mask_icon: /safari-pinned-tab.svg
  theme_color: "#87699b"
```

### Service worker

melody 推荐的是使用 [`hexo-offline`][8] 插件生成 service worker 来支持离线浏览我们的静态博客，安装非常简单。
```bash
$ npm i hexo-offline --save
```

然后`hexo clean && hexo generate; hexo d`更新博客。

### 测试

首先到[Favicon checker](https://realfavicongenerator.net/favicon_checker)，测试一下前面的配置是否成功。

<img src="fav-checker.png">

在电脑 Chrome 上按`F12`，进入开发者模式，选择`Applications`，点击`Add to homescreen`

<img src="add-to-home.png">

然后在 chrome 地址栏输入`chrome://apps`就可以看到自己的 PWA 啦。

<img src="chrome-app.png">

接下来测试一下安卓 Chrome，进入自己博客可以发现地址栏非常漂亮啊，点击`ADD TO HOME SCREEN`更是可以生成 PWA ，打开 PWA 时界面也挺好，跟微信小程序特别像。

|<img src="android-chrome.jpg" align="center" width="200">|<img src="android-pwa.jpg" align="center" width="200">|
|-|-|
|||




## SEO 优化

SEO(Search Engine Optimization) 优化主要就是让谷歌、百度及时抓取博客内容，让我们的博客更容易被别人找到。

### Google 

先安装一下`hexo-generator-sitemap`。
```bash
$ npm install hexo-generator-sitemap --save
```
```yml
# Sitemap
sitemap:
  path: sitemap.xml
```
谷歌搜索`site:yourblog.com`，博客没有被收录的时候只能看到一项 Try Google Search Console，点进去之后点击红色的`ADD A PROPERTY`添加自己的博客，接下来需要验证，可以选择下载 html 文件并放入到站点根目录进行验证。

验证好后提交一下自己网站的 sitemap ，比如上面的设置的话就是生成的`yourblog.com/sitemap.xml`，提交好后只需几个小时，谷歌就会抓取你的网页啦。

### 百度

根据历史资料<sup>[9]</sup>，2015年3月26日，托管在 Github pages 上的 GreatFire 和纽约时报镜像曾遭来自百度的 DDoS(distributed denial-of-service) 攻击，原因是中国内网和互联网边界的某个设备劫持了进入中国的 HTTP 连接，将一些来自百度的 JavaScript 文件替换为恶意文件，但是百度否认自身存在安全隐患，也否认参与攻击。
<img src="GitHub-System-Status-2015.png">
从这张图片可以看出当时状况多么糟，github 只有选择屏蔽百度来解决这个问题，而且这个屏蔽措施至今都没有解除(官方说可能会一直持续）。这也为我们博客被百度抓取提供了障碍（不过确实可以锻炼我们的能力哈）。

从我初步查询的资料看来，解决方法有以下几种：

1. 用 [Coding](https://coding.net)、[gitlab](gitlab.com) 等托管一份博客备份，使用 [DNSPOD](https://www.dnspod.com) 根据用户 IP 进行流量分发。

    由于在性能方面，还是更倾向于 Cloudflare 的 DNS 解析服务，不使用这种方案。

2. 使用 CDN 加速服务，缓存站点信息，这样百度就可以正常抓取来自 CDN 的信息。

    看了一下国内的 CDN 服务，比如[知道创宇](https://www.knownsec.com/)、[又拍云](https://www.upyun.com/)，都需要实名验证、域名备案，感觉特别麻烦，毕竟不是大型网站。经测试 Cloudflare 的 caching 功能也不能解决这个问题。
    
最终还是选择在 gitlab 上托管一份博客备份，使用多个 A 记录，根据 cloudflare 的[官方文档][10]，这样用户访问网站时，解析到每个 IP 的可能性是均等的，那么百度爬取的时候，理论上成功率为 50% （ DNS 解析到 gitlab）。

> A DNS server with round-robin enabled will have multiple different A records, each with the same domain name but a different IP address. Each time the DNS server is queried, it sends the IP address to which it most recently responded with to the back of the queue, operating on a loop. The IP addresses in a round-robin DNS server are like baseball players in a batting lineup: each one gets a turn and then is moved to the back of the line.

我选择了 gitlab 来托管网站，跟 github 类似，创建一个`username.gitlab.io`仓库，根据[官方文档][11]，在 **Settings -> Pages** 中添加域名`blog.upupming.site`，需要通过 TXT 认证域名所有权，在 cloudflare 设置　gitlab 给出的 TXT 就可以验证成功；然后将自己的域名解析到 gitlab 给出的 IP `52.167.214.135`。每次更新博客要同时将自己的仓库 push 到两个仓库还是挺麻烦的，但是gitlab 有自己的持续集成系统 GitLab CI，只需要在根目录新建`.gitlab-ci.yml`，加入构建指令即可自动构建。我将在下一部分详细讲解。

<img src="A-records.png">

<hr>**2018.06.05 更新**

为了安全，还要给自定义域名加入 https。GitHub 从 5 月份开始支持自定义域名自动加入 https，可以参考[这篇博文](../../../../2018/05/10/cloudflare-subdomain-SSL/)。GitLab 的配置方法需要获取并上传 SSL 证书，可以参见[这篇文章](https://about.gitlab.com/2017/02/07/setting-up-gitlab-pages-with-cloudflare-certificates/)，即将根域名添加 A 记录到 gitlab 的 IP，`blog` 二级域名添加 CNAME 到 `upupming.gitlab.io`，再上传 Cloudflare 生成的证书。


<hr>

百度提供了[主动提交](https://ziyuan.baidu.com/linksubmit/index)功能，hexo 博客可安装插件[Hexo Baidu URL Submit][12]来主动提交链接。
```bash
npm install hexo-baidu-url-submit --save
```
在`_config.yml`加入：
```yml
baidu_url_submit:
  count: 15 ## 提交最新的15个链接
  host: https://blog.upupming.site ## 在百度站长平台中注册的域名
  token: bQVdGZWTP16533e ## 请注意这是您的秘钥， 所以请不要把博客源代码发布在公众仓库里!我这儿是篡改过的
  path: baidu_urls.txt ## 文本文档的地址， 新链接会保存在此文本文档里
  
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
- type: git
  repo: repo-url
  branch: master
- type: baidu_url_submitter ## 这是新加的
```

另外还可以用[`hexo-generator-baidu-sitemap`][13]生成一下站点地图。
```bash
npm install hexo-generator-baidu-sitemap@0.1.1 --save
```
在`_config.yml`加入：
```yml
baidusitemap:
path: baidusitemap.xml
```

## Travis CI 自动化持续集成构建

<hr> **2018.06.27 更新**
为了提高成功率，我把 blog 只指向 GitLab 仓库，现在成功率算是提到 100% 了。

<img src=baidu-100.png>

现在的状态是这样：

+ https://upupming.site

  托管在 GitHub 仓库 https://github.com/upupming/upupming.github.io 上，包含源代码。

+ https://blog.upupming.site

  托管在 GitLab 仓库 https://gitlab.com/upupming/upupming.gitlab.io 上。我是把 `blog` 指向 GitHub 的 A 记录给删除了，转而使用 CNAME 单独解析到 GitLab 仓库，这样就不会解析到 GitHub 了。

<figure class=not-code>
<img src=@-dns.png>
<img src=blog-dns.png>
<caption>现在所有的 DNS 配置</caption>
</figure>

<hr>


现在同时有 github、gitlab 两个仓库需要管理，每次 push 比较麻烦，使用 Travis CI 可以解决这个问题。

<img src="git-page-ci.png">

这幅图就是整体上的思路，平时更新博客后只需 push source 分支到 github 仓库，就能完成所有的更新。gitlab 仓库必须要在 Settings > Repository > Protected Branches 中删除 master 分支保护，否则后续无法 push ，还要在 Settings > CI / CD > Runners Settings 中 Enable shared runners，否则无法触发自动构建。

首先得执行`git checkout -b sorce`新建 source 分支，后续在本地只需要操作 source 分支。写好 Travis CI 指令`.travis.yml`:
```yml
language: node_js # 声明环境为node
node_js: stable

# sudo: required

# Travis-CI Caching
cache:
  directories:
    - node_modules # 缓存node_modules文件夹

# S: Build Lifecycle
install:
  - npm install # 下载依赖

before_script:


script: 
  ## 配置好全局 git 用户信息
  - git config --global user.name "upupming"
  - git config --global user.email "upupming@gmail.com"

  # 1. push 到 upupming 仓库 
  ## 将 _config.yml 中的字符串 "repo-url" 
  ## 替换为 "https://${GH_TOKEN}@github.com/upupming/upupming.github.io.git" 
  ## 使 Travis 服务器能顺利运行 hexo d 将 master 分支 push 到 github
  - sed -i'' "s~repo-url~https://${GH_TOKEN}@github.com/upupming/upupming.github.io~" _config.yml 

  ## 清除缓存、生成并在 Algolia 中索引、生成 service-worker.js
  - hexo clean && hexo algolia && hexo g 
  ## 此过程包含了像百度直接提交链接的过程
  - hexo d 

  ## 之前 travis 会新建一个分支，这里需要切换回 source 分支，以免出现
  ## HEAD detached at 8d636e5 错误
  - git checkout source

  ## 替换 upupming.site 为 blog.upupming.site，用于后续向百度提交链接、生成 sitemap
  - sed -i'' "s~upupming.site~blog.upupming.site~" _config.yml 
  - git add .
  - git commit -m "Changed @ to blog"
  # 2. push soure 分支至 gitlab 仓库 master 分支  
  - git push --force "https://gitlab-ci-token:${GL_TOKEN}@gitlab.com/upupming/upupming.gitlab.io.git" source:master 

branches:
  only:
    - source # 只对 source 分支构建
env: # 环境变量
 global:
   - GL_REF: gitlab.com/upupming/upupming.gitlab.io.git # gitlab 仓库地址
   - GH_REF: github.com/upupming/upupming.github.io.git # github 仓库地址

```

这里的 GL_TOKEN、GH_TOKEN 是 gitlab、github 的授权秘钥，它们的申请方法差不多。

登录 https://gitlab.com/profile/personal_access_tokens ，勾选 **api**，生成一个 Personal Access Token，将其复制下来存好。

登录 https://github.com/settings/tokens ，照样生成一个有对仓库进行写权限的 token ，将其复制下来存好。

登录 https://travis-ci.org/ ，打开仓库构建开关，在 Setting 中将两个 token 加入全局环境变量中。
<img src="travis-setting.png">

gitlab pages 构建方式不同于 github pages，必须依靠`.gitlab-ci.yml`文件告诉 gitlab 如何生成网站资源，只需直接 push 源代码即可。写一下 gitlab 要用到的 `.gitlab-ci.yml`文件<sup>[14]</sup>。
```yml
# gitlab 部署方式不同于 github ，必须要靠
# 此文件指引服务端如何生成静态文件
# Full project: https://gitlab.com/pages/hexo

image: node:6.10.0

pages:
  script:
  - npm install
  - ./node_modules/hexo/bin/hexo clean && ./node_modules/hexo/bin/hexo algolia && ./node_modules/hexo/bin/hexo generate
  artifacts:
    paths:
    - public
  cache:
    paths:
      - node_modules
    key: project
  only:
  - master

```

然后提交一个 commit，执行`git push`，就会自动构建了。

<hr>**2018.06.22 更新**

这里附上我的一个 Linux 下的小脚本 `deploy.sh`，更加方便部署。

```bash
#!/bin/bash

git add .

if [ "$#" -eq 0 ]; then
    git commit -m "Updated: blog source"
else 
    git commit -m "$1"
fi

git push
```

先使用 `chmod +x deploy.sh` 加上可执行权限，然后每次直接 `./deploy.sh -m "your commit message here"` 就可以更新博客源代码至 GitHub 了。
<hr>


gitlab 构建成功。
<img src="gitlab-succeed.png">

最后放上博客部署的全过程。

1. 本地 push 至 github
    ```bash
    Counting objects: 41, done.
    Delta compression using up to 4 threads.
    Compressing objects: 100% (41/41), done.
    Writing objects: 100% (41/41), 903.68 KiB | 8.77 MiB/s, done.
    Total 41 (delta 29), reused 0 (delta 0)
    remote: Resolving deltas: 100% (29/29), completed with 7 local objects.
    To github.com:upupming/upupming.github.io.git
       07143ba..4b722ef  source -> source
    ```

2.  Travis CI push 至 gitlab，构建后 push 至 github
    ```bash
    ...
    The command "git config user.email "upupming@gmail.com"" exited with 0.
    $ git config http.postBuffer 524288000
    The command "git config http.postBuffer 524288000" exited with 0.
    $ git push --force --quiet "https://gitlab-ci-token:*****************@gitlab.com/upupming/upupming.gitlab.io.git" source:master
    ...
    The command "hexo clean" exited with 0.
    The command "hexo algolia" exited with 0.
    $ sed -i'' "s~git@github.com:upupming/upupming.github.io~https://${GH_TOKEN}@github.com/upupming/upupming.github.io~" _config.yml
    $ hexo d
    ...
    To https://github.com/upupming/upupming.github.io.git
     + 383f0f3...0f589eb HEAD -> master (forced update)
    Branch 'master' set up to track remote branch 'master' from 'https://*****************************@github.com/upupming/upupming.github.io.git'.
    INFO  Deploy done: git
    INFO  Deploying: baidu_url_submitter
    INFO  Submitting urls 
    https://blog.upupming.site/2018/04/03/gradle-travis/
    https://blog.upupming.site/2018/03/26/java-equals-type-safety/
    https://blog.upupming.site/2018/03/12/the-nature-of-research/
    https://blog.upupming.site/2018/03/05/blurring-disciplinary-boundaries/
    https://blog.upupming.site/2018/02/28/build-hexo/
    ```

3. gitlab 收到 push 后自动构建
    ```bash
    Creating cache project...
    node_modules: found 16309 matching files           
    Uploading cache.zip to http://runners-cache-5-internal.gitlab.com:444/runner/project/6003762/project 
    Created cache
    Uploading artifacts...
    public: found 153 matching files                   
    Uploading artifacts to coordinator... ok            id=61830841 responseStatus=201 Created token=6Ps9JcT6
    Job succeeded
    ```


## 参考资料

1. [GitHub - Molunerfinn/hexo-theme-melody: A simple & beautiful & fast theme for Hexo.][1]
2. [Do what you love,Love what you do | MARKSZのBlog][2]
3. [用新版的Chrome把PWA网站添加到桌面，获得媲美原生应用的体验 | MARKSZのBlog][3]
4. [Web App Install Banners  |  Web Fundamentals       |  Google Developers][4]
5. [The Web App Manifest  |  Web Fundamentals       |  Google Developers][5]
6. [Service Workers: an Introduction  |  Web Fundamentals       |  Google Developers][6]
7. [Favicon Generator for all platforms: iOS, Android, PC/Mac...][7]
8. [GitHub - JLHwung/hexo-offline: Out-of-the-box hexo offline experience][8]
9. [Last night, GitHub was hit with massive denial-of-service attack from China - The Verge][9]
10. [Round-Robin DNS | Cloudflare][10]
11. [GitLab Pages | GitLab][11]
12. [GitHub - huiwang/hexo-baidu-url-submit: 主动推送Hexo博客新链接至百度搜索引擎，解决百度爬虫被禁止访问的问题，提升网站收录质量和速度。][12]
13. [GitHub - coneycode/hexo-generator-baidu-sitemap: Baidu Sitemap generator plugin for Hexo][13]
14. [ Hosting on GitLab.com with GitLab Pages | GitLab ][14]

<!-- ref -->
[1]: https://github.com/Molunerfinn/hexo-theme-melody/
[2]: https://molunerfinn.com/
[3]: https://molunerfinn.com/PC-Chrome-PWA/
[4]: https://developers.google.com/web/fundamentals/app-install-banners/
[5]: https://developers.google.com/web/fundamentals/web-app-manifest/
[6]: https://developers.google.com/web/fundamentals/getting-started/primers/service-workers
[7]: https://realfavicongenerator.net/
[8]: https://github.com/JLHwung/hexo-offline
[9]: https://www.theverge.com/2015/3/27/8299555/github-china-ddos-censorship-great-firewall
[10]: https://www.cloudflare.com/learning/dns/glossary/round-robin-dns/
[11]: https://docs.gitlab.com/ce/user/project/pages/
[12]: https://github.com/huiwang/hexo-baidu-url-submit
[13]: https://github.com/coneycode/hexo-generator-baidu-sitemap
[14]: https://about.gitlab.com/2016/04/07/gitlab-pages-setup/#add-gitlab-ci
<!-- endref -->
