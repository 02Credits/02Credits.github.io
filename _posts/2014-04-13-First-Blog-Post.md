---
layout: post
title: Jekyll As a Blog Engine
author: Keith
---

As the first post on the blog, I thought I would explain a bit about the technology behind it, but first an introduction to what I plan on using the blog for.

As a general rule of thumb, posts by me, will be more about the technical aspect of game development. I plan on writing on a variety of topics ranging from new programming languages to techniques used in game programming to new technologies as they come out along with updates on the programming side of our various projects at 02Credits. I will be unlikely to write much commentary on the social side or much about the artwork that goes into game development as a whole. For that you should look for JonJo's posts as he is more into the design and progression of creating a game than the code and back end.

A Bit of History
----------------
Back in junior high I created my first foray into webdevelopment and blogging which can still (to my surprise) be found [here](http://keith.the-simmons.net/). I periodically posted to it but not enough to get any readers other than my parents and grandparents (as well as JonJo's little brother oddly enough). Originally I used a dynamic blog engine built on ASP.net called [Dasblog](http://dasblog.codeplex.com/) which [Scott Hanselman](http://hanselman.com/) used for his blog. I used this for a while but was never happy with the theme engine or with how it handled writing new posts as it didn't integrate well with Windows Live Writer at the time. This was the main motivation to moving to [BlogEngine.Net](http://dotnetblogengine.net/) which served me well for a good long while and has a much more useful and customizable templating engine.

Over time though the blog took the back burner of the back burner as AP classes and 7Bomb took the front seat. During this time I experimented with web development and technologies, fiddling with css design and html5 features. This gave me a better appreciation for the power of hand written websites and pushed me to try to think of ways to make a blog system that I completely understood top to bottom.

My first attempt at such a system was to build my own using primarily client side javascript to compile the list of posts and use dynamic loading to create css transitions for the navigation. This worked somewhat well, but had a couple of issues. First being that the css was slow on the phone and (curiously) on my chrome browser. Second, I had to build up a list of posts manually which was a pain. Third, I had to upload my posts to the server with ftp, also a pain. Lastly and most importantly, I had to write my posts in plain html. All of these issues left me with a bad taste in my mouth, so I took a break on working on the site to go work on school and our various games for a while.

Just last night however I got it in my head that I wanted to start writing posts regarding our most recent game (I'll get to it soon). I remembered seeing a static site generator on [GitHub](http://github.com/)  a while back on the trending page, and sure enough I found [Jekyll](http://jekyllrb.com/), an extremely simple static site generator built with blogging in mind and with GitHub source control support through GitHub Pages.

Jekyll: The Baser Nature of Blogging
------------------------------------
With a little bit of research I quickly found that Jekyll could take me miles further than any of my previous blog engines. It handles posts in a sustainable way by building up a list from the /_posts directory for use in the [Liquid](http://docs.shopify.com/themes/liquid-basics) templating system with dates, authors, and other variables created in the Yaml formatted front matter. It allows the use of [Markdown](http://daringfireball.net/projects/markdown/) for content which means that JonJo might be able to write out posts using it instead of having me transcribe for him (although it looks like he will be doing image based posts). The real nail in the coffin that convinced me to switch though was the integration with GitHub.

GitHub offers [GitHub Pages](https://pages.github.com/) which is a service meant for website hosting for organizations, individual users, and projects using Git source control and Jekyll. It handles the usage of Python and Ruby, and provides a couple of extensions including one for code highlighting. It also provides a subdomain on github that you can use which is simply your organization/user/project-name.github.io. You can also use or own private domain if you would like by either having github handle the DNS or setting up a separate DNS server to point to GitHub's address like we will shortly.

I'm still working out the kinks of the formatting and the site design as it is looking pretty bare bones at the moment, but I don't foresee difficulties because Jekyll is such a lightweight layer on top of pure html. So far my experience has been stellar with both Jekyll and GitHub Pages and should enable me to focus on the important parts of webdesign instead of wasting time [Shaving Yacks](http://www.hanselman.com/blog/YakShavingDefinedIllGetThatDoneAsSoonAsIShaveThisYak.aspx).

Future of 02Credits
-------------------
Now that I have a setup to start creating posts and improving the website, I plan on making changes to the theme and possibly writing about our most recent project over the next week. I'm also planning on adding a comment system through [Disqus](http://www.disqus.com/) which should be working shortly. Hopefully this is the start of something great. Only time will tell.
