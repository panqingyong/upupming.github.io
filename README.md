# Continuous integration hexo blog

Using [hexo-theme-melody](https://github.com/Molunerfinn/hexo-theme-melody) and Travis CI to build a beautiful hexo blog in a fast and with-version-control way.

Do all things on `source` branch.

# Configuration

1. Fork this repo and rename it to `your-username.github.io`.
2. Delete the `source/_drafts/` and `source/_posts/` folders.
3. Modify other configurations as needed, especially `_config.yml` in the root folder and the `source/_data/melody.yml`(Follow the [hexo-theme-melody-doc](https://molunerfinn.com/hexo-theme-melody-doc/#/?id=hexo-theme-melody)).
4. Modify `.travis.yml` and `.gitlab-ci.yml` for continuous integration build your blog. See [this post](https://upupming.site/2018/04/08/beautify-hexo-SEO-travis/) for more information.
5. Sync and activate your repo on https://travis-ci.com/.

# Environment variables you need to config

For security, we should not publish our personal API keys on GitHub repo.

1. `GH_TOKEN`
  
    See https://github.com/settings/tokens 

2. `GL_TOKEN`

    See https://gitlab.com/profile/personal_access_tokens

3. Algolia search(only if you use it)

    See [hexo-algoliasearch/lib/algolia.js](https://github.com/LouisBarranqueiro/hexo-algoliasearch/blob/8b8fb278cb6027a56035adc5da001050cf9bf100/lib/algolia.js#L20)

    You need four environment variables: `ALGOLIA_APP_ID`, `ALGOLIA_API_KEY`, `ALGOLIA_ADMIN_API_KEY` and `ALGOLIA_INDEX_NAME`.

Configure them in Travis settings like below:

<img src=https://user-images.githubusercontent.com/24741764/42017071-613dc3a8-7ae0-11e8-93d7-21a881b2ebcc.png>

# Start blogging

1. Write a post

    ```bash
    $ hexo new post my-first-post
    ... writing...
    ```

2. deploy to the origin

    ```bash
    $ ./deploy.sh "Added: my first post"
    ```

    or just
    ```bash
    $ ./deploy.sh
    ```
    which is equivalent to 
    ```bash
    $ ./deploy.sh "Updated: blog source"
    ```


