[![travis](https://travis-ci.org/stevenbraham/hanze-personal-website.svg?branch=master)](https://travis-ci.org/stevenbraham/hanze-personal-website)
# About this repository #
For a school assignment I had to create a html website based on Sketch design I had designed earlier. The school assignment was very simple, because it was the first graded assignment of the first year.

I just had to create valid html and css based on the pages on my design. Furthermore the website only needed to work in the latest version of Chrome, Firefox and Edge and there were no rules about responsive design.

Therefore I decided to experiment a bit with frontend tech I had rarely used: Gulp, Handlebars and Sass. The result is a modular html site with a lot of reusable html partials for the project.

# How to build and dev
1. If you haven't already, please install the latest [NodeJS version for your OS](https://nodejs.org/)
2. Same goes for [Sass](http://sass-lang.com/install)
3. Clone this repository
4. Run `npm install`

Afterwards npm will fire the `gulp build` command. This command copies everything from source to build and compiles the Sass and Handlebars files.

An automated file watcher and webserver is included in the gulp file and can be executed by running `gulp`. This will start a webserver on [http://localhost:8080](http://localhost:8080).

__Important__:
* **Without a webserver you can't view the website properly due to the usage of relative urls**
* **There was a weird requirement for the code to be formatted with tabs instead of spaces. Therefore the gulp build will replace the spaces with tabs**

# File layout #
Like I said everything is contained in the source dir:
* *source/config* contains json files used by the gulp file.
* *handlebars.json* contains common variables used the layout such as lists of menu items
* *images* and *js* are just copied from source to build wihtout any special edits
* *pages* contains files that are placed in the root of the build folder after the Handlebars expressions are compiled
* *partials* contains loose Handlebars elements such as the header, buttons, footer etc. that can be used in pages
* *sccs* contains Sass files that will be compiled and copied to the *build/css* folder