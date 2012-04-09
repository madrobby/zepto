Zepto.js documentation site
===========================

Site is built with [Jekyll][], where each Zepto method is a Jekyll "post". They
each render to individual files, but they don't matter because the docs are all
compiled in one page (index.html).

Jekyll categories correspond to Zepto modules, e.g. "ajax" and "event". The
exception is the "changelog" category, which contains release notes.

The site can be built with:

~~~ sh
$ jekyll
$ open public/index.html
~~~

Faster building & rebuilding
----------------------------

The `jekyll` command to rebuild the site can be slow because of syntax
highlighting with [Albino][]. There is an executable which uses a fork of Jekyll
that uses [Pygments.rb][] and is thus faster:

~~~ sh
# check if you have necessary gems installed
$ script/doctor

# faster rebuild!
$ script/jekyll [<file>, [<file2>, ...]]
~~~

For quicker rebuilding of the site, you can start up [Guard][]:

~~~ sh
$ script/doctor    # check dependencies
$ script/guard     # live rebuilding of the site!
~~~

Guard will use Jekyll to rebuild parts of the site as individual files change.

Because the site is rendered to "public/" directory, [Pow][] can be configured
to serve it:

~~~ sh
# while in repo's root dir:
$ ln -s `pwd` ~/.pow/zepto
$ open http://zepto.dev
~~~

To have your desktop browser automatically reload after changes, install [the
LiveReload browser extension][lr], open "zepto.dev" and enable LiveReload in the
browser (usually via button added by the extension) while Guard is running.

iOS clients are automatically configured with this functionality (no browser
plugin needed) when running locally.


  [jekyll]: http://jekyllrb.com/
  [pow]: http://pow.cx/
  [lr]: http://help.livereload.com/kb/general-use/browser-extensions
  [albino]: https://github.com/github/albino#readme
  [pygments.rb]: https://github.com/tmm1/pygments.rb#readme
  [guard]: https://github.com/guard/guard#readme
