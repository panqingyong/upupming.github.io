/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/2018/02/28/build-hexo/Force-HTTPS.png","b117ab9b09cb99f20605ffc3230c0d92"],["/2018/02/28/build-hexo/OAuth-App.png","88bf31ef5f24225bc0cc86e41ab67eed"],["/2018/02/28/build-hexo/SSL-Full.png","b26cbcceab3ff4ebc906615094287c6f"],["/2018/02/28/build-hexo/index.html","c7910c34dd8906819bc50a46775c7b8c"],["/2018/03/05/blurring-disciplinary-boundaries/index.html","a18d9d6105cf4c2f36ceb806f38e9b79"],["/2018/03/12/the-nature-of-research/focs_1.jpg","7d80f43f9512d373c8177ac356471aef"],["/2018/03/12/the-nature-of-research/focs_hdr.jpg","b1ed57c3501ad4c27e2e7e1c82010901"],["/2018/03/12/the-nature-of-research/index.html","36cc874af20ee0e1f356e3cf7a3b41fa"],["/2018/03/26/java-equals-type-safety/index.html","aabf7989c8a60b9ee8c84c0f51464e72"],["/2018/03/26/java-equals-type-safety/java.png","7b7786621d805ee5e9d27d89fe8fce68"],["/2018/04/03/gradle-travis/Gradle-Project-Builder.png","eb139a2cf539553f18c58d2099c8a3e9"],["/2018/04/03/gradle-travis/index.html","f6f0ad141f80c9a704a2bbf2df7c5ce4"],["/2018/04/03/gradle-travis/install-buildship.png","ce33be56b7eb2354993e8fd0d53bc2ae"],["/2018/04/03/gradle-travis/java-builders.png","c788501725500bfb7b19fde03d97e35f"],["/2018/04/03/gradle-travis/java-to-gradle.png","14406b6603c2d9b32efeb3d01604c77a"],["/2018/04/03/gradle-travis/new-java-project.png","135720a9992b1c25b3783402c031c189"],["/2018/04/03/gradle-travis/refresh-dependency.png","e80d2bf0923ae5ba08b6904caacf3f4f"],["/2018/04/08/beautify-hexo-SEO-travis/@-dns.png","972b600a70753365aa1bd5ce08fcc1ad"],["/2018/04/08/beautify-hexo-SEO-travis/A-records.png","9c7d788dfa6714f93383180324a23de4"],["/2018/04/08/beautify-hexo-SEO-travis/GitHub-System-Status-2015.png","a40b5417665b61169137b8b1079ca4c6"],["/2018/04/08/beautify-hexo-SEO-travis/add-to-home.png","687245515353b90326b38e9b317b2bb8"],["/2018/04/08/beautify-hexo-SEO-travis/android-chrome.jpg","c25b9cc7bed975d182d5d4a639de13d0"],["/2018/04/08/beautify-hexo-SEO-travis/android-pwa.jpg","6edb7ac72d1173cc0e8a77c22ca24e08"],["/2018/04/08/beautify-hexo-SEO-travis/baidu-100.png","0b4705b1de07f95d0fca471519051251"],["/2018/04/08/beautify-hexo-SEO-travis/baidu-ok.png","f9d754ff0fc1bfce07e77096101729e5"],["/2018/04/08/beautify-hexo-SEO-travis/baidusitemap-ok.png","5758e3299f089100923c90934a71137d"],["/2018/04/08/beautify-hexo-SEO-travis/blog-dns.png","ab2072d9439cafd5ac36d73f96bc72ed"],["/2018/04/08/beautify-hexo-SEO-travis/chrome-app.png","aeb5d6be4c7d37a0a58644ebc02220f9"],["/2018/04/08/beautify-hexo-SEO-travis/cloudflare-cache.png","42488dab5560be8bb3b7b6d47883024f"],["/2018/04/08/beautify-hexo-SEO-travis/custom-fav.png","ffc1b2d00d043ec5a16cfc01a35e7afb"],["/2018/04/08/beautify-hexo-SEO-travis/fav-checker.png","8ca2616c4533588d863d0eaf1555d777"],["/2018/04/08/beautify-hexo-SEO-travis/git-page-ci.png","03d2da3d44a3369335119983e4084929"],["/2018/04/08/beautify-hexo-SEO-travis/gitlab-succeed.png","a34eb667e7ba8d2afcda9a7577f8221b"],["/2018/04/08/beautify-hexo-SEO-travis/gitlab-token.png","6694325a815cca433f5e46cbe7873148"],["/2018/04/08/beautify-hexo-SEO-travis/index.html","67e8b49fcc63b08ccce2b27fe728f482"],["/2018/04/08/beautify-hexo-SEO-travis/remove-fork.png","a11b851da8d559698f3c4cc39cc192f1"],["/2018/04/08/beautify-hexo-SEO-travis/travis-setting.png","69cdd2405cbb8448b1c4bc9fdaf50c75"],["/2018/04/08/beautify-hexo-SEO-travis/youpai-CNAME.png","f836935cf27651e2d6ed55b5ce41b716"],["/2018/04/08/beautify-hexo-SEO-travis/youpai-config.png","eeab7bafb97030c8760b31bf098aab3d"],["/2018/05/07/java-try-catch-examples/finally_block_does_not_complete_normally.png","b52c2d31e9f87824e1ab51ec7c8f1e4d"],["/2018/05/07/java-try-catch-examples/index.html","49d8c78cd92396cf58f9b65e84cd2f5f"],["/2018/05/10/cloudflare-subdomain-SSL/index.html","1074fe39497fdba70d24d3a34cc00a62"],["/2018/05/10/cloudflare-subdomain-SSL/subdomain-not-covered.png","012c7dc4a027c87b2b3c7285adbbea2f"],["/2018/05/31/git-submodules/fixed.png","f7d5f9cb6d0a144ae969953744929382"],["/2018/05/31/git-submodules/index.html","4bf6e8b89b4dddf039efb140df0b1bd7"],["/2018/05/31/git-submodules/submodule-cannot-be-opened.png","8f7c6c5e0e4f6046dbd77a0c426c2684"],["/2018/06/04/java-UML/aggregation.png","70d82a028d5399faef00a9dab2a33c63"],["/2018/06/04/java-UML/association.png","d0533026f4dca5017bc5eaa9b4bdace0"],["/2018/06/04/java-UML/composition.png","0d7bc27cbf54f428dacd1d7b3658d3cc"],["/2018/06/04/java-UML/customer_account.png","1b22a73987a8db4b302ba8113384097b"],["/2018/06/04/java-UML/dependency.png","b5f5840a75022ab2f524e1422ae6e307"],["/2018/06/04/java-UML/example_class.png","2355fbbbfbd76ef39fe77e34a89c896c"],["/2018/06/04/java-UML/example_class.svg","617dbf6f1aaf9bc63350c3ff66657ca3"],["/2018/06/04/java-UML/generalization.png","63c292f482f1ae8487cbcf90ca512c66"],["/2018/06/04/java-UML/index.html","09b79ffaf75b755bb80e1745e84beaa8"],["/2018/06/04/java-UML/note.png","39b15572714471a0ef712373340d3bd2"],["/2018/06/04/java-UML/player_achievement.png","53c148a855d604c5d8caec40ede9d459"],["/2018/06/04/java-UML/realization.png","7df2a41166fc024fa1555d0df15e2a0f"],["/2018/06/14/6.031-concurrency/index.html","971a1c7e29132e48c44c23beb9828536"],["/2018/06/14/6.031-concurrency/message-passing-bank-account.png","7fcc578cc783d010176f77517cffe612"],["/2018/06/14/6.031-concurrency/message-passing-race-condition.png","e2dc8158b035c356025caf8160645aba"],["/2018/06/14/6.031-concurrency/message-passing.png","fb0b4ab0f90e1926a7667ab98aa741d8"],["/2018/06/14/6.031-concurrency/shared-memory-bank-account.png","29480f47a80fd8fe08acc25c16f78030"],["/2018/06/14/6.031-concurrency/shared-memory.png","f813c55964fe062ce196d502a26419f9"],["/2018/06/14/6.031-concurrency/time-slicing.png","cfbf984b2ca815614b659f8e140ee468"],["/2018/06/14/6.031-thread-safety/clear-insert-race.png","5a845868d7dcef3cc7909fd5024dd6fe"],["/2018/06/14/6.031-thread-safety/confinement-0.png","94c713f1d8eec893767e52dad8e938cb"],["/2018/06/14/6.031-thread-safety/confinement-1.png","df38df866b0a01612ebe966180228bf2"],["/2018/06/14/6.031-thread-safety/confinement-2.png","9ac121a6b286b4a150c4385e6d032f4f"],["/2018/06/14/6.031-thread-safety/confinement-3.png","23d2f6a68fbd2bab61f4036443de776c"],["/2018/06/14/6.031-thread-safety/confinement-4.png","52aca0823a6cb776293b20f806216e6b"],["/2018/06/14/6.031-thread-safety/index.html","d6958ec018e2c30e6506c25d008e8505"],["/2018/06/14/6.031-thread-safety/insert-followed-by-clear.png","eb7d9e4b748c4c5ce691645d031e0b71"],["/2018/06/15/6.031-locks-and-synchronization/deadlock.png","7308e875713487bee9b5c02aaebaa948"],["/2018/06/15/6.031-locks-and-synchronization/index.html","94e06acba3b16d670f2660495d745d52"],["/2018/06/15/6.031-locks-and-synchronization/locks-bank-account.png","17948c051fe5b7f47e23b865c3196f3f"],["/2018/06/15/6.031-locks-and-synchronization/shared-memory-bank-account.png","4bdb2a1931a66d89626697757f86cae0"],["/2018/06/18/java-design-patterns-1/added-adapter.png","d21f561db8a64b66b74f97f0e4c0b4ed"],["/2018/06/18/java-design-patterns-1/before-change.png","6ec835bf52e98a49c2500540cb7d7f13"],["/2018/06/18/java-design-patterns-1/change-incompatible.png","ebe4fc5c5578503b7442099eb0776aed"],["/2018/06/18/java-design-patterns-1/decorator-uml.png","f9d2a69b3f82d4b9d3407772d5088418"],["/2018/06/18/java-design-patterns-1/facade-uml.png","4b4c70662eac01f6c086e3f103c7bf2b"],["/2018/06/18/java-design-patterns-1/index.html","508a21a0297923288c07bae0343ece47"],["/2018/06/18/java-design-patterns-1/iterator-uml.png","42d36a5af9eb4fc85d0c8dbc8cd616d5"],["/2018/06/18/java-design-patterns-1/list-of-patterns.png","097cd8513af0d4454f58eda9fce0c47a"],["/2018/06/18/java-design-patterns-1/template-uml.png","59ae856512d4c2ec30baf4443aa8a7f7"],["/2018/06/19/java-design-patterns-2/abstract-factory-uml.png","ba06f3a3122eba79b5506857a717b64f"],["/2018/06/19/java-design-patterns-2/after-mediator.png","01438356c03a92697a31b817eefa2f87"],["/2018/06/19/java-design-patterns-2/before-mediator.png","599363d74ccf7f0e54cf314e0a462607"],["/2018/06/19/java-design-patterns-2/bridge-car-uml.png","d1492de3cd9c2c77fa266a173531d631"],["/2018/06/19/java-design-patterns-2/bridge-uml.png","b845aacceddcb9c9f297e93d6fabe7d4"],["/2018/06/19/java-design-patterns-2/bridge.png","d7223b32682562843655bb45b302b97a"],["/2018/06/19/java-design-patterns-2/builder-uml.png","35cc6e2689e4636c063a50c22a39fd54"],["/2018/06/19/java-design-patterns-2/chain-of-responsibility-uml.png","acf73cc8df228cac9702bda86501ca35"],["/2018/06/19/java-design-patterns-2/command-uml.png","d9a8fb8a47154f3085f0cca2f4428014"],["/2018/06/19/java-design-patterns-2/composite-and-leaf.png","96b0993048fb93d5aa118885ba6dbd03"],["/2018/06/19/java-design-patterns-2/composite-uml.png","f213e90e18f8ebc4c6913600892b43d0"],["/2018/06/19/java-design-patterns-2/creational-patterns.png","7f75cc9e16b88643d1237475acf23551"],["/2018/06/19/java-design-patterns-2/factory-method-uml.png","b6d2d146ac5a6f89898a91896f9f9b43"],["/2018/06/19/java-design-patterns-2/index.html","6e1fc353d5f5a2e1970b2b1653b37031"],["/2018/06/19/java-design-patterns-2/mediator-uml.png","52055a78b7652840e56db5be5fb11911"],["/2018/06/19/java-design-patterns-2/observer-impl-uml.png","8083ad6d02b2469fc0a4c6ff888d341b"],["/2018/06/19/java-design-patterns-2/observer-uml.png","ec992bf95b9d43cd6994f5f84fa2aeb6"],["/2018/06/19/java-design-patterns-2/proxy-uml.png","a08398e48288a10157ae42fbb05780a8"],["/2018/06/19/java-design-patterns-2/strategy.png","33402dd0ef8e7b3a5388564e7c755f57"],["/2018/06/19/java-design-patterns-2/visitor-uml.png","226dfc1e1df53145bd9fe0aac3c98ba9"],["/2018/06/22/abstraction-functions-and-rep-invariants/index.html","a4898b5a8fd51abcd881e740f0506e88"],["/2018/06/22/multi-dimensional-software-views/ci.png","ec3b969ae786f36674ddbf1e2dc80542"],["/2018/06/22/multi-dimensional-software-views/component-diagram.png","3e649405c2658744e8254f1153cdacac"],["/2018/06/22/multi-dimensional-software-views/deployment-diagram.png","9fe6b4a49de4f1e52cf60151551fcd50"],["/2018/06/22/multi-dimensional-software-views/github-diff.png","7d1b65d5d7d1f2c2a494b292f4c2a53c"],["/2018/06/22/multi-dimensional-software-views/index.html","c13a58c4538023a95c3bdbe9aa1fccfd"],["/2018/06/22/multi-dimensional-software-views/node-files.png","a2a49436dcf5f9b19c73cf70ab6ac7d3"],["/2018/06/22/multi-dimensional-software-views/proxy-uml.png","a08398e48288a10157ae42fbb05780a8"],["/2018/06/22/multi-dimensional-software-views/snapshot.png","371bf906da587c6091fd46e12d6f5620"],["/2018/06/27/information-security-intro-review/index.html","4bf6b0ec7f39db5d58727a86d66b4cbd"],["/2018/06/27/information-security-intro-review/snort.png","186c60f13f89c822c60babbdbbd94c3d"],["/2018/06/27/information-security-intro-review/windows-network-authentication.jpg","9c5a45f1e4bc38ac827515ef684e4c1c"],["/2018/07/23/mini-program-i18n/index.gif","9c2e2c8dd3e0297b162dbc8ed204b4f5"],["/2018/07/23/mini-program-i18n/index.html","5a0750e4219280a688a97693a0344058"],["/2018/07/23/mini-program-i18n/tabbar-and-title.gif","d5e447689ab2080a07e44002d997d981"],["/2018/07/23/mini-program-i18n/work.gif","109ccb616e4119300001e0dbf1487d1f"],["/2018/09/11/mini-program-developing/first-commit.png","577882f3a13b086560055c6776b50b22"],["/2018/09/11/mini-program-developing/index.html","20ff9d64e1c60e528a4eee739e94f5f0"],["/2018/10/18/katex-test/index.html","0cafd3892ba2b75b9adb90d31df77588"],["/2018/10/27/logistic-regression/images/equation-30.png","d89ad2d934b8cfeeb5a2a24bcdca119d"],["/2018/10/27/logistic-regression/images/gradient-ascent-20-0.0.png","a9bf5202fdab6db40fb1f846e708c835"],["/2018/10/27/logistic-regression/images/gradient-ascent-20-1.2.png","48236c6c19237c84bf25411ded7713d9"],["/2018/10/27/logistic-regression/images/gradient-ascent-200-0.0.png","48fe7d4ff10f3caca6cfa6bbe664ed24"],["/2018/10/27/logistic-regression/images/gradient-ascent-200-1.2.png","e7b6ae94c824d4c66ba8e21d991387f1"],["/2018/10/27/logistic-regression/images/newton-method-20-0.0.png","6f90aa5b85bfa75c46b59083967708f2"],["/2018/10/27/logistic-regression/images/newton-method-20-1.2.png","453ef32983893193ae77dacf2d437d13"],["/2018/10/27/logistic-regression/images/newton-method-200-0.0.png","f49dba14d93fa79db969b70d7df270a9"],["/2018/10/27/logistic-regression/images/newton-method-200-1.2.png","21bc04da5200301259c0aaabe99a969b"],["/2018/10/27/logistic-regression/images/newton-method-400-0.0.png","fdfd507a9be640f8eb41ed0f11746b63"],["/2018/10/27/logistic-regression/images/newton-method-400-1.2.png","026a9db972bd480b017130d568ade58f"],["/2018/10/27/logistic-regression/images/newton-method-42-0.0.png","7335f3d1adc3fe8ea9549aa77c5d49ef"],["/2018/10/27/logistic-regression/index.html","0177ac3b846207fe3b915a09b1cb6e3b"],["/2018/12/27/fourier-transform/index.html","0904187882c5af211f485c372e6b0293"],["/2018/12/31/eigenvalues-and-eigenvectors/index.html","b4b3e435e7c28b3dbb3f21995da31a86"],["/2019/01/01/determinant/index.html","0ce58c45cbeef858c0cf4865e0fb9218"],["/2019/01/05/probability-basis/index.html","16dfdb5bc15189d78c81f65899ce4bc6"],["/2019/01/29/2019-mcm-summary/index.html","28973e2933513ed5e6653809ac07378a"],["/2019/03/20/inequality-in-randomized-algorithm/index.html","ad9ec8a24cb319bcf3ac30a03ebe0dac"],["/2019/03/20/las-vegas-monte-carlo-yao-etc/index.html","286101ea076941168f724c0b61dd027e"],["/2019/03/24/china-network-status/index.html","9fd7b7118e6b4b74bd6ca41642ffadad"],["/2019/03/30/arithmetic-coding/index.html","e7843574dfb47465f81f4418939b9237"],["/2019/04/30/bypass-gfw/index.html","68ab4a9bce550582eba8e601ee7d4887"],["/2019/04/30/chernoff-bound-and-martingle/index.html","134349220f8ad92d1b42bee968c1baeb"],["/2019/05/04/randomized-algorithm-ex2/index.html","42d1adcf80931c974c6d91c36dc6f24c"],["/2019/05/09/git-ssh-socks-proxy/index.html","e172d90a3dcbae30a0d6d32d6afae382"],["/2019/05/18/hit-compilers-exam-2019/index.html","6222d6fcf05553d01ec9f2e3d7ecf182"],["/2019/06/17/weibo-emoji-dataset/index.html","68669bb4e747ca3ad922b2ed28c9154d"],["/2019/06/23/info-hide/index.html","4170cb4011d76b1a7ee5008b2e7f29af"],["/2019/06/29/random-algorithm-review/index.html","ccf5dd3a5c00507c0dae71ba4f2ed1bb"],["/2019/09/29/2020-bao-yan/index.html","05fff9626158c90648abcfc81ff2bf4a"],["/2019/11/12/front-end-interview-preparation/index.html","e7ced5ebdc82894d05662e0221d45306"],["/2020/04/08/how-to-write-javadoc/String-1.png","a6b107086ae95cc88bc447fdcf7570c8"],["/2020/04/08/how-to-write-javadoc/String-2.png","aee2fce8d745f4a1ea117fa2988c8d31"],["/2020/04/08/how-to-write-javadoc/generate.png","5e55d475edc2c053140da83fb483bc9f"],["/404.html","1b378d80c5b45d7943ed196c99b44512"],["/about/index.html","4503d408b3626c5b3771b25a02663aaf"],["/apple-touch-icon.png","492fcef54e344440dde254d6b9be38d9"],["/archives/2018/02/index.html","5c41cb0e8bf4a1d549417096b2074d8e"],["/archives/2018/03/index.html","870de57ed1c19ec59262a629b8a3cee4"],["/archives/2018/04/index.html","4f630671af225d354610aeb5355c1c81"],["/archives/2018/05/index.html","baf0310f7dced413842df5acbb0fd22a"],["/archives/2018/06/index.html","d374e8b57288b063ac425f8cbed1c929"],["/archives/2018/07/index.html","09ef2d2d3f699b05df3eeefb5cb987c4"],["/archives/2018/09/index.html","6b5ea3b6922bbdd0b81eb08087a7562c"],["/archives/2018/10/index.html","171875e0eaff4f3f659957d363cebd03"],["/archives/2018/12/index.html","88041b1610f61f69bda902b8da9e3397"],["/archives/2018/index.html","f40c330cf90c8b3a3c8b4a269672c5b2"],["/archives/2019/01/index.html","17f93978a09aff37a84f004b1f40a929"],["/archives/2019/03/index.html","488fe8787519c04e74b7e9dd109c976d"],["/archives/2019/04/index.html","61560cb7e0ca978736caffe15c672d79"],["/archives/2019/05/index.html","71672b0f1dc8c2b0f8df6be4faded4f0"],["/archives/2019/06/index.html","36b359e2ed76692707a05d30b608c14d"],["/archives/2019/09/index.html","7a324ba1b14d7c5b0b7a0febccd8ff30"],["/archives/2019/11/index.html","ad65bdf42a4fd99cc4438ea991345f3a"],["/archives/2019/index.html","d5885239efd86fc14c713f7a5f965fb0"],["/archives/index.html","238d8f695d4a29122e5bbf3e121c11b4"],["/categories/GFW/index.html","63dfe99e1afbbec8e356e92872fc0014"],["/categories/index.html","20ee5573d609f089eedd831c51aba628"],["/categories/人生规划/index.html","10c63632c27648626345df97f3eb8b7f"],["/categories/信息安全/index.html","80e067aa3d29eef3dbcdfdec3a819807"],["/categories/前端/index.html","2e4291595f0cacce33a4fe39b33a8a99"],["/categories/工具/Git/index.html","1a340dffd7e735ed2b5839d0c8013785"],["/categories/工具/index.html","d5767119b24063cc757481f1af98cdf6"],["/categories/折腾/Hexo-博客/index.html","4a3ec8daeb8a7b14ce12798b8a4e4536"],["/categories/折腾/index.html","abd9e21cd8014982159c465b9f7e9b88"],["/categories/数学/index.html","ab0d9731d1d5082d599947d1865ae631"],["/categories/数学/数学建模/index.html","c10c9e01f07725ba262b23ed283d7e7f"],["/categories/数学/概率论/index.html","f8abd3075b8f2fb0e0f75f553b8871d6"],["/categories/机器学习/index.html","bb702aa57841bbe177621cfa447e5e66"],["/categories/机器学习/分类算法/index.html","01b0ce4a91f1990f6634ea849fdf6642"],["/categories/算法/index.html","80aa6c6daabec7c59db95a8427186bf9"],["/categories/算法/信息隐藏/index.html","731e8d4a205aac0c6d196d4496fc1d6b"],["/categories/算法/随机算法/index.html","694d71beb476072b07425c5b683298e8"],["/categories/编程语言/Java/index.html","313f3bfc0f4fe6a3785e25c033e83d2c"],["/categories/编程语言/index.html","e7eb0aad9c28e3aaebf37e50d95c0471"],["/categories/编译原理/index.html","aca1f00f4276af0340f805d4175eecea"],["/categories/阅读/English/index.html","d5dd77ce681f9aa143a7c2463b9a902b"],["/categories/阅读/index.html","f80560d0a2e54608334f5d2327ac2315"],["/categories/项目/Node-js/index.html","a2603ae541546918af549fcbcc4bb7ca"],["/categories/项目/index.html","3783d23e9c09847bf4c0146c9bfbc544"],["/categories/项目/微信小程序/index.html","1b7c55123d11bbb04fc85008ac9343a6"],["/categories/项目/爬虫/index.html","c12dff96498a67649e6aace7b999f9dc"],["/css/404.css","b1bb50e1fabe41adcec483f6427fb3aa"],["/css/index.css","e5c40e6dd94aff8a10ddb423b2a74cf8"],["/css/var.css","d41d8cd98f00b204e9800998ecf8427e"],["/favicon-16x16.png","abf82e206a80781533851acbd2b6908e"],["/favicon-32x32.png","e5b33e74e08b71be1a5be38beb08857b"],["/images/icons/icon-128x128.png","fa840cb2190782b027e8ba88de7f6fe8"],["/images/icons/icon-144x144.png","d2fab2789a1fdd7c76ddcbe63bf4343f"],["/images/icons/icon-152x152.png","3ec123f662b0727bf75858bbdc5b6900"],["/images/icons/icon-192x192.png","d314e42cb2cf1a5bb650830ce45ec5cd"],["/images/icons/icon-384x384.png","dc518e1b5a41e1e419ed65554a935b84"],["/images/icons/icon-512x512.png","cf97d70d266466bed324e4253684b92a"],["/images/icons/icon-72x72.png","edb42a0b625279a68c64fbe771b2f286"],["/images/icons/icon-96x96.png","f843ab9b2296c039c74afa456fc0a8ac"],["/img/algolia.svg","fd40b88ac5370a5353a50b8175c1f367"],["/img/avatar.png","6cc4a809d23e3d8946a299ae4ce4e4cd"],["/img/background.png","e7ba4d6737d73fb2d31a122e416f7e2f"],["/index.html","b12efce21b7acd8b9fa94a02caa8adf9"],["/js/copy.js","45aae54bf2e43ac27ecc41eb5e0bacf7"],["/js/fancybox.js","f84d626654b9bbc05720952b3effe062"],["/js/fireworks.js","35933ce61c158ef9c33b5e089fe757ac"],["/js/head.js","347edd99f8e3921b45fa617e839d8182"],["/js/hexo-theme-melody.js","d41d8cd98f00b204e9800998ecf8427e"],["/js/katex.js","d971ba8b8dee1120ef66744b89cfd2b1"],["/js/scroll.js","e2433ba220e56fa03095f6164bac719e"],["/js/search/algolia.js","53160985d32d6fd66d98aa0e05b081ac"],["/js/search/local-search.js","1565b508bd866ed6fbd724a3858af5d8"],["/js/sidebar.js","d24db780974e661198eeb2e45f20a28f"],["/js/third-party/anime.min.js","9b4bbe6deb700e1c3606eab732f5eea5"],["/js/third-party/canvas-ribbon.js","09c181544ddff1db701db02ac30453e0"],["/js/third-party/jquery.fancybox.min.js","3c9fa1c1199cd4f874d855ecb1641335"],["/js/third-party/jquery.min.js","c9f5aeeca3ad37bf2aa006139b935f0a"],["/js/third-party/reveal/head.min.js","aad121203010122e05f1766d92385214"],["/js/third-party/reveal/highlight.min.js","44594243bec43813a16371af8fe7e105"],["/js/third-party/reveal/markdown.min.js","7ec4cef5a7fe3f0bf0eb4dc6d7bca114"],["/js/third-party/reveal/marked.min.js","c2a88705e206d71dc21fdc4445349127"],["/js/third-party/reveal/math.min.js","0a278fee2e57c530ab07f7d2d9ea8d96"],["/js/third-party/reveal/notes.min.js","89a0dfae4d706f9c75b317f686c3aa14"],["/js/third-party/reveal/reveal.min.js","8988419d67efb5fe93e291a357e26ec9"],["/js/third-party/reveal/zoom.min.js","9791f96e63e7d534cba2b67d4bda0419"],["/js/third-party/velocity.min.js","64da069aba987ea0512cf610600a56d1"],["/js/third-party/velocity.ui.min.js","c8ca438424a080620f7b2f4ee4b0fff1"],["/js/transition.js","911db4268f0f6621073afcced9e1bfef"],["/js/utils.js","3ff3423d966a1c351e9867813b3f6d36"],["/mstile-150x150.png","9e5dd32ade6169358a4955253716151d"],["/rss/feed-reader.png","d520b5b074d95c3bc796e007d10087f3"],["/rss/index.html","0ccba9b66c2e907af33911f025503f19"],["/rss/partnerapp-description-feedly.png","1fe402e10a68079af3c9131f5f978d3a"],["/safari-pinned-tab.svg","2872f85e12066633bd05d37e59fd75a1"],["/tags/Fourier-transform/index.html","344fa67a5cd726dec9674a79b4cb58a9"],["/tags/GFW/index.html","b3b264fabee3ed82e09b791c6a43f9a6"],["/tags/HITMers/index.html","3c4a9b5eec8a6912eb8c753b7168ccd9"],["/tags/Information-hide/index.html","5356a7e3969fb450b4be5f766cffd392"],["/tags/MCM/index.html","c02c4c9ee65e385d5ca1dd21ccaf3779"],["/tags/MIT-6-031/index.html","43209e52b4feaa1851df49f8375d1857"],["/tags/Machine-Learning/index.html","3dda636fae2f5d68e0bf75e31cf54d4c"],["/tags/Python/index.html","877bf7640ccca7088e511898b17375e5"],["/tags/Random-computering/index.html","075d0ebf01426d0e62aac10c80e653c3"],["/tags/UML/index.html","dec1396ffc18ffcebf9210c7e62d6a18"],["/tags/algorithm/index.html","c0df9e180a026b0021c762585dc9e2bf"],["/tags/arithmetic-coding/index.html","57282615dee306312049a9972a04732f"],["/tags/automata/index.html","de6dbf81e57c26a28dfbf0804abd5569"],["/tags/compilers/index.html","b20f6d0d64ca1bef598f0d85086b8032"],["/tags/delegation/index.html","aacd12980ee9b3112b7df8a319cb8cc2"],["/tags/design-patterns/index.html","6c7c49a8a084d531e5602efb126eeb02"],["/tags/english/index.html","d79a4fe241cce7e095777cc6e1660906"],["/tags/frontend/index.html","7f2e04aa8e1facf43c8f7d8499e26c4f"],["/tags/gfw/index.html","537520790fba27fc4dbbca912942ae5e"],["/tags/git/index.html","00656506de17259bcee744282dca708b"],["/tags/github/index.html","81e235ce872884bfd7f3e7ca665b6fa2"],["/tags/gitlab/index.html","84432822bbebf5f177a9732db7473df6"],["/tags/gradle/index.html","d12341872fe21117c5c0aa494268a563"],["/tags/hexo/index.html","b9ee8ce37fd446e1a4ddb9c5d7145084"],["/tags/index.html","3fb73efd1617c83350969d8b1414c608"],["/tags/java/index.html","bf12587a92224eb14248b8392de9e439"],["/tags/mathematics-modelling/index.html","7bf9fb5b06f0be3a27723c1f63237142"],["/tags/melody/index.html","0840662b41371ba662097033e22a4b97"],["/tags/randomized-algorithm/index.html","32340674f1ba2226f90d346793c43f1d"],["/tags/research/index.html","3014c07ee97b13b390b12e6cbba52eb2"],["/tags/socks/index.html","f4ace24fe665fceef32dc60440c03111"],["/tags/software-construction/index.html","a734cd0048ed0ce94bb3364e40fa4fc6"],["/tags/travis-ci/index.html","360dfea73b8c24dd48fdb07d709d67e3"],["/tags/保研/index.html","2f1931344b8f641848e3c21094e8bf7d"],["/tags/信息安全/index.html","7ac5b92691a15ce4841a8f393780ee8c"],["/tags/傅里叶变换/index.html","1113f3853d14d6f455a3873eab462b1d"],["/tags/微博/index.html","54e6a0938ec96d6c0adbb122034559aa"],["/tags/机器学习/index.html","a5a241a4f048dd64a513977191d5f684"],["/tags/概率论/index.html","2f93b9458973761c8fcb8ae4557a9028"],["/tags/爬虫/index.html","5e860668727d52deb9e71729e5692689"],["/tags/特征向量/index.html","49981be27fd225e5fc6bdafaa879f0e5"],["/tags/科学上网/index.html","13f0d6c4e6bb7bd7fe26d695f446d678"],["/tags/线性代数/index.html","78f80131ef676e1fc9d1c3f8a93126ff"],["/tags/行列式/index.html","c615a7ebaed2e431421fc39820c762cf"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







