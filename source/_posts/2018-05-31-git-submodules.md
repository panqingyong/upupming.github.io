---
title: 管理 Git 仓库内的子仓库
date: 2018-05-31 21:49:26
tags:
- github
- git
categories:
- 工具
- Git
---

本文主要介绍了在一个仓库内部克隆另外一个仓库，后续该如何进行管理。

<!-- more -->

# 仓库内克隆其他仓库遇到的问题

在仓库内部克隆一个仓库 `Spring2018_HITCS_SC_Lab5`：
```
$ tree | more
.
├── src
│   ├── application
│   ├── debug
│   ├── edge
│   ├── exception
│   ├── factory
│   ├── graph
│   ├── helper
│   ├── logger
│   ├── txt
│   │   ├── README.md
│   │   ├── saved-txt
│   │   └── Spring2018_HITCS_SC_Lab5 从另一个 repo 克隆来的
│   │       ├── file2.txt
│   │       ├── file3.txt
│   │       ├── file4.txt
│   │       ├── file5.txt
│   │       ├── file6.txt
│   │       ├── file7.txt
│   │       ├── file8.txt
│   │       ├── NetworkTopology-Big.txt
│   │       └── README.md
│   └── vertex
└── test
    ├── application
    ├── debug
    ├── edge
    ├── factory
    ├── graph
    ├── helper
    └── vertex
```

在添加这个仓库所在文件夹时会下面的遇到问题。
```
$ git add .
warning: adding embedded git repository: src/txt/Spring2018_HITCS_SC_Lab5
hint: You've added another git repository inside your current repository.
hint: Clones of the outer repository will not contain the contents of
hint: the embedded repository and will not know how to obtain it.
hint: If you meant to add a submodule, use:
hint: 
hint: 	git submodule add <url> src/txt/Spring2018_HITCS_SC_Lab5
hint: 
hint: If you added this path by mistake, you can remove it from the
hint: index with:
hint: 
hint: 	git rm --cached src/txt/Spring2018_HITCS_SC_Lab5
hint: 
hint: See "git help submodule" for more information.

$ git commit -m "add teacher's txts"
[master 0aa46bf] add teacher's txts
 2 files changed, 1 insertion(+), 3 deletions(-)
 delete mode 100644 .gitmodules
 create mode 160000 src/txt/Spring2018_HITCS_SC_Lab5

$ git push 
Counting objects: 6, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (6/6), done.
Writing objects: 100% (6/6), 567 bytes | 567.00 KiB/s, done.
Total 6 (delta 4), reused 0 (delta 0)
remote: Resolving deltas: 100% (4/4), completed with 3 local objects.
To github.com:ComputerScienceHIT/Lab5-1160300625.git
   46c54aa..0aa46bf  master -> master
```

从第一步 `git add .` 的 warning 提示可以看出 git 在后续克隆将不会包含这个 `Spring2018_HITCS_SC_Lab5` 的内容，当我 push 完之后，在 GitHub 上看到的将是一个灰色的图标，代表这是一个子模块，但是不知道这个子模块的仓库所在的 url，因此在 GitHub 上无法打开这个文件夹。

<img src="submodule-cannot-be-opened.png" height="200">

# 解决方案

不使用 git submodule 功能，而是直接将这个文件夹作为根仓库的内容加入并 commit。

**Step1: 删除已经 staged 过的文件**

```
$ git rm --cached src/txt/Spring2018_HITCS_SC_Lab5
rm 'src/txt/Spring2018_HITCS_SC_Lab5'
```

**Step2: 查看当前状态**

```
$ git status 
On branch master
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	deleted:    src/txt/Spring2018_HITCS_SC_Lab5

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	src/txt/Spring2018_HITCS_SC_Lab5/

```
**Step3: 重新 stage 这个文件夹**

```
$ git add src/txt/Spring2018_HITCS_SC_Lab5/
```

**注意**：这里一定要加上 `/`，表示将这个文件夹加入，而不是将这个文件夹当做一个子模块。

**两者区别**：  
`git add src/txt/Spring2018_HITCS_SC_Lab5/`: create mode `100644`
`git add src/txt/Spring2018_HITCS_SC_Lab5`: create mode `160000`

**Step4: 再次 commit，并 push**

```git
$ git status 
On branch master
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	deleted:    src/txt/Spring2018_HITCS_SC_Lab5
	new file:   src/txt/Spring2018_HITCS_SC_Lab5/NetworkTopology-Big.txt
	new file:   src/txt/Spring2018_HITCS_SC_Lab5/README.md
	new file:   src/txt/Spring2018_HITCS_SC_Lab5/file2.txt
	new file:   src/txt/Spring2018_HITCS_SC_Lab5/file3.txt
	new file:   src/txt/Spring2018_HITCS_SC_Lab5/file4.txt
	new file:   src/txt/Spring2018_HITCS_SC_Lab5/file5.txt
	new file:   src/txt/Spring2018_HITCS_SC_Lab5/file6.txt
	new file:   src/txt/Spring2018_HITCS_SC_Lab5/file7.txt
	new file:   src/txt/Spring2018_HITCS_SC_Lab5/file8.txt

$ git commit -m "change submodule to subfolder"
[master 4849e5c] change submodule to subfolder
 10 files changed, 1633464 insertions(+), 1 deletion(-)
 delete mode 160000 src/txt/Spring2018_HITCS_SC_Lab5
 create mode 100644 src/txt/Spring2018_HITCS_SC_Lab5/NetworkTopology-Big.txt
 create mode 100644 src/txt/Spring2018_HITCS_SC_Lab5/README.md
 create mode 100644 src/txt/Spring2018_HITCS_SC_Lab5/file2.txt
 create mode 100644 src/txt/Spring2018_HITCS_SC_Lab5/file3.txt
 create mode 100644 src/txt/Spring2018_HITCS_SC_Lab5/file4.txt
 create mode 100644 src/txt/Spring2018_HITCS_SC_Lab5/file5.txt
 create mode 100644 src/txt/Spring2018_HITCS_SC_Lab5/file6.txt
 create mode 100644 src/txt/Spring2018_HITCS_SC_Lab5/file7.txt
 create mode 100644 src/txt/Spring2018_HITCS_SC_Lab5/file8.txt

$ git push 
Counting objects: 11, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (11/11), done.
Writing objects: 100% (11/11), 12.77 MiB | 21.00 KiB/s, done.
Total 11 (delta 3), reused 0 (delta 0)
remote: Resolving deltas: 100% (3/3), completed with 3 local objects.
To github.com:ComputerScienceHIT/Lab5-1160300625.git
   0aa46bf..4849e5c  master -> master

```

<img src="fixed.png" height="200">

# 引申

因为我这里没有对 `Spring2018_HITCS_SC_Lab5` 这个仓库 push 的权限，所以直接使用包含文件夹的形式更为方便。

其实 git 的 submodule 功能特别强大，能够将父仓库与子仓库分开管理。关于 submodule 的使用推荐读者详细地读一下 Pro Git：[中文版][zh-cn]、[英文版][en]。

# 参考资料

1. [How to make outer repository and embedded repository work as common/standalone repository?][1]
2. [What does a grey icon in remote GitHub mean][2]

[1]: https://stackoverflow.com/questions/47008290/how-to-make-outer-repository-and-embedded-repository-work-as-common-standalone-r
[2]: https://stackoverflow.com/questions/19584255/what-does-a-grey-icon-in-remote-github-mean?noredirect=1&lq=1
[zh-cn]: https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97
[en]: https://git-scm.com/book/en/v2/Git-Tools-Submodules
