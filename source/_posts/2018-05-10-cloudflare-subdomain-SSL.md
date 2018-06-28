---
title: GitHub Pages 自定义域名已支持 https，不必再依赖 Cloudflare
date: 2018-05-10 12:01:14
tags:
- github
---

2018 年 5 月 1 日 GitHub Blog 宣布增加了 __[Github Pages 对自定义域名的 https 支持][Custom domains on GitHub Pages gain support for HTTPS]__。

<!-- more -->

# Cloudflare One-Click SSL 的缺陷

我的域名 upupmings.site 现由 Cloudflare 提供解析服务，Cloudflare 提供的[一键 https 的功能][Cloudflare-ssl]可以将原来的 http 网站变为加密的 https 网站，证书也是自动更新的。比如 http://upupming.site 会变成 https://upupming.site ，http://blog.upupming.site 会变成 https://blog.upupming.site 。 虽然根域名和一级子域名能起作用，但是二级子域名（例如 www.blog.upupming.site ）[无法被覆盖][subdomain-not-covered]，需要订购付费服务才能添加自定义域名的 Dedicated Certificate。因此我决定转而寻求其他解决方案。

<img src="/2018/05/10/cloudflare-subdomain-SSL/subdomain-not-covered.png" width="500">

# 使用其他 SSL 方案

由于 upupming.site、blog.upupming.site 等很多域名都是使用的 GitHub Pages，而之前 GitHub Pages 自定义域名不支持 https，所以我才使用了 Cloudflare 的域名解析服务来加上 https，参见[这里][secure-and-fast-github-pages-with-cloudflare]。

然而 2018 年 5 月 1 日 GitHub Blog 宣布增加了 __ [Github Pages 对自定义域名的 https 支持][Custom domains on GitHub Pages gain support for HTTPS]__，有兴趣的同学可以尝尝鲜，按照[这里][configuring-a-records-with-your-dns-provider]的说明更新 A 记录，注意一定要删除自定义域名后重新加入。

> If you're updating the IP address of an existing A record, first remove and then re-add your custom domain to the repository you’re using to publish your Pages site to trigger the process of enabling HTTPS. 

加入之后仓库 Pages 设置中会提示：

__Enforce HTTPS__ — Not yet available for your site because the certificate has not finished being issued

这个也不太清楚是为什么，个人感觉应该是 GitHub 那边的问题。我等了一天还是这样就在 git.io/c 发邮件寻求帮助，十分钟左右就解决了。

我的英文太蹩脚就不贴出来了，GitHub 那边的回复如下：
<blockquote>
Hi Li,

Thanks for getting in touch! I took a look at both of your domains and your DNS is set up correctly. I've nudged the process along, and it looks like a certificate has been approved for both!

You should be able to enforce HTTPS from the repository settings page now.

Best regards,
Tiara 
GitHub Support
</blockquote>

解决了 GitHub Pages 的 https 之后，我干脆就不再使用 Cloudflare 提供的 SSL 功能了，对于自己的不使用 GitHub Pages 的二级域名，则可以使用 nginx + Let's Encrypt 加入 https，使用 [301 重定向强制使用 https][301-redirect-and-why-should-you-care]。

# 总结

现在对于 Github Pages，GitHub 那边已经解决了 https 的问题；对于不使用 GitHub Pages 的域名，自行配置即可，不必再依赖 Cloudflare 的 SSL 功能了。

# 外部链接

1. [Cloudflare ssl][Cloudflare-ssl]
2. [Why isn't SSL working for my site][subdomain-not-covered]
3. [Custom domains on GitHub Pages gain support for HTTPS][Custom domains on GitHub Pages gain support for HTTPS]
4. [configuring-a-records-with-your-dns-provider][configuring-a-records-with-your-dns-provider]
5. [secure and fast github pages with cloudflare][secure-and-fast-github-pages-with-cloudflare]
6. [301 redirect and why should you care][301-redirect-and-why-should-you-care]

[Cloudflare-ssl]: https://www.cloudflare.com/ssl/
[subdomain-not-covered]: https://support.cloudflare.com/hc/en-us/articles/200170566-Why-isn-t-SSL-working-for-my-site-
[Custom domains on GitHub Pages gain support for HTTPS]: https://blog.github.com/2018-05-01-github-pages-custom-domains-https/
[configuring-a-records-with-your-dns-provider]: https://help.github.com/articles/setting-up-an-apex-domain/#configuring-a-records-with-your-dns-provider
[secure-and-fast-github-pages-with-cloudflare]: https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/
[301-redirect-and-why-should-you-care]: https://blog.hubspot.com/blog/tabid/6307/bid/7430/what-is-a-301-redirect-and-why-should-you-care.aspx
