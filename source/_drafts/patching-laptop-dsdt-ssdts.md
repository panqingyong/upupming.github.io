---
title: patching-laptop-dsdt-ssdts
tags:
---

本文主要介绍黑苹果如何打 DSDT 和 SSDT 补丁（patch），绝大部分内容翻译自 [Patching LAPTOP DSDT/SSDTs - by RehabMan](https://www.tonymacx86.com/threads/guide-patching-laptop-dsdt-ssdts.152573/)。

# 概述

为了使 OS X 的许多功能在笔记本电脑上运行良好，您将始终需要正确修补的 DSDT（可能还有一些 SSDT）。本指南的目的是为您的 OEM DSDT/SSDT 的正确修补提供基础。

注：

> **DSDT (Differentiated System Description Table)** is a part of the ACPI specification. It supplies information about supported power events in a given system. ACPI tables are provided in firmware from the manufacturer.

> In ACPI, peripheral devices and system hardware features on the platform are described in the **Differentiated System Description Table (DSDT)**, which is loaded at boot, or in **Secondary System Description Tables (SSDTs)**, which are loaded at boot or loaded dynamically at run time. For SoCs, the platform configuration is typically static, so the DSDT might be sufficient, although SSDTs can also be used to improve the modularity of the platform description.

从上面可以看出，DSDT 和 SSDT 都是对硬件比较底层的抽象。

高级用户可能希望通过 Clover 实现热修补（hotpatching）。请参阅此处的指南：http：//www.tonymacx86.com/threads/guide-using-clover-to-hotpatch-acpi.200137/

您可能想使用来自另一台电脑的 DSDT，但这几乎总是以失败告终。您无法确定使用来自另一台电脑的 ACPI 文件是否有效。即使您使用别人的 ACPI 文件，即使硬件配置（BIOS 版本，安装的内存量，选择的 BIOS 选项以及其他硬件差异，例如安装了哪种无线网卡）的微小差异也会导致不稳定和奇怪的 bug。这些差异可能使各种 `OperationRegion` 地址不同，这使得一个系统的 DSDT 补丁与另一个系统不兼容。相同型号的笔记本电脑如果使用不同的主板，产生不兼容的 ACPI 文件也并不罕见。

请记住，您对自己的系统（BIOS，硬件等）所做的任何更改也需要重新提取，重新打补丁。

如果任一下列的改变时，你必须重新提取、重新打补丁，因为这些变化可能导致本机 ACPI（特别是 SystemMemory regions）显著的变化：

- 更新BIOS 
- 更改任何BIOS选项
- 改变硬件或内存配置

修补过程包括几个步骤：

- 提取本机文件
- 反汇编本机文件
- 分析本机文件
- 修补
- 保存（编译）和安装


# 提取本机ACPI文件

所有 BIOS 实现都为操作系统提供 ACPI 文件。因此，在任何操作系统上，您都可以提取它们以便以后修补。因此，可以在 Linux、OS X、Windows 甚至 Clover 引导加载程序中进行提取。提取的本机文件内容通常是相同的，但由于用于提取的软件，它们的名称可能不同。

本指南将重点介绍三种提取方法：在 Clover 中使用 F4，在 OS X 中使用 `patchmatic` 或使用 Linux。

只有第一种是推荐的方法。其他仅供参考。

## 使用 Clover F4 进行提取（**推荐**）

建议使用 Clover F4 进行提取，因为提取过程简单，并且易于比较 ACPI/origin 和 ACPI/patched（用于故障排除）。

在 Clover 引导加载程序主屏幕上，您可以按 F4，Clover 会将本机 ACPI 文件转储到 EFI/Clover/ACPI/origin。然后，您可以在 OS X 开机之后反汇编它们并进行修补。请注意，某些 BIOS 实现会使用 F4 反转 Fn + F4 的功能，因此如有疑问，请把Fn + F4 和 F4 都试一次。在转储期间或之后没有反馈，只是在写入文件时稍有延迟。如果将它们写入USB，延迟会更明显，就像从 Clover USB 启动一样。

在黑苹果装好之前，我是在 Windows 里面运行一个 VMWare 虚拟机来运行苹果系统，关于虚拟机的安装可以参考 [How to Install macOS Sierra Final on VMware on Windows](https://techsviewer.com/install-macos-sierra-vmware-windows/)。然后在 tonymacx86 [下载页面](https://www.tonymacx86.com/resources/categories/tonymacx86-downloads.3/)下载好 Unibeast 创建启动盘，用 USB 可以启动 Clover 引导程序。您也可以尝试将 U盘中的 `Clover` 文件夹复制到 EFI 分区，再使用 EasyUEFI 创建一个 Clover 启动项。挂载 EFI 分区可以用下面的批处理代码，参见[mount the EFI partition on Windows 8.1](https://superuser.com/questions/662823/how-do-i-mount-the-efi-partition-on-windows-8-1-so-that-it-is-readable-and-write)，在 Windows 10 下只能使用任务管理器 -> Run new task 来访问 EFI 分区：

```bat
(
    echo select disk 0
    REM 假设分区 2 是 EFI 分区
    echo select partition 2
    REM 分配其盘符为 Z
    echo assign letter=z
) | diskpart
taskkill /im explorer.exe /f
explorer.exe
```

有时，Clover F4 会写入重复的 SSDT。这些重复内容将使反编译过程产生问题。如果在反汇编期间遇到问题（重复定义），则需要分析所有 SSDT 以消除重复的文件。通过查看文件大小很容易看出哪些是重复的。大小相等的文件可能是重复的。

您可以在终端中查看所有 SSDT 的文件大小（以字节为单位）：
码：

```bash
ls -l SSDT*.aml
```

## 使用 `patchmatic` 进行提取（不推荐）

如果您已经安装了 OS X，并且当前没有使用任何修补的 ACPI 文件启动，则可以使用 `patchmatic` 提取本机 DSDT/SSDT。在这里下载 `patchmatic` 二进制文件：https：//github.com/RehabMan/OS-X-MaciASL-patchmatic（请务必阅读 README，因为下载地址在其中）。为了便于在终端中使用，您应该将二进制文件（在 ZIP 中）复制到 /usr/bin。

安装好 `patchmatic` 后，您可以在终端中调用它，如下所示：

```bash
cd ~/Desktop
mkdir extract
cd extract
patchmatic -extract
```

`patchmatic` 二进制文件将提取所有已加载的 ACPI 文件并将它们放在当前目录中。如果您在引导加载程序中使用任何影响注入的DSDT/SSDT 的选项，则不会获得本机 ACPI 文件，因此请确保您没有使用这些选项。例如，如果您正在使用（Chameleon）`DropSSDT = Yes` 或（Clover）`DropOem = true`，则在 OS X 加载它们之前会删除本机 SSDT，因此您将在补丁输出中丢失它们。对于任何 Clover DSDT “修复” 也是如此 - 这些修补程序正在修补本机 DSDT，然而要进行自己的 DSDT 修补，您不需要这些已被修补的 DSDT。`GeneratePStates/GenerateCStates = Yes`或者`Clover/ACPI/SSDT/Generate/CStates/ACPI/SSDT/Generate/PStates` 等选项会注入额外的 SSDT，这会导致反编译的复杂化。

出于所有这些原因，通过 Linux 或 Clover F4 提取通常更容易。

注意：使用 `patchmatic -extract` 作为诊断工具，确认当前的 DSDT/SSDT 是您所希望的被修补后的状态，是很有用的。


## 使用Linux进行提取（不推荐）

在 Linux 中，可以直接从文件系统获取本机 ACPI 文件。您可以在 `/sys/firmware/acpi/tables` 和 `/sys/firmware/acpi/tables/dynamic` 中找到它们。可以在终端中使用单个命令复制整个集合。

没有必要安装Linux。只需从USB运行它：http：//www.ubuntu.com/download/desktop/create-a-usb-stick-on-windows。

在Linux终端中输入：

```bash
# 用 FAT32 格式的 USB 的挂载点代替 DEST
sudo cp -R /sys/firmware/acpi/tables DEST
```

您应该将文件复制到 FAT32 格式的 USB。使用 FAT32 可以避免权限问题，因为 FAT32 没有文件权限。自动挂载 USB 的 DEST 值取决于您使用的 Linux 版本以及启动方式。您可以通过在终端中键入 `mount` 来查看挂载点，或者将鼠标悬停在 Linux 文件资源管理器中的卷名称上。

# 准备反汇编工具

要正确反汇编提取的文件，需要从终端运行的 iasl 编译器。

您需要最近构建的 iasl 才能正确反汇编它们。这里有适当的版本：https://bitbucket.org/RehabMan/acpica/downloads/。将 iasl 二进制文件复制到您的路径（例如 /usr/bin）是个好主意，这样可以从终端轻松使用它。

例如，如果您将其下载到〜/ Downloads / iasl.zip，则可以在终端中提取并复制它：
码：
cd~ /下载
解压缩iasl.zip
sudo cp iasl / usr / bin

## 从 github 构建最新的 iasl

您还可以从我的 github 构建最新版本的 iasl。最新版本的 iasl 最终将在 bitbucket 链接上提供，但对于那些想要处于“前沿”的人来说，你可以自己构建它。最新版本往往具有实验性且未经过良好测试的代码。

假设您安装了Xcode：

```bash
mkdir ~/Projects && cd ~/Projects
git clone https://github.com/RehabMan/Intel-iasl.git iasl.git
cd iasl.git
```

然后构建它：

```bash
make
```

此时，您可以使用以下命令安装它：

```bash
sudo make install
```

假设您已将 `MaciASL.app` 安装到 `/Applications`，您也可以在 MaciASL 中使用新版本（您刚刚构建并安装到 /usr/bin 的版本）：

```
sudo cp /usr/bin/iasl /Applications/MaciASL.app/Contents/MacOS/iasl62
```

# 反汇编 ACPI 文件

虽然可以直接在 MaciASL 中打开提取的本机文件，但不建议这样做。直接在 MaciASL 中打开 AML 文件将导致 MaciASL 独立地反汇编文件（使用 iasl），如果 AML 具有对其他 AML 的复杂引用，则不会正确地反汇编它。你会留下许多难以修复的错误。

因此，最好使用终端中的 iasl 将所有文件作为一个组进行反汇编。在准备阶段，请将所有 DSDT 和 SSDT 文件放在一个目录中（不要复制不以 DSDT 或 SSDT 开头的 ACPI 文件），并更改名称以使它们具有 .aml 扩展名。

然后在OS X终端中反汇编：

```bash
cd "to directory where you placed all SSDT/DSDT"
iasl -da -dl DSDT.aml SSDT*.aml
```

对于较新的 ACPI 集（Skylake 及更高版本的电脑），不需要 `-da`，因为它们具有嵌入式外部操作码（opcodes)：

```bash
cd "to directory where you placed all SSDT/DSDT"
iasl -dl DSDT.aml SSDT*.aml
```

注意：请勿尝试使用 `-da` 选项反汇编其他 ACPI 文件。不起作用。

注意：另请阅读以下有关 `refs.txt` 的部分。使用 `refs.txt` 需要更多的努力，但可以消除许多常见错误。

从现在开始，您将**专心处理使用 MaciASL 生成的 `* .dsl` 文件**。当然，要使用它们，您必须将其作为 “ACPI Machine Language Binary” 保存，扩展名为 `aml`，并将它们放置在引导加载程序加载的位置。但请保留修补的 `.dsl` 文件，以备将来需要应用更多补丁时使用。

**让我简单地说明一下**（因为很多人遇到这个问题）：如果你**直接在 MaciASL 中打开一个 AML 文件并单击 Compile，你这样是错的**。让它在你耳朵之间的灰质中停留一分钟。此规则的唯一例外是使用最近足够多的 iasl 编译的 AML 文件，它将嵌入的外部操作码（opcodes）放在文件中。这包括您自行编译的当前 iasl 和 OEM（通常是 Skylake 及更高版本）编译的本机 ACPI 文件。

注意：使用 ACPI 6.1（及更高版本）的新工具在处理使用新版本的 iasl 编译的 AML 文件时更加强大。ACPI 6.1+ 为编译器添加了一个功能，其中外部引用的操作码被添加到 AML 二进制文件中。ACPI 解释器忽略这些数据，但这些数据对反汇编程序（也只是ACPI 6.1+ iasl）很有用，可以从独立的 AML 中创建更好的反汇编结果。因此，您可能会发现使用最新工具重新编译的 AML 文件可能会更直接地打开。当然，现有的 OEM ACPI DSDT 和 SSDT 此时并未使用新工具，因此您仍必须首先使用选项 `-da` 对所有DSDT/SSDT 进行反汇编，如本指南中所述。

关于 Snow Leopard ACPI 实现的注意事项：不幸的是，10.6.8 ACPI 已经足够老了，它会在外部操作码上阻塞 AML。如果您计划在 Snow Leopard 中使用 ACPI 文件，请在编译 AML 文件时使用未在文档中说明的 `-oe` 切换到 iasl。从 MaciASL 编译（另存为）时未设置此选项，因此您需要在终端中编译文件。`-oe` 选项禁用输出 AML 文件中外部操作码的生成。


## 用 `refs.txt` 反汇编

有时还有其他未解析的外部引用（未在任何文件中定义的符号）。iasl 反汇编程序将尝试猜测参数的数量，但通常猜测不好。您可以通过在文本文件中提供外部声明来更正它。一些常见的未解析符号是 `SGPO`、`ECRD`、`ECWT` 和 `MMTB`。

以下 `refs.txt` 内容有一些常见的（和不常见的）缺失符号（由此贴中的用户报告），反汇编程序往往会手足无措。

首先在 DSDT/SSDT 文件所在的目录中创建 `refs.txt`：

```
External(MDBG, MethodObj, 1)
External(_GPE.MMTB, MethodObj, 0)
External(_SB.PCI0.LPCB.H_EC.ECWT, MethodObj, 2)
External(_SB.PCI0.LPCB.H_EC.ECRD, MethodObj, 1)
External(_SB.PCI0.LPCB.H_EC.ECMD, MethodObj, 1)
External(_SB.PCI0.PEG0.PEGP.SGPO, MethodObj, 2)
External(_SB.PCI0.GFX0.DD02._BCM, MethodObj, 1)
External(_SB.PCI0.SAT0.SDSM, MethodObj, 4)
External(_GPE.VHOV, MethodObj, 3)
External(_SB.PCI0.XHC.RHUB.TPLD, MethodObj, 2)
```

注意：对于较新的 ACPI 集（通常是 Skylake 及更高版本），ACPI文件已使用足够新版本的 iasl 进行编译，该版本将外部操作码嵌入到生成的 AML 代码中。对于这些较新的 ACPI 集，不需要 `-da`，特别的是也不需要 `refs.txt`，因为这里的 `refs.txt` 内容可能与嵌入式外部操作码冲突。

创建 `refs.txt` 的一种方便方法是在终端中使用 `pbpaste`。将上面的文本复制到剪贴板（我假设您知道如何操作），然后：

```bash
pbpaste>refs.txt
```

这将在您当前的工作目录中创建 `refs.txt`。

然后在反汇编时使用它：

```bash
iasl -da -dl -fe refs.txt DSDT.aml SSDT*.aml
```

# 分析本机 ACPI

在反汇编之后，您可能希望查看每个 `.dsl` 文件的内容以熟悉每个文件中的内容。某些修补取决于内容。例如，如果要修补以禁用独立图形设备，您可能正在寻找与该设备相关的 `_OFF` 方法（此过程将在单独的指南中介绍，本指南后面将进行链接）。

除了修补以禁用独立图形设备之外，没有必要修补任何 SSDT，因为 [Clover 笔记本电脑指南中提供的 plist](https://www.tonymacx86.com/threads/guide-booting-the-os-x-installer-on-laptops-with-clover.148093/) 已经完成了常见的重命名。重命名最好通过 `config.plist/ACPI/DSDT/Patches` 来完成，因为与手动修补重命名相比，它可以避免很多错误。

在大多数情况下，您应该只关注 `DSDT.aml`。

# 修复错误

即使一次反汇编所有文件（用 `-da` 参数调用 iasl），本机文件仍然可能有错误。由于 iasl 随时间的变化，iasl 本身的不完善以及我们的笔记本电脑和 OEM 之间的编译环境的差异，反汇编的文件可能有错误。例如，错误的常见原因（我的理论）是引用的一些方法实际上是在 Windows 内部（例如 MMTB 和 MDBG）。还有明显的情况是代码中存在错误或代码是无意中写入的（有时很难区分）。

所以...在确定了你需要的文件后，你必须对它们进行修补，以便它们编译时没有错误。MaciASL 的笔记本电脑修补程序存储库中有许多针对此类错误的常见修补程序。

MaciASL：https://github.com/RehabMan/OS-X-MaciASL-patchmatic
Laptop Patches：https://github.com/RehabMan/Laptop-DSDT-Patch

注意：我不会使用 DSDT Editor 测试我的补丁。它 Bug 太多，所用的 iasl 版本非常旧。请不要问我关于它的问题。

请务必阅读 README，以便从正确的位置下载并正确设置 MaciASL。syntax/error 问题的补丁的名称以 `[syn]` 开头。旧 DSDT 的常见示例是 `Fix _PLD Buffer/Package Error`，`Fix TNOT Erro` 和 `Fix FPED Parse Error`。为了确定您需要哪个补丁，您可以查看来自 iasl 编译器的错误消息以及检测到错误的行中的代码。您还可以尝试应用修补程序，以查看它是否进行了更改，如 MaciASL 中的“预览”窗口中所示。如果您不熟悉每种类型的错误，可能需要进行一些实验和 trail/error。

对于某些错误，您只需删除导致错误的代码行。但是，这取决于该行是否是正确操作代码所必需的。例如，通常可以删除由“外部”声明引起的错误以修复错误。如果您愿意，可以创建自己的自动修补程序以删除这些行。

有一些 ACPI 规范和编程的相关经验会很有益处。

您的目标是让每个 `.dsl` 文件编译而不会出错（警告/备注/优化都可以）。一旦你有无编译错误的文件，你可以继续修补它们来修复你的 OS X 安装可能遇到的问题。

拥有无关/不必要的外部声明是很常见的。例如，我看到的最近的 DSDT 有很多 `Name already exists in scope` 错误。对于DTSE，DTS1，DTS2，DTS4，BNUM，PDTS，PKGA，SPST。

解决方法是简单地注释掉相关的外部声明。
例如：

```txt
//   External (DTS1, FieldUnitObj)    // (from opcode)
//   External (DTS2, FieldUnitObj)    // (from opcode)
//   External (DTS3, FieldUnitObj)    // (from opcode)
//   External (DTS4, FieldUnitObj)    // (from opcode)
//   External (DTSE, FieldUnitObj)    // (from opcode)
... 等等 ...
```

最近的 DSDT 中的另一个常见错误是 `ECRW`（在 `_CRS` 方法中）。这是由 iasl 的一个 bug 引起的非常常见的错误。我不会为它添加一个 MaciASL 补丁，因为它最终将由英特尔修复（这是一个回归）。

易于修复。

修改：

```c
If (LEqual (PM6H, One))
{
    CreateBitField (BUF0, \_SB.PCI0._Y0C._RW, ECRW)  // _RW_: Read-Write Status
    Store (Zero, ECRW (If (PM0H)
            {
                CreateDWordField (BUF0, \_SB.PCI0._Y0D._LEN, F0LN)  // _LEN: Length
                Store (Zero, F0LN)
            }))
}
```

为：

```c
If (LEqual (PM6H, One))
{
    CreateBitField (BUF0, \_SB.PCI0._Y0C._RW, ECRW)  // _RW_: Read-Write Status
    Store (Zero, ECRW)
}
If (PM0H)
{
    CreateDWordField (BUF0, \_SB.PCI0._Y0D._LEN, F0LN)  // _LEN: Length
    Store (Zero, F0LN)
}
```

## 常见修补程序

通常，只有在发现需要特定的修补程序后才应用 DSDT 修补程序。但是通常需要几个补丁，这些补丁很少导致问题。它们在我的笔记本电脑仓库中，并在此处列出：

```txt
"Fix _WAK Arg0 v2"
"HPET Fix"
"SMBUS Fix"
"IRQ Fix"
"RTC Fix"
"OS Check Fix"
"Fix Mutex with non-zero SyncLevel"
"Fix PNOT/PPNT" (只有当您丢弃 CPU 相关的 SSDT 时才使用)
"Add IMEI" (如果您的 DSDT/SSDT 已经有了 IMEI/HECI/MEI 设备，请勿使用)
```

注意：您使用的 `OS Check Fix` 补丁与 Windows 版本无关。

注意：如果您包含所有 OEM SSDT，请不要使用 `Fix PNOT/PPNT` 补丁。它仅适用于省略 OEM CPU 相关 SSDT 的情况。


这些补丁可用于为 USB 注入电源属性：

```txt
"6-series USB"
"7-series/8-series USB"
```

`_PRW` 补丁可用于修复“即时唤醒”，即笔记本电脑无法在睡眠醒来后再次立即睡眠，而需要等待几秒。仅使用 `USB _PRW 0x6D (instant wake)` 或 `USB _PRW 0x0D (instant wake)`（0x0D 和 0x6D 都是从 `_PRW` 返回的 `XHC/EHC/HDEF` 的常见值），因为它与 DSDT 中的现有代码相关（还要注意 Skylake 及更高版本的这些补丁的特定版本）。您应该检查 DSDT 以确定相关的 `_PRW` 方法返回什么以确定该补丁是否适合您的 `DSDT`。

如果您使用  Haswell CPU/8 系列芯片组，并且没有加载 `AppleLPC.kext`，你应该使用这个补丁来注入一个允许它加载的兼容ID：

```txt
"Haswell LPC"
```

如果你有一个 Skylake CPU/100 系列芯片组，并且没有加载 `AppleLPC.kext`，你应该使用这个补丁来注入一个允许它加载的兼容ID：

```txt
"Skylake LPC"
```

注意：Skylake 及更高版本不太可能需要 `AppleLPC.kext`。

关于重命名的注意事项：重命名必须“平衡”。通常会重命名对象以更好地匹配 OS X 的期望（例如“将 GFX0 重命名为 IGPU”以进行正确的 IGPU 电源管理）。在这种情况下，还必须重命名所有引用该名称的 DSDT/SSDT。这就是最好使用 `config.plist/ACPI/DSDT/Patches` 完成重命名的原因。

关于重复标识符的注意事项：您必须确保修补的文件不包含重复的标识符。一种常见的情况是将 `_DSM` 方法添加到一个 SSDT 中的给定路径，其中 OEM 已在另一个 SSDT 中的相同路径上定义了 `_DSM`。要避免此问题，可以使用 `Remove _DSM methods` 补丁作为对所有 DSDT/SSDT 执行的第一个修补程序之一。此外，`Rename _DSM methods to XDSM` 是另一种选择（有时 MaciASL `Rename _DSM methods to XDSM` 时会出现 Bug）。


## 特定问题的修补

电池状态：http://www.tonymacx86.com/yosemite-laptop-support/116102-guide-how-patch-dsdt-working-battery-status.html

背光控制：http://www.tonymacx86.com/yosemite-laptop-support/152659-patching-dsdt-ssdt-laptop-backlight-control.html

禁用 nVidia/Radeon 独立显卡：
https://www.tonymacx86.com/threads/guide-disabling-discrete-graphics-in-dual-gpu-laptops.163772/

在阅读特定笔记本电脑的指南时，它可能会指示您应用帖子中提供的补丁。您将认出它，因为使用的语法看起来类似于您在 repo 中看到的其他补丁（例如 `into_all method label FOO code_regex xxyy removeall_matched;`）。这些补丁旨在直接粘贴到 MaciASL 中的补丁窗口中，以便可以应用它们。

如果您有兴趣编写自己的补丁，请阅读有关 MaciASL 补丁语法的文档：http://sourceforge.net/p/maciasl/wiki/Patching Syntax Grammar/

注意：在许多情况下，DSDT 补丁与其他 kexts，修补 kexts 或 Clover config.plist 补丁一起使用，这些补丁在加载时修补系统 kext。


## 使用修补的 `AppleHDA` 的补丁

使用修补的 `AppleHDA`，需要两个与 kext 结合使用的补丁：

```txt
"Audio Layout 12" (change the layout-id from 12 to the one used by your DSDT)
"IRQ Fix"
```

注意您必须具有与您的编解码器匹配的 AppleHDA，并且必须确定选择了哪个 `layout-id`。`layout-id` 是 AppleHDA 补丁的创建者选择的任意值。

如何确定特定的 `AppleHDA` 补丁使用的`layout-id`：首先，您需要知道十进制的编解码器 ID（例如，0x10ec0269 = 283902569）。然后查看 `AppleHDAHardwareConfigDriver.kext` 的 `Info.plist`（位于 `AppleHDA.kext/Contents/PlugIns/AppleHDAHardwareConfigDriver.kext/Contents/Info.plist`），在 `HDAConfigDefault` 下找到您的编解码器 ID（在马虎修补的 `AppleHDA` 可能有很多或一个条目）。与您的编解码器 ID 匹配的 LayoutID 是您需要的 `layout-id`。修补后的 `AppleHDA` 可能包含给定编解码器的多个 `layout-id`。在这种情况下，请选择您要使用的那个。

## 保存文件以供引导加载程序加载

要使用已修补的 DSDT/SSDT，必须将它们保存在引导加载程序可以加载的位置。每个引导加载程序位置都是唯一的，对命名有不同的要求。文件必须保存为 `ACPI Machine Language Binary`（MaciASL -> 另存为）中。保存带有 AML 扩展名的文本文件（dsl）可能会在 OS X 中引起 panic 或非常奇怪的行为。

Clover：文件应放在 Clover 引导加载程序分区（通常是 EFI 分区）中，在 `EFI/Clover/ACPI/patched` 中。DSDT.aml（如果存在）将自动替换 OEM DSDT。本指南（以及本指南中链接的其他指南）假设您使用的是 `config.plist/ACPI/AutoMerge=true, config.plist/ACPI/SSDT/DropOem=false`。使用 `AutoMerge = true`，可以将修补后的 SSDT 放置在 `ACPI/patched` 中，并使用其原始名称，并插入它们，以便不干扰 SSDT 的原始顺序。没有必要（或建议）将 `SortedOrder`与 `AutoMerge = true` 一起使用。其他配置在下面的“推荐配置”中介绍。

如上所述，RehabMan fork  的 Clover 中的一个新功能允许您在不使用 `DropOem = true` 的情况下替换 OEM SSDT，并且不使用 `SortedOrder`，同时保持未修补和修补的 SSDT 的原始顺序，如 Clover 注入的那样。通过设置 `config.plist/ACPI/AutoMerge=true` 启用此功能。当置于 `ACPI/patched` 中时，SSDT 必须保留其原始编号方案。此功能在 `2017-12-15，Clover_v2.4k_r4359.RM-4506.c5fc0346.zip` 上完全正常工作，它位于 RehabMan bitbucket 网站上。从 r4334 起，所需的更改在官方 Clover（在 sourceforge 上）中实现（但是您可能会遇到错误，使用 RehabMan 构建）。由笔记本第一指南链接的每个 plist 默认使用 `AutoMerge = true`。

虽然您可以在变色龙中使用修补的 DSDT 和修补的 SSDT，但本指南不会涵盖它。不建议使用变色龙。请改用 Clover。

Clover 的 RehabMan fork 版本：https://github.com/RehabMan/Clover
笔记本电脑第一指南：https://www.tonymacx86.com/threads/guide-booting-the-os-x-installer-on-laptops-with-clover.148093/


## 推荐配置

以下是有效的配置，其他任何都可能是错误的（有些边缘情况我宁愿不进入，因此使用 `可能`）。

首先列出的配置是更理想的。

完整的 hotpatch：

- 所有补丁都是通过 config.plist 完成的
- 只在 `ACPI/patched` 中附加 SSDT（例如没有修补的 DSDT/SSDT 补丁）
- `SortedOrder` 可以不指定
- `DropOem = false` 

部分 hotpatch：

- 在 `ACPI/patched` 中修补DSDT.aml 
- 仅在 `ACPI/patched` 中附加 SSDT（例如，没有修补的 SSDT）
- 使用 config.plist 重命名（应用于 `ACPI/patched` 和本机 SSDT 中）
- 未指定 `SortedOrder`
- `DropOem = false`

使用修补的 SSDT 的部分 hotpatch：

- 需要RehabMan Clover 
- 在 `ACPI/patched` 中修补DSDT.aml 
- 在 `ACPI/patched` 中选择修补的 SSDT（必须与从 `ACPI/origin` 提取到的同名）
- 附加 SSDT 也放在 `ACPI/patched` 中
- 重命名仍然可以用 `config.plist` 完成
- `SortedOrder` 未指定
- `config.plist/ACPI/AutoMerge=true`
- `DropOem = false`

完全修补的 DSDT + SSDT：

- 在 `ACPI/patched` 中修补 DSDT.aml 
- `ACPI/patched` 中的全套静态修补 OEM SSDT（原始名称来自 `ACPI/origin`）
- 附加 SSDT 也放在 `ACPI/patched`
-不推荐将重命名放在 `config.plist`（它们将仅适用于 DSDT.aml）
-设置 SSDT 加载顺序所需的 `SortedOrder`
- `DropOem = true`


## 浮动区域

在 ACPI中，一个 `OperationRegion` 可以定义一个 `MMIO` 区域，`SystemMemory` 区域，`EmbeddedControl` 区域，这些区域通常具有固定地址，仅取决于机器配置，BIOS 版本或 BIOS选项。有时，这些区域可能会随机或意外地发生变化。这被称为“浮动区域”。

由于通过修补 DSDT 和/或 SSDT，我们在给定时间点提供这些地址的快照，如果 BIOS 决定将这些区域放在不同的地址，它们可能不匹配。如果是这种情况，您可能会注意到某些功能间歇性地工作，或者其他似乎是随机的稳定性问题。

如果您有随机浮动区域，可以尝试 Clover 的 `FixRegions` 功能（`config.plist/ACPI/DSDT/Fixes/FixRegions=true`）。您可以在 Clover Wiki 中找到详细信息。注意：`FixRegions` 只能修复 DSDT 中的浮动区域。SSDT 中的浮动区域存在问题，除了不为随机浮动区域的 SSDT 提供修补的 SSDT 之外，没有其他好的解决方案。在修补的 SSDT 中处理浮动区域超出了本指南的范围。请注意，`FixRegions` 是相对错误的。它无法修复所有区域，有时可能会错误地“修复”区域。


# 资源

MaciASL (RehabMan fork): https://github.com/RehabMan/OS-X-MaciASL-patchmatic
patchmatic: https://github.com/RehabMan/OS-X-MaciASL-patchmatic
iasl (RehabMan fork): https://bitbucket.org/RehabMan/acpica/downloads
ACPI spec:
5.0a: http://acpi.info/spec.htm
Latest: http://www.uefi.org/specifications

RehabMan github: https://github.com/RehabMan?tab=repositories

Clover laptop guide: http://www.tonymacx86.com/yosemite-...oting-os-x-installer-laptops-clover-uefi.html
Clover config.plist files for laptops: https://github.com/RehabMan/OS-X-Clover-Laptop-Config

Clover thread: http://www.insanelymac.com/forum/topic/284656-clover-general-discussion/
Clover changes: http://www.insanelymac.com/forum/topic/304530-clover-change-explanations/

# 提供反馈

不要将此贴视为您的专用故障排除贴。如果您的特定笔记本电脑遇到特定问题，请开一个新的帖子。如果您在此处看到错误或希望做出贡献的内容，请回复此主题。

# 问题报告

请阅读上面的“提供反馈”。最好开一个新帖子。

在那个单独的主题中，清楚地描述你的问题。并提供相关数据...

阅读 FAQ, "Problem Reporting"
https://www.tonymacx86.com/threads/faq-read-first-laptop-frequent-questions.164990/
