var title = require('url-to-title');

title([
    'https://gradle.org/releases/?_ga=2.82650902.1840912706.1522639288-1232711416.1522402180',
    'https://github.com/gradle/gradle/issues/2995',
    'https://blog.codefx.org/java/java-9-migration-guide/#Illegal-Access-To-Internal-APIs',
    'https://stackoverflow.com/questions/44056405/whats-the-difference-between-add-exports-and-add-opens-in-java-9',
    'http://openjdk.java.net/jeps/261',
    'https://guides.gradle.org/creating-new-gradle-builds',
    'https://spring.io/guides/gs/gradle/',
    'https://docs.gradle.org/current/userguide/tutorial_java_projects.html',
    'https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_project_layout',
    ' https://docs.travis-ci.com/user/customizing-the-build#The-Build-Lifecycle',
    ' https://github.com/asciidoctor/asciidoctor-gradle-examples/blob/master/.travis.yml']).then(function (titles) {
        for(let i = 0; i < titles.length; i++){
            console.log((i+1)+ ". [" + titles[i] + "][" + (i+1) +"]");
    }
})