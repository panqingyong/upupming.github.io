---
title: Gradle + Travis CI 学习笔记
date: 2018-04-03 23:07:53
categories: 
  - 编程语言
  - Java
tags:
  - java
  - gradle
  - travis ci
---

本文主要介绍了 Gradle 的使用，同时对相应的用于持续集成构建的 `travis.yml` 文件配置进行解读。

<!-- more  -->

## Gradle

### 安装
进入 [Release][1]<sup>[1]</sup> 界面下载 Gradle ，解压到新创建的`/opt/gradle`下：
``` bash
$ sudo mkdir /opt/gradle
$ sudo unzip -d /opt/gradle gradle-4.6-bin.zip
$ ls /opt/gradle/gradle-4.6
```

设置环境变量：
```bash
# 暂时设置
$ export PATH=$PATH:/opt/gradle/gradle-4.6/bin
# 永久全局设置
$ sudo vi /etc/environment
# 在 `PATH="..."` 中引号内末尾处加上 `:/opt/gradle/gradle-4.6/bin`
# 更新当前环境变量
$ . /etc/environment
```

查看 Gradle 版本：
```bash
$ gradle -v
WARNING: An illegal reflective access operation has occurred
WARNING: Illegal reflective access by org.codehaus.groovy.reflection.CachedClass (file:/opt/gradle/gradle-4.6/lib/groovy-all-2.4.12.jar) to method java.lang.Object.finalize()
WARNING: Please consider reporting this to the maintainers of org.codehaus.groovy.reflection.CachedClass
WARNING: Use --illegal-access=warn to enable warnings of further illegal reflective access operations
WARNING: All illegal access operations will be denied in a future release

------------------------------------------------------------
Gradle 4.6
------------------------------------------------------------

Build time:   2018-02-28 13:36:36 UTC
Revision:     8fa6ce7945b640e6168488e4417f9bb96e4ab46c

Groovy:       2.4.12
Ant:          Apache Ant(TM) version 1.9.9 compiled on February 2 2017
JVM:          9.0.4 (Oracle Corporation 9.0.4+11)
OS:           Linux 4.13.0-37-generic amd64

```
前面五行 warning 是因为最新的 java 9 为了更好地实现隐藏，后续将限制对`java.lang.Object.finalize()`的访问，而 Gradle 自带的 Groovy 库中的`org.codehaus.groovy.reflection.CachedClass`试图访问这个方法。<sup>[2] [3] [4] [5]</sup>

由于问题出在 Groovy 上，Gradle 无法去修复，只好直接镇压这个警告。
```bash
$ sudo vi /opt/gradle/gradle-4.6/bin/gradle
# 找到`DEFAULT_JVM_OPTS`，修改为：
DEFAULT_JVM_OPTS="--add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.lang.invoke=ALL-UNNAMED"
$ gradle -v

------------------------------------------------------------
Gradle 4.6
------------------------------------------------------------

Build time:   2018-02-28 13:36:36 UTC
Revision:     8fa6ce7945b640e6168488e4417f9bb96e4ab46c

Groovy:       2.4.12
Ant:          Apache Ant(TM) version 1.9.9 compiled on February 2 2017
JVM:          9.0.4 (Oracle Corporation 9.0.4+11)
OS:           Linux 4.13.0-37-generic amd64
```

+ With `--add-exports` the package is exported, meaning all public types and members therein are accessible at compile and run time.
+ With `--add-opens` the package is opened, meaning all types and members (not only public ones!) therein are accessible at run time.<sup>[4]</sup>
+ When setting `$readingmodule` to ALL-UNNAMED, all code from the class path can access that package.<sup>[3]</sup>

### 创建 Gradle Builds<sup>[6] [7] [8]</sup>

在项目根目录下，使用`init`命令初始化。
```bash
$ gradle init
Starting a Gradle Daemon (subsequent builds will be faster)

BUILD SUCCESSFUL in 8s
2 actionable tasks: 2 executed
```

```bash
vi gradle/wrapper/gradle-wrapper.properties 
# 避免运行 ./gradlew 时重复下载
# ./gradlew 可在没有安装 gradle 的系统下运行
distributionUrl=file\:/home/upupming/linux/software/gradle-4.6-all.zip
```

