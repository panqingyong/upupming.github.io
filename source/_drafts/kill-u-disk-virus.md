<!-- ---
title: kill-u-disk-virus
tags:
--- -->

# Windows U 盘病毒查杀过程

## 需求

杨辰的 U 盘中了病毒，听她说具体的表现是文件经过室友的电脑之后原来的 `音乐.docx` 被篡改为了 `音乐.exe`，结果文档就再也看不到了。

我猜想杨辰的室友的 Windows 可能是 Win7 （不带杀毒功能）或者是 Windows 10 但是没有开启 Windows defender，现在 Windows defender 基本上是可以查到任何病毒，当场隔离的。

<!-- more -->

## 开始分析

我因为自己之前[在组策略里面禁用了 Windows defender](https://www.wisecleaner.com/how-to/119-how-to-turn-off-windows-defender-in-windows-10.html)，现在为了防止中毒先重新打开一下。（因为自己平时很谨慎对待软件的安装，所以个人不会使用任何杀毒软件）

然后插上 U 盘（HP 16GB 这个），果然一插入 Windows defender 就提示有病毒：

<img src="https://i.loli.net/2019/04/22/5cbda61f35afc.jpg" alt="20190422193137-2019-4-22-19-31-40">

<img src="https://i.loli.net/2019/04/22/5cbda6457b091.jpg" alt="20190422193216-2019-4-22-19-32-17">

<img src="https://i.loli.net/2019/04/22/5cbda6560d3e7.jpg" alt="20190422193232-2019-4-22-19-32-34">

<img src="https://i.loli.net/2019/04/22/5cbda67be4dbb.jpg" alt="20190422193312-2019-4-22-19-33-13">

<img src="https://i.loli.net/2019/04/22/5cbda6d434dcc.jpg" alt="20190422193440-2019-4-22-19-34-41">

<img src="https://i.loli.net/2019/04/22/5cbda74354c56.jpg" alt="20190422193629-2019-4-22-19-36-30">

Windows defender 大约每隔 30 秒弹一条 `Threats found` 通知，可以看到最主要是隐藏目录的一些文件，比较好奇，于是上网查了一下这些病毒：

1. [Virus:Win32/Ramnit.A](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Virus%3AWin32%2FRamnit.A)

    此病毒感染 Windows 可执行文件（.EXE）和 HTML 文件（.HTML）。它还可以让恶意黑客访问您的 PC。

2. [Occamy.C](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:Win32/Occamy.C)

    此威胁可以在您的 PC 上执行恶意黑客选择的许多操作。

3. ...

太多啦，最后我通过[这里](https://serverfault.com/questions/816870/where-are-windows-10-defender-offline-scan-logs-results)的方法拿到了病毒的[日志文件](chen-usb-virus.txt)，经过正则表达式筛选（`(	(Name: .*))|(Path: .*)`），我整理成了下面比较好看的日志：

```txt
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.Trashes.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.Trashes.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.Trashes.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.Trashes.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.Trashes.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.Trashes.exe
Name: Virus:Win32/Ramnit.A!remnants
Path: file:_E:\.Trashes.exe
Name: Virus:Win32/Ramnit.A!remnants
Path: file:_E:\.Trashes.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.TemporaryItems.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.TemporaryItems.exe
Name: Virus:Win32/Ramnit.A!remnants
Path: file:_E:\.TemporaryItems.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.TemporaryItems.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.TemporaryItems.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.TemporaryItems.exe
Name: Virus:Win32/Ramnit.A!remnants
Path: file:_E:\.TemporaryItems.exe
Name: Virus:Win32/Ramnit.A!remnants
Path: file:_E:\.TemporaryItems.exe
Name: Virus:Win32/Ramnit.A!remnants
Path: file:_E:\.TemporaryItems.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.Spotlight-V100.exe
Name: Virus:Win32/Ramnit.A!remnants
Path: file:_E:\.TemporaryItems.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.Spotlight-V100.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.Spotlight-V100.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.Spotlight-V100.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.Spotlight-V100.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.Spotlight-V100.exe
Name: Virus:Win32/Ramnit.A!remnants
Path: file:_E:\.Spotlight-V100.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.fseventsd.exe
Name: Virus:Win32/Ramnit.A!remnants
Path: file:_E:\.Spotlight-V100.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.fseventsd.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.fseventsd.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.fseventsd.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.fseventsd.exe
Name: Trojan:Win32/Aenjaris.CP!bit
Path: file:_E:\.fseventsd.exe
Name: Virus:Win32/Ramnit.A!remnants
Path: file:_E:\.fseventsd.exe
Name: Virus:Win32/Ramnit.A!remnants
Path: file:_E:\.fseventsd.exe
```

这些病毒全部是隐藏文件，对于没有开启默认显示隐藏文件的电脑来说无疑是很吃亏的，真的建议大家平时把这个功能一直打开：

<img src="https://i.loli.net/2019/04/22/5cbdabe5ceb79.jpg" alt="20190422195613-2019-4-22-19-56-14">

## 问题解决

找到问题所在，自然很好解决，删掉所有 `.` 开头的（隐藏的） `exe` 文件，因为杨辰自己用的 macOS，所以我删除任何 `exe` 都是没问题的，肯定不是她日常需要使用的东西，所以直接来了一个文件名匹配：

```bash
$ grep -ir .*.exe . > log.txt
grep: input file ‘./log.txt’ is also the output
grep: ./.Trashes/501/System Volume Information.exe: Permission denied
grep: ./.Trashes/501/音乐.exe: Permission denied
grep: ./.Trashes/501/琴谱.exe: Permission denied
grep: ./.Trashes/501/网络虚拟财产的继承问题研究 结题.exe: Permission denied
grep: ./.Trashes/501/音乐 16.47.40.exe: Permission denied
grep: ./.Trashes/501/琴谱 16.47.42.exe: Permission denied
grep: ./.Trashes/501/网络虚拟财产的继承问题研究 结题 16.47.47.exe: Permission denied
grep: ./.Trashes/501/琴谱 19.04.31.exe: Permission denied
grep: ./.Trashes/501/打印.exe: Permission denied
grep: ./.Trashes/501/打印 07.27.16.exe: Permission denied
grep: ./.Trashes/501/打印 22.09.01.exe: Permission denied
grep: ./.Trashes/501/4.21 打印.exe: Permission denied
grep: ./.Trashes/501/打印 12.23.41.exe: Permission denied
grep: ./.Trashes/501/琴谱 12.23.45.exe: Permission denied
grep: ./.Trashes/501/推荐信.exe: Permission denied
grep: ./网络虚拟财产的继承问题研究 结题.exe: Permission denied
grep: ./System Volume Information.exe: Permission denied
grep: ./音乐.exe: Permission denied
```

可以看到有很多 `exe` 文件，在我搜索的过程中，Windows defender 不知为什么，同时发现了它们，自动把它们给隔离掉了。

最后只留下了两个隐藏文件夹：

<img src="https://i.loli.net/2019/04/22/5cbdafc691723.jpg" alt="20190422201251-2019-4-22-20-12-52">

这两个文件夹 macOS 会用到，具体参见这里，我也复制一下原文：

- `.DS_Store`: This is a common hidden file that is created in each directory you view using Finder. It stores stuff like folder view settings and icon positions
- `.Trash(es)`: Stays until you empty your recycle bin.
- `.TemporaryItems`, `._Temporary Items` or `Temporary Items` folders: These are used as temporary storage. Ideally, the application using it would clean up after itself, but this does not always happen.
- `.Spotlight-V100`: used by the spotlight indexer

Windows 病毒藏在 macOS 的隐藏文件夹里面，确实很神奇。我推测应该是自动复制病毒，会将软件名自动修改为当前文件的名字，对于不显示后缀名的 Windows 用户来说，他们会误以为是原来的文件而点开。

## 收尾验证

1. 拔出 U 盘
2. 再次插入
3. Windows defender 显示没有病毒，清理完成

对第二个 U 盘（印有杨辰的那个）也来分析一下。

第二个很有意思，有一个快捷方式：

<img src="https://i.loli.net/2019/04/22/5cbdb1e4148c5.jpg" alt="20190422202151-2019-4-22-20-21-52">

指向的是 `%COMSPEC% /C .\WindowsServices\movemenoreg.vbs`，查阅[资料](https://holeycc.blogspot.com/2016/07/virus-movemenoregvbs.html)发现：

<img src="https://i.loli.net/2019/04/22/5cbdb24eeb1bc.jpg" alt="20190422202339-2019-4-22-20-23-40">

这是一个老牌病毒，病毒本身有三个运行着的 Service，还尝试将其复制到电脑硬盘中，这将造成电脑的永久感染。

删除这个快捷方式即可，没有发现其他的病毒，Windows defender 也没有报毒，其他一切正常。

同样再次拔插，没有任何问题。

## 总结

macOS 不易中毒，但是 Window 很容易中毒，应该谨慎对待 `exe` 文件，从官网下载应用（比较重视安全的人都会验证哈希值），对待 U 盘需要谨慎一点。现在杨辰的同学的电脑可能还携带有病毒，不知道 U 盘插上去之后会不会再次感染，可以用 Windows defender 查杀一下。Windows 7 及以下的话，可以使用迈克菲、360、电脑管家等。

还得问一下杨辰，原来的 `音乐.exe` 是不是一个 `docx` 文档，我推测不是，只是病毒根据`音乐`文件夹生成的`音乐.exe`如果是的话，那`音乐.docx`确实已经丢失，找不到了！！！
