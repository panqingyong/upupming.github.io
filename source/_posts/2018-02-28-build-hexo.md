---
title: Hexo配置遇到的问题及解决
date: 2018-02-28 10:10:00
categories: 
  - 折腾
  - Hexo 博客
tags:
  - hexo
  - github
---

我的 hexo 博客 hello world，探索一些小问题。

<!-- more -->

# Hexo安装

安装过程见[Hexo官方文档](https://hexo.io/zh-cn/docs/index.html#Install-Hexo)。

我用的是skapp主题，参见[skapp的README文档](https://github.com/Mrminfive/hexo-theme-skapp/blob/master/README-cn.md)。

# 个性化

通过[Logo Maker](https://logomakr.com/)做好自己的Logo，放入`/themes/hexo-theme-skapp/source/img/`下，这样在后续运行`hexo d`的时候会在网站根目录生成文件夹`/img/`，其中包含了自己的Logo。在`_config.yml`加入绝对引用：

{% codeblock _config.yml lang:yml %}
# 网页图标（显示在浏览器Tab上）
favicon_ico: /img/flying-ming.png
# 网页Logo
logo: /img/flying-ming.png
{% endcodeblock %}
同样可以定义自己的头像、文章默认封面、主页背景、404背景、加载动态图：

{% codeblock _config.yml lang:yml %}
qrcode:  /img/doraemon.jpeg
default_cover: /img/Light-Blue-Wallpaper.jpg
header_cover: /img/Natural-mounty-pools.jpg
error_page_bg: /img/Crying-Doraemon.jpeg
loader_img: /img/loader.gif
{% endcodeblock %}

注意必须用**绝对路径**（即最前面有一个`/`），如`qrcode`值若写成`img/doraemon.jpeg`会导致在归档界面时，头像的路径变成`/archives/img/doraemon.jpeg`，最终头像无法正确加载。

# 文章资源文件夹存放文章封面等图片

首先配置`_config.yml`启用创建文件资源夹，修改post名格式为以创建时间开头：
{% codeblock _config.yml lang:yml %}
post_asset_folder: true
new_post_name: :year-:month-:day-:title.md # File name of new posts
{% endcodeblock %}

新建文章：
{% codeblock lang:bash %}
hexo new build-hexo
{% endcodeblock %}

在`/source/_posts/2018-02-28-build-hexo/`中放入cover.png。

在文章中以**绝对路径**（主页也可以正常显示图片）表示封面目录，如：
{% codeblock 2018-02-28-build-hexo.md lang:markdown %}
---
cover: /2018/02/28/build-hexo/cover.png
---
{% endcodeblock %}

若是文章内图片，无需在主页显示，可直接用相对路径：
例1：
{% codeblock 2018-02-28-build-hexo.md lang:html %}
< !-- 使用html语言，支持调整图片大小 -->
<img src="OAuth-App.png" alt="创建OAuth Application" height="400" >
{% endcodeblock %}
例2：
{% codeblock 2018-02-28-build-hexo.md lang:markdown %}
< !-- 使用Markdown语言，不支持调整图片大小 -->
![创建OAuth Application](OAuth-App.png)
{% endcodeblock %}

# 创建搜索页面

由于主题自带搜索功能，只需创建serach页面：
{% codeblock  %}
hexo new page search
{% endcodeblock %}

然后在`/source/search/index.md`中加入：
{% codeblock  lang=yml %}
layout: search
{% endcodeblock %}



# 安装gitalk评论插件

进入[创建OAuth Application](https://github.com/settings/applications/new)，创建如下：
<img src="OAuth-App.png" alt="创建OAuth Application" height="400" >

后记：如果要自定义域名（见下一步），要将Authorization callback URL更改为相应的域名（如：https://upupming.site/ ）。

编辑`_config.yml`：
{% codeblock _config.yml lang:yml %}
gitTalk:
  clientId: 77bd7cc3fdbcd3e5945a
  clientSecret: 883971da140a8232d72918030f8c1a211a5befc1
  repo: upupming.github.io
  owner: upupming
  admin: 
    - upupming
{% endcodeblock %}

接着运行`hexo d`配置到github，当有人评论时，在仓库`upupming.github.io`中会出现新的issue，名为“Hexo配置遇到的问题及解决 | upupming的博客”。


# 自定义域名，添加https支持（cloudflare）

<hr>2018.06.16 更新

请转到 [GitHub Pages 自定义域名已支持 https，不必再依赖 Cloudflare](../../../../2018/05/10/cloudflare-subdomain-SSL/)
<hr>

在`/source/`下加入文件`CNAME`（在下次`hexo d`时会生成在网站根目录）内容如下：
{% codeblock CNAME %}
upupming.site
{% endcodeblock %}
这样访问`upupming.github.io`时会自动跳转到`upupming.site`。

为了添加https支持，需要将域名的解析系统从阿里云换成cloudflare。

注册[cloudflare](https://www.cloudflare.com/)，添加域名`upupming.site`，登录阿里云，修改域名的NameService为cloudflare的域名解析服务：
{% codeblock %}
aida.ns.cloudflare.com
kai.ns.cloudflare.com
{% endcodeblock %}

待到生效后，设置Crypto中的SSL为Full
<img src="SSL-Full.png"  height="200" >

再添加Page Rules：
<img src="Force-HTTPS.png"  height="400" >

为域名`upupming.site`添加三条解析纪录：

|记录类型|主机记录|记录值|含义
|-|-|-|-|
|CNAME|www|upupming.github.io|将www子域名跳转到顶级域名|
|A|@|192.30.252.153|将顶级域名解析到Github提供的ip|
|A|@|192.30.252.154|将顶级域名解析到Github提供的ip|