gradle 默认的 java 源文件目录是 `src/main/java`，比如这样的目录结构：
```bash
$ tree
└── src
    └── main
        └── java
            └── hello
                ├── Greeter.java
                └── HelloWorld.java
```
在`build.gradle`中加入 `apply plugin: 'java'`，进行 build 结果如下：
```bash
$ gradle build

BUILD SUCCESSFUL in 2s
2 actionable tasks: 2 executed
$ jar tvf build/libs/initial.jar
     0 Tue Apr 03 11:09:44 CST 2018 META-INF/
    25 Tue Apr 03 11:09:44 CST 2018 META-INF/MANIFEST.MF
     0 Tue Apr 03 11:09:44 CST 2018 hello/
   369 Tue Apr 03 11:09:44 CST 2018 hello/Greeter.class
   648 Tue Apr 03 11:09:44 CST 2018 hello/HelloWorld.class
```

而我当前项目的目录结构与上面完全不同。
```bash
$ tree -L 2
.
├── bin
│   ├── P1
│   ├── P2
│   └── P3
├── build.gradle
├── doc
├── gradle
│   └── wrapper
├── gradlew
├── gradlew.bat
├── settings.gradle
├── src
│   ├── P1
│   ├── P2
│   └── P3
└── test
    ├── P1
    ├── P2
    └── P3
```

`build.gradle`中可以设置许多属性，包括修改源文件目录，运行`build properties`可以查看所有属性。在官方文档中查到有这两个属性：
+ [`SourceSet`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/SourceSet.html)
    public interface SourceSet  
    A `SourceSet` represents a logical group of Java source and resources.  
    See the example below how `SourceSet` 'main' is accessed and how the `SourceDirectorySet` 'java' is configured to exclude some package from compilation.  
    ```gradle
    apply plugin: 'java'

    sourceSets {
        main {
            java {
                exclude 'some/unwanted/package/**'
            }
        }
    }
     ```
+ [`SourceDirectorySet`](https://docs.gradle.org/current/javadoc/org/gradle/api/file/SourceDirectorySet.html)
    public interface `SourceDirectorySet`   
    extends `FileTree`, `PatternFilterable`, `Named`, `Describable`  
A `SourceDirectorySet` represents a set of source files composed from a set of source directories, along with associated include and exclude patterns.

    `SourceDirectorySet` extends `FileTree`. The contents of the file tree represent the source files of this set, arranged in a hierarchy. The file tree is live and reflects changes to the source directories and their contents.

根据官方文档的说明<sup>[9]</sup>，修改`build.gradle`中 java 源文件目录。
```gradle
apply plugin: 'java'

sourceSets {
    main {
        java {
            srcDirs = ['src']
        }
    }
}
```
这样就可以成功 build 了。
<details><summary>build 输出（点击展开/折叠）</summary>
<p>
```bash
$ gradle build

BUILD SUCCESSFUL in 0s
2 actionable tasks: 2 up-to-date
$ jar tvf build/libs/Lab2-1160300625.jar 
     0 Tue Apr 03 12:41:58 CST 2018 META-INF/
    25 Tue Apr 03 10:33:56 CST 2018 META-INF/MANIFEST.MF
     0 Tue Apr 03 12:41:58 CST 2018 P1/
     0 Tue Apr 03 12:41:58 CST 2018 P1/graph/
  4629 Tue Apr 03 12:41:58 CST 2018 P1/graph/ConcreteEdgesGraph.class
  5161 Tue Apr 03 12:41:58 CST 2018 P1/graph/ConcreteVerticesGraph.class
  1644 Tue Apr 03 12:41:58 CST 2018 P1/graph/Edge.class
   744 Tue Apr 03 12:41:58 CST 2018 P1/graph/Graph.class
  2479 Tue Apr 03 12:41:58 CST 2018 P1/graph/Vertex.class
     0 Tue Apr 03 12:41:58 CST 2018 P1/poet/
  2982 Tue Apr 03 12:41:58 CST 2018 P1/poet/GraphPoet.class
  1364 Tue Apr 03 12:41:58 CST 2018 P1/poet/Main.class
     0 Tue Apr 03 12:41:58 CST 2018 P2/
  2696 Tue Apr 03 12:41:58 CST 2018 P2/FriendshipGraph.class
   997 Tue Apr 03 12:41:58 CST 2018 P2/Person$Color.class
   555 Tue Apr 03 12:41:58 CST 2018 P2/Person.class
     0 Tue Apr 03 12:41:58 CST 2018 P3/
   715 Tue Apr 03 12:41:58 CST 2018 P3/BusSegment.class
  3180 Tue Apr 03 12:41:58 CST 2018 P3/Itinerary.class
  3908 Tue Apr 03 12:41:58 CST 2018 P3/RoutePlanner.class
   179 Tue Apr 03 12:41:58 CST 2018 P3/RoutePlannerBuilder.class
  4096 Tue Apr 03 12:41:58 CST 2018 P3/RoutePlannerBuilderImplementation.class
  1157 Tue Apr 03 12:41:58 CST 2018 P3/RoutePlannerImplementation$Color.class
  3623 Tue Apr 03 12:41:58 CST 2018 P3/RoutePlannerImplementation.class
   317 Tue Apr 03 12:41:58 CST 2018 P3/Stop.class
  2840 Tue Apr 03 12:41:58 CST 2018 P3/StopTime.class
   192 Tue Apr 03 12:41:58 CST 2018 P3/TripSegment.class
   654 Tue Apr 03 12:41:58 CST 2018 P3/WaitSegment.class
```
</p>
</details>

在 build.gradle 中加入`apply plugin: 'application'`，可以运行 java 程序。
```gradle
apply plugin: 'application'
mainClassName = 'P3.RoutePlanner'
run {
    // 使用标准输入
    standardInput = System.in
}
```

```bash
$ gradle run
> Task :run 
provide the filename of the data file(default: all_stop_times.txt): 
<=<=========----> 75% EXECUTING [21s]
> :run
```
接下来会根据用户输入一直运行下去，直到程序返回 0 退出。

### Build 之后

<details><summary>最终的`build.gradle`（点击展开/折叠）</summary>
<p>
```gradle
/*
 * This file was generated by the Gradle 'init' task.
 *
 * This is a general purpose Gradle build.
 * Learn how to create Gradle builds at https://guides.gradle.org/creating-new-gradle-builds/
 */

apply plugin: 'java'

/* for runnig interaction
apply plugin: 'application'
mainClassName = 'P3.RoutePlanner'
run {
    // 使用标准输入
    standardInput = System.in
}
*/

// Customization of MANIFEST
sourceCompatibility = 1.8
version = '1.0'

// Dependencies
repositories {
    mavenCentral()
}
dependencies {
    testCompile group: 'junit', name: 'junit', version: '4.+'
    // or "testCompile "junit:junit:4.+"
}
sourceSets {
    main {
        java {
            srcDirs = ['src']
        }
    }
    test {
        java {
            srcDirs =  ['test']
        }
    }
}
```
</p>
</details>

<details><summary>build 文件夹目录结构（点击展开/折叠）</summary>
<p>
```bash
$ tree build
build
├── classes
│   └── java
│       ├── main
│       │   ├── P1
│       │   │   ├── graph
│       │   │   │   ├── ConcreteEdgesGraph.class
│       │   │   │   ├── ConcreteVerticesGraph.class
│       │   │   │   ├── Edge.class
│       │   │   │   ├── Graph.class
│       │   │   │   └── Vertex.class
│       │   │   └── poet
│       │   │       ├── GraphPoet.class
│       │   │       └── Main.class
│       │   ├── P2
│       │   │   ├── FriendshipGraph.class
│       │   │   ├── Person.class
│       │   │   └── Person$Color.class
│       │   └── P3
│       │       ├── BusSegment.class
│       │       ├── Itinerary.class
│       │       ├── RoutePlannerBuilder.class
│       │       ├── RoutePlannerBuilderImplementation.class
│       │       ├── RoutePlanner.class
│       │       ├── RoutePlannerImplementation.class
│       │       ├── RoutePlannerImplementation$Color.class
│       │       ├── Stop.class
│       │       ├── StopTime.class
│       │       ├── TripSegment.class
│       │       └── WaitSegment.class
│       └── test
│           ├── P1
│           │   ├── graph
│           │   │   ├── ConcreteEdgesGraphTest.class
│           │   │   ├── ConcreteVerticesGraphTest.class
│           │   │   ├── GraphInstanceTest.class
│           │   │   └── GraphStaticTest.class
│           │   └── poet
│           │       └── GraphPoetTest.class
│           ├── P2
│           │   └── FriendshipGraphTest.class
│           └── P3
│               └── RoutePlannerTest.class
├── libs
│   └── Lab2-1160300625-1.0.jar
├── reports
│   └── tests
│       └── test
│           ├── classes
│           │   ├── P1.graph.ConcreteEdgesGraphTest.html
│           │   ├── P1.graph.ConcreteVerticesGraphTest.html
│           │   ├── P1.graph.GraphStaticTest.html
│           │   ├── P1.poet.GraphPoetTest.html
│           │   ├── P2.FriendshipGraphTest.html
│           │   └── P3.RoutePlannerTest.html
│           ├── css
│           │   ├── base-style.css
│           │   └── style.css
│           ├── index.html
│           ├── js
│           │   └── report.js
│           └── packages
│               ├── P1.graph.html
│               ├── P1.poet.html
│               ├── P2.html
│               └── P3.html
├── test-results
│   └── test
│       ├── binary
│       │   ├── output.bin
│       │   ├── output.bin.idx
│       │   └── results.bin
│       ├── TEST-P1.graph.ConcreteEdgesGraphTest.xml
│       ├── TEST-P1.graph.ConcreteVerticesGraphTest.xml
│       ├── TEST-P1.graph.GraphStaticTest.xml
│       ├── TEST-P1.poet.GraphPoetTest.xml
│       ├── TEST-P2.FriendshipGraphTest.xml
│       └── TEST-P3.RoutePlannerTest.xml
└── tmp
    ├── compileJava
    ├── compileTestJava
    └── jar
        └── MANIFEST.MF
```

</p>
</details>


### 在 Eclipse 中用 Gradle Builder 替代默认的 Java Builder

之前创建项目时选的是 Java Project 而不是 Gradle Project ，因此 Eclipse 并不会使用 Gradle Builder 去运行项目，右键点击项目名，在 Properties > Builders 下可以看到现在项目的 Builder 是 **Java Builder**。

|<img src="new-java-project.png" width="400">|<img src="java-builders.png" width="500">|
|-|-|
|||

要想把 Java Project 转换为 Gradle Project ，先要在 Help -> Eclipse Market 中搜索并安装`Buildship Gradle Intergration 2.0`，在[最新版的 Eclipse 已经预装了这个插件](https://projects.eclipse.org/projects/tools.buildship)。然后在项目右键菜单中选择 Configure > Add Gradle Nature。
<img src="java-to-gradle.png">

现在再打开 Properties > Builders 将可以看到增加了 **Gradle Project Builder** ，可以顺手删掉 Java Builder 了，删不掉的话可以直接修改根目录的 `.project`文件，删除与 Java Builder 相关的定义。
<img src="Gradle-Project-Builder.png" width="500">  

在以后创建新项目的时候可以直接选择 Gradle Project ，这样可以免去后续的烦恼。 Eclipse + Gradle 用起来的感觉跟 Android Studio 一样，有什么依赖直接在 `build.gradle`中声明即可， Gradle 会自动联网下载依赖。当一个项目在合作者之间传递时，这种方法最简洁，也能避免很多依赖错误。

注意：如果在 `build.gradle` 新加入了依赖（dependencies），应该在 Eclipse 中更新依赖，具体方法：右击项目 -> Gradle -> Refresh Gradle Project，见下图。

<img src="refresh-dependency.png">

<details><summary>最终我的 <code>.project</code> 文件（点击展开/折叠）</summary>
<p>
```xml
<?xml version="1.0" encoding="UTF-8"?>
<projectDescription>
	<name>Lab2-1160300625</name>
	<comment></comment>
	<projects>
	</projects>
	<buildSpec>
		<buildCommand>
			<name>org.eclipse.buildship.core.gradleprojectbuilder</name>
			<arguments>
			</arguments>
		</buildCommand>
	</buildSpec>
	<natures>
		<nature>org.eclipse.jdt.core.javanature</nature>
		<nature>org.eclipse.buildship.core.gradleprojectnature</nature>
	</natures>
</projectDescription>
```
</p>
</details>

<details><summary><code>.classpath</code> 文件：（点击展开/折叠）</summary>
<p>
```xml
<?xml version="1.0" encoding="UTF-8"?>
<classpath>
	<classpathentry kind="src" output="bin/main" path="src">
		<attributes>
			<attribute name="gradle_scope" value="main"/>
			<attribute name="gradle_used_by_scope" value="main,test"/>
		</attributes>
	</classpathentry>
	<classpathentry kind="src" output="bin/test" path="test">
		<attributes>
			<attribute name="gradle_scope" value="test"/>
			<attribute name="gradle_used_by_scope" value="test"/>
		</attributes>
	</classpathentry>
	<classpathentry kind="con" path="org.eclipse.jdt.launching.JRE_CONTAINER/org.eclipse.jdt.internal.debug.ui.launcher.StandardVMType/JavaSE-1.8/"/>
	<classpathentry kind="con" path="org.eclipse.buildship.core.gradleclasspathcontainer"/>
	<classpathentry kind="output" path="bin/default"/>
</classpath>
```
</p>
</details>

## Travis CI

在项目根目录下新建一个`.travis.yml`文件。<sup>[10] [11]</sup>

<details><summary>文件内容（点击展开/折叠）</summary>
<p>
```yml
language: java

jdk: oraclejdk8

before_install: chmod +x gradlew

## Travis CI installs dependencies using
# gradle assemble
## You can specify your own script to run to install whatever dependencies
## your project requires
# install: ./install-dependencies.sh

## If your project contains a build.gradle file in the repository root,
## Travis CI builds your project with Gradle:
# gradle check
## If your project also includes the gradlew wrapper script in the
## repository root, Travis CI uses that wrapper instead:
# ./gradlew check
## To use a different script command:
# script: bundle exec thor build
## or:
# script:
# - bundle exec rake build
# - bundle exec rake builddoc

## A peculiarity of dependency caching in Gradle means that to avoid
## uploading the cache after every build you need to add the following
## lines to your .travis.yml
before_cache:
  - rm -f  $HOME/.gradle/caches/modules-2/modules-2.lock
  - rm -fr $HOME/.gradle/caches/*/plugin-resolution/
cache:
  directories:
    - $HOME/.gradle/caches/
    - $HOME/.gradle/wrapper/
```
</p>
</details>

+ `languge: java`

    使用 java 语言
    
+ `jdk: oraclejdk8`

    使用`oraclejdk8`进行测试。可以定义多个不同的jdk版本。
+ `before_install: chmod +x gradlew`
    
    由于在`script`阶段，默认运行`./gradlew check`。如果不加入这句命令， Travis-CI 会出现下面的错误：
    ```bash
    $ ./gradlew assemble
    /home/travis/.travis/job_stages: line 236: ./gradlew: Permission denied
    The command "eval ./gradlew assemble " failed. Retrying, 2 of 3.
    /home/travis/.travis/job_stages: line 236: ./gradlew: Permission denied
    The command "eval ./gradlew assemble " failed. Retrying, 3 of 3.
    /home/travis/.travis/job_stages: line 236: ./gradlew: Permission denied
    The command "eval ./gradlew assemble " failed 3 times.
    The command "./gradlew assemble" failed and exited with 126 during .
    Your build has been stopped.
    ```
    
+ `install`

    安装项目所需的依赖。
+ `script`

    运行 build 脚本。
    
    在 Gradle 部分，我为了免去下载环节，修改了`gradle/wrapper/gradle-wrapper.properties`，在这里要改回来：
    ```
    distributionUrl=https\://services.gradle.org/distributions/gradle-4.6-bin.zip
    ```
+ `before_cache`
    
    清除缓存。
+ `cache`

    缓存数据，加速下次 build 。

更详细的说明参见 [The Build Lifecycle][10]。

## 总结

+ 通过本地 Gradle build，生成可复用的 jar 文件，并进行测试。
+ 配置 Travis CI ，每次 push 到 github 时都会自动进行 build 。

## 参考资料

1. [Gradle | Releases][1]
2. [Upgrade to Groovy 2.4.12 for full Java 9 compatibility · Issue #2995 · gradle/gradle · GitHub][2]
3. [Java 9 Migration Guide: The Seven Most Common Challenges - blog@CodeFX][3]
4. [command line arguments - What's the difference between --add-exports and --add-opens in Java 9? - Stack Overflow][4]
5. [JEP 261: Module System][5]
6. [Creating New Gradle Builds][6]
7. [Getting Started · Building Java Projects with Gradle][7]
8. [Java Quickstart - Gradle User Manual][8]
9. [The Java Plugin - Gradle User Manual][9]
10. [Customizing the Build - Travis CI][10]
11. [asciidoctor-gradle-examples/.travis.yml at master · asciidoctor/asciidoctor-gradle-examples · GitHub][11]


[1]: https://gradle.org/releases/?_ga=2.82650902.1840912706.1522639288-1232711416.1522402180
[2]: https://github.com/gradle/gradle/issues/2995
[3]: https://blog.codefx.org/java/java-9-migration-guide/#Illegal-Access-To-Internal-APIs
[4]: https://stackoverflow.com/questions/44056405/whats-the-difference-between-add-exports-and-add-opens-in-java-9
[5]: http://openjdk.java.net/jeps/261
[6]: https://guides.gradle.org/creating-new-gradle-builds
[7]: https://spring.io/guides/gs/gradle/
[8]: https://docs.gradle.org/current/userguide/tutorial_java_projects.html
[9]: https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_project_layout
[10]: https://docs.travis-ci.com/user/customizing-the-build#The-Build-Lifecycle
[11]: https://github.com/asciidoctor/asciidoctor-gradle-examples/blob/master/.travis.yml

